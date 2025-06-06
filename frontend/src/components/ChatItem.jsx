import React from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessages, selectChat } from "../store/chatSlice.js"; // Example actions, ensure they exist.

const ChatItem = ({ chat, isSelected }) => {
  const dispatch = useDispatch();

  // Get current user from the Redux store
  const currentUser = useSelector((state) => state.user.user);

  // Identify the other user
  const otherUser = chat.isGroupChat
    ? null
    : chat.users.find((user) => user._id !== currentUser._id);

  // Handle chat selection
  const handleSelectChat = () => {
    // Dispatch action to select the chat
    dispatch(selectChat(chat));

    // Fetch messages for the selected chat
    dispatch(fetchMessages(chat._id));
  };

  return (
    <Box
      onClick={handleSelectChat}
      sx={{
        display: "flex",
        alignItems: "center",
        padding: 1,
        marginBottom: 1,
        borderRadius: 1,
        backgroundColor: isSelected ? "#E0F7FA" : "#fff",
        cursor: "pointer",
        "&:hover": {
          backgroundColor: "#f0f0f0",
        },
      }}
    >
      {/* Display group avatar or the other user's profile picture */}
      <Avatar
        sx={{ marginRight: 2 }}
        src={chat.isGroupChat ? chat.groupAvatar : otherUser?.profilePicture}
      />
      <Box>
        {/* Display group name or the other user's username */}
        <Typography variant="body1" sx={{ fontWeight: "bold" }}>
          {chat.isGroupChat ? `${chat.groupName} 😄` : otherUser?.username}
        </Typography>
        {/* Display group description or the other user's email */}
        <Typography variant="body2" color="textSecondary">
          {chat.isGroupChat ? chat.groupDescription : otherUser?.email}
        </Typography>
      </Box>
    </Box>
  );
};

export default ChatItem;
