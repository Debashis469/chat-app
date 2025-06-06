import React, { useState } from "react";
import {
  Drawer,
  Box,
  TextField,
  IconButton,
  InputAdornment,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { Search, Close } from "@mui/icons-material";
import axios from "axios";
import { fetchChats } from "../store/chatSlice";
import { useDispatch } from "react-redux";

const SearchDrawer = ({ open, onClose }) => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const dispatch = useDispatch();

  const handleSearch = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "/users/searchUser",
        { query },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchResults(response.data); // Assuming response.data contains the user list
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  const handleChatAccess = async (userId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.post(
        "/chats/private",
        { friendId: userId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      onClose();

      dispatch(fetchChats);

      console.log("Chat accessed:", response.data); // Handle chat access logic here
    } catch (error) {
      console.error("Error accessing chat:", error);
    }
  };

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      <Box
        sx={{
          width: 300,
          padding: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="h6">Search Users</Typography>
          <IconButton onClick={onClose}>
            <Close />
          </IconButton>
        </Box>

        {/* Search Bar and Button on the Same Line */}
        <Box
          sx={{ display: "flex", alignItems: "center", width: "100%", mt: 2 }}
        >
          <TextField
            variant="outlined"
            size="small"
            fullWidth
            placeholder="Search users"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
          <IconButton color="primary" onClick={handleSearch} sx={{ ml: 1 }}>
            <Search />
          </IconButton>
        </Box>

        {/* Display Search Results */}
        <List sx={{ width: "100%", mt: 2 }}>
          {searchResults.map((user) => (
            <ListItem
              key={user._id}
              sx={{
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
              }}
              onClick={() => handleChatAccess(user._id)}
            >
              <ListItemAvatar>
                <Avatar src={user.profilePicture} alt={user.username} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography fontWeight="bold">{user.username}</Typography>
                }
                secondary={user.email}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default SearchDrawer;
