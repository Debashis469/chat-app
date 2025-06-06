import express from "express";
import {
  accessPrivateChat,
  fetchUserChats,
  accessGroupChat,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
  deleteChat,
} from "../controllers/chat.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

// Middleware to authenticate all chat routes
router.use(authenticate);

// Route to access a private chat with another user
router.post("/private", accessPrivateChat);

// Route to fetch all chats of the current user
router.get("/user-chats", fetchUserChats);

// Route to access an existing group chat
router.get("/group/:chatId", accessGroupChat);

// Route to create a new group chat
router.post("/group", createGroupChat);

// Route to rename a group chat
router.put("/group/:chatId/rename", renameGroupChat);

// Route to add a user to an existing group chat
router.put("/group/:chatId/add", addToGroup);

// Route to remove a user from an existing group chat
router.put("/group/:chatId/remove", removeFromGroup);

// Route to delete a chat (private or group)
router.delete("/:chatId", deleteChat);

export default router;