import React, { useState } from "react";
import Header from "../components/Header.jsx";
import SearchDrawer from "../components/SearchDrawer.jsx";
import { Box } from "@mui/material";
import ChatWindow from "../components/ChatWindow.jsx";
import Chats from "../components/Chats.jsx";

const Home = () => {
  const [isSearchDrawerOpen, setSearchDrawerOpen] = useState(false);

  const handleSearchClick = () => {
    setSearchDrawerOpen(true);
  };

  const handleSearchDrawerClose = () => {
    setSearchDrawerOpen(false);
  };

  return (
    <Box
      sx={{
        height: "100vh", // Full viewport height
        display: "flex",
        flexDirection: "column",
        backgroundColor: "#f0f0f0",
        overflow: "hidden", // Prevent scrolling on the entire page
      }}
    >
      {/* Header */}
      <Header onSearchClick={handleSearchClick} />

      {/* Search Drawer */}
      <SearchDrawer
        open={isSearchDrawerOpen}
        onClose={handleSearchDrawerClose}
      />

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          overflow: "hidden", // Prevent scrolling within main content
        }}
      >
        {/* Left Pane: Chats */}
        <Box
          sx={{
            width: "300px", // Fixed width for chat list
            borderRight: "1px solid #ddd",
            backgroundColor: "#ffffff",
            overflowY: "auto", // Scrollable if chat list overflows
          }}
        >
          <Chats />
        </Box>

        {/* Right Pane: Chat Window */}
        <Box
          sx={{
            flex: 1, // Take the remaining space
            overflow: "hidden", // Prevent overflow
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ChatWindow />
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
