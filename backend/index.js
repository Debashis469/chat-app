// Import necessary modules
import dotenv from "dotenv";
dotenv.config(); // Load environment variables

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { Server } from "socket.io"; // Import socket.io
import http from "http"; // Import HTTP server

import authRouter from "./routes/auth.route.js";
import userRouter from "./routes/user.route.js";
import chatRouter from "./routes/chat.route.js";
import messageRouter from "./routes/message.route.js";

const app = express();
const MONGO_URL = "mongodb://localhost:27017/chat-app";
const PORT = 5000;

// Create HTTP server to integrate with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000", // Adjust the origin based on your client URL
    methods: ["GET", "POST"],
  },
});

// Middleware to parse JSON requests
app.use(express.json());
app.use(cors());

// Routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/chats", chatRouter);
app.use("/message", messageRouter);

// Error handler
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";
  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

// Start the server
mongoose
  .connect(MONGO_URL)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server running at port ${PORT} and connected to DB`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

// Socket.IO logic
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join a specific chat room
  socket.on("joinChat", (chatId) => {
    socket.join(chatId);
    console.log(`User joined chat room: ${chatId}`);
  });

  socket.on("leaveRoom", (chatId ) => {
    socket.leave(chatId);
    console.log(`User left room: ${chatId}`);
  })

  // Listen for new messages
  socket.on("newMessage", (message) => {
    const { chat, content, sender } = message;

    console.log("New message received" , message) 
    // Emit the new message to all clients in the chat room
    console.log("Chat Room : " , chat) ;
    io.to(chat).emit("messageReceived", message );
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});
