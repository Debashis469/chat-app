import React, { useState, useEffect } from "react";
import { fetchChats } from "../store/chatSlice";
import { useSelector, useDispatch } from "react-redux";
import {
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ChatItem from "./ChatItem"; // Component to display individual chat item
import { selectChat, fetchMessages } from "../store/chatSlice";
import CreateGroupModal from "./CreateGroupModal";

const Chats = () => {
  const [query, setQuery] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const dispatch = useDispatch();
  const { chats, loading, selectedChat } = useSelector((state) => state.chats);
  const currentUser = useSelector((state) => state.user.user);

  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.isGroupChat
      ? null
      : chat.users.find((user) => user._id !== currentUser._id);

    const chatName = chat.isGroupChat ? chat.groupName : otherUser.username;
    return chatName.toLowerCase().includes(query.toLowerCase());
  });

  const handleChatSelect = (chat) => {
    dispatch(selectChat(chat));
    dispatch(fetchMessages(chat._id));
  };

  const handleCreateGroup = (data) => {
    console.log("Group Created:", data); // Replace with actual API call
  };

  useEffect(() => {
    dispatch(fetchChats);
  }, [dispatch]);

  return (
    <Box
      sx={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#F4F4F4",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: 2,
        }}
      >
        <Typography variant="h6">Chats</Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setModalOpen(true)}
        >
          Create Group
        </Button>
      </Box>

      <TextField
        fullWidth
        label="Search Chats"
        variant="outlined"
        size="small"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ marginBottom: 2 }}
      />

      {loading ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <Box sx={{ flex: 1, overflowY: "auto" }}>
          {filteredChats.length > 0 ? (
            filteredChats.map((chat) => (
              <ChatItem
                key={chat._id}
                chat={chat}
                isSelected={selectedChat?._id === chat._id}
                onSelect={() => handleChatSelect(chat)}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ textAlign: "center" }}>
              No chats found
            </Typography>
          )}
        </Box>
      )}
      <CreateGroupModal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        onCreateGroup={handleCreateGroup}
      />
    </Box>
  );
};

export default Chats;
