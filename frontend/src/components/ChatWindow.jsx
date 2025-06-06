import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, Avatar } from "@mui/material";
import MessageBox from "./MessageBox";

const ChatWindow = () => {
  const { selectedChat } = useSelector((state) => state.chats);
  const currentUser = useSelector((state) => state.user.user);

  if (!selectedChat) {
    return (
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">Select a chat to continue chatting</Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #ddd",
        }}
      >
        <Avatar
          src={
            selectedChat.isGroupChat
              ? selectedChat.groupPicture
              : selectedChat.users.find((user) => user._id !== currentUser._id)
                  ?.profilePicture
          }
          sx={{ width: 40, height: 40, marginRight: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: "bold" }}>
          {selectedChat.isGroupChat
            ? selectedChat.groupName
            : selectedChat.users.find((user) => user._id !== currentUser._id)
                ?.username}
        </Typography>
      </Box>

      {/* Message Box */}
      <MessageBox chatId={selectedChat._id}  isGroupChat={selectedChat.isGroupChat} currentUserId={currentUser._id} />
    </Box>
  );
};

export default ChatWindow;
