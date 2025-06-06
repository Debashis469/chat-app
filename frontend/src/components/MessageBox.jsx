import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Avatar,
  Typography,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { io } from "socket.io-client";
import axios from "axios";

const ENDPOINT = "http://localhost:5000";

const MessageBox = ({ chatId, currentUserId, isGroupChat }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [socket, setSocket] = useState(null);

  //socket connection setup....
  useEffect(() => {
    const socketInstance = io(ENDPOINT, {
      transports: ["websocket"],
      reconnection: true,
    });

    socketInstance.on("connection", () => {
      console.log("Connected to socket server");
    });

    socketInstance.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const token = localStorage.getItem("token");

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        "/message/save",
        { content: newMessage, chatId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      console.log(response.data);

      //socket for real time messaging
      socket.emit("newMessage", response.data.message);

      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`/message/messages/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [chatId, token]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (socket && chatId) {
      // Emit the join room event
      socket.emit("joinChat", chatId);

      console.log(`Joined chat room: ${chatId}`);

      // Cleanup on chatId change or component unmount
      return () => {
        socket.emit("leaveRoom", chatId);
        console.log(`Left room: ${chatId}`);
      };
    }
  }, [chatId, socket]);

  useEffect(() => {
    if (socket) {
      // Listen for incoming messages
      socket.on("messageReceived", (message) => {
        console.log("Real-time message received:", message);
        setMessages((prev) => [...prev, message]);
      });
  
      // Cleanup listener on component unmount or socket change
      return () => {
        socket.off("messageReceived");
      };
    }
  }, [socket]);
  

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        overflowY: "hidden",
        border: "1px solid #ccc",
        backgroundColor: "#f9f9f9",
      }}
    >
      {/* Messages Section */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          padding: 2,
        }}
      >
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress />
          </Box>
        ) : (
          messages.map((msg) => {
            const isSender = msg.sender._id === currentUserId;

            return (
              <Box
                key={msg._id}
                sx={{
                  display: "flex",
                  flexDirection: isSender ? "row-reverse" : "row",
                  alignItems: "center",
                  marginBottom: 2,
                }}
              >
                {/* Avatar */}
                {!isSender && isGroupChat && (
                  <Avatar
                    src={msg.sender.profilePicture}
                    alt={msg.sender.username}
                    sx={{
                      width: 36,
                      height: 36,
                      marginLeft: isSender ? 1 : 0,
                      marginRight: isSender ? 0 : 1,
                    }}
                  />
                )}

                <Box
                  sx={{
                    position: "relative",
                    maxWidth: "70%",
                  }}
                >
                  {!isSender && isGroupChat && (
                    <Typography
                      variant="caption"
                      sx={{ color: "#666", marginBottom: "4px" }}
                    >
                      {msg.sender.username}
                    </Typography>
                  )}
                  <Paper
                    elevation={3}
                    sx={{
                      padding: "10px 15px",
                      backgroundColor: isSender ? "#d1f8d5" : "#ffffff",
                      color: "#333",
                      borderRadius: "15px",
                      position: "relative",
                    }}
                  >
                    <Typography variant="body2" sx={{ wordWrap: "break-word" }}>
                      {msg.content}
                    </Typography>
                    {/* Arrow */}
                    <Box
                      sx={{
                        position: "absolute",
                        width: 0,
                        height: 0,
                        borderStyle: "solid",
                        borderWidth: isSender
                          ? "10px 0 10px 10px"
                          : "10px 10px 10px 0",
                        borderColor: isSender
                          ? "transparent transparent transparent #d1f8d5"
                          : "transparent #ffffff transparent transparent",
                        top: "10px",
                        right: isSender ? "-10px" : "auto",
                        left: isSender ? "auto" : "-10px",
                      }}
                    />
                  </Paper>
                </Box>
              </Box>
            );
          })
        )}
        <div ref={chatEndRef}></div>
      </Box>

      {/* Input Section */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          padding: 1,
          borderTop: "1px solid #ddd",
          backgroundColor: "#ffffff",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
        />
        <IconButton
          onClick={handleSendMessage}
          sx={{ marginLeft: 1, color: "#007bff" }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MessageBox;
