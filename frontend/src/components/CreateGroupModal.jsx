import React, { useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Typography,
  Button,
  Chip,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateGroupModal = ({ open, onClose, onCreateGroup }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [creatingGroup, setCreatingGroup] = useState(false); // To manage button state

  const navigate = useNavigate() ;


  // Simulate API call for user search
  const handleSearch = async (query) => {
    const token = localStorage.getItem("token");

    try {
      setLoading(true);
      const response = await axios.post(
        "/users/searchUser",
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setSearchResults(response.data); // Assuming response.data contains the user list
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching users. Please try again.");
      console.error("Error fetching search results:", error);
    }
  };

  const handleAddUser = (user) => {
    if (selectedUsers.some((u) => u._id === user._id)) {
      toast.warn(`${user.username} is already added.`);
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== userId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      toast.error("Group name is required.");
      return;
    }
    if (selectedUsers.length === 0) {
      toast.error("Add at least one user to create a group.");
      return;
    }

    const token = localStorage.getItem("token");
    const users = [...selectedUsers ]; // Include the current user

    try {
      setCreatingGroup(true);
      const response = await axios.post(
        "/chats/group",
        { groupName, users },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCreatingGroup(false);
      toast.success("Group chat created successfully!");
      navigate(0) ;
      onCreateGroup(response.data); // Pass the created group data to parent
      onClose(); // Close the modal
    } catch (error) {
      setCreatingGroup(false);
      toast.error("Error creating group chat. Please try again.");
      console.error("Error creating group chat:", error);
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} aria-labelledby="create-group-modal">
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" id="create-group-modal" gutterBottom>
            Create Group Chat
          </Typography>
          <TextField
            label="Group Name"
            fullWidth
            variant="outlined"
            margin="normal"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <TextField
            label="Search Users"
            fullWidth
            variant="outlined"
            margin="normal"
            value={searchTerm}
            onChange={(e) => {
              const val = e.target.value;
              setSearchTerm(val);
              handleSearch(val);
            }}
          />
          {loading ? (
            <CircularProgress
              size={24}
              sx={{ mt: 2, display: "block", mx: "auto" }}
            />
          ) : (
            <Box sx={{ maxHeight: 150, overflowY: "auto", mt: 2 }}>
              {searchResults.map((user) => (
                <Box
                  key={user._id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    p: 1,
                    borderBottom: "1px solid #ddd",
                    cursor: "pointer",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  onClick={() => handleAddUser(user)}
                >
                  <Avatar
                    src={user.profilePicture}
                    alt={user.username}
                    sx={{ width: 40, height: 40 }}
                  />
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {user.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user.email}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          )}
          <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 1 }}>
            {selectedUsers.map((user) => (
              <Chip
                key={user._id}
                label={user.username}
                onDelete={() => handleRemoveUser(user._id)}
                sx={{ mb: 1 }}
              />
            ))}
          </Box>
          <Button
            variant="contained"
            fullWidth
            sx={{ mt: 3 }}
            onClick={handleCreateGroup}
            disabled={creatingGroup} // Disable while creating group
          >
            {creatingGroup ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              "Create Group"
            )}
          </Button>
        </Box>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default CreateGroupModal;
