import Message from "../models/message.model.js"; // Adjust the path as necessary
import Chat from "../models/chat.model.js"; // Assuming you have a chat model for referencing chat rooms
import User from "../models/user.model.js"; // Assuming you have a user model for referencing users
import { validationResult } from "express-validator"; // Optional for validation

// Controller for saving messages
import { encrypt, decrypt } from "../utils/encryption.js";

// In saveMessage controller, encrypt the content before saving
const saveMessage = async (req, res) => {
  const senderId = req.user.userId;
  const { chatId, content, messageType = "text" } = req.body;

  try {
    // Validate sender and chat existence (same as before) ...

    // Encrypt message content before saving
    const encryptedContent = encrypt(content);

    const message = new Message({
      sender: senderId,
      chat: chatId,
      content: encryptedContent,
      messageType,
    });

    const savedMessage = await message.save();

    const populatedMessage = await savedMessage.populate(
      "sender",
      "email username profilePicture"
    );

    // Decrypt message content before sending response
    populatedMessage.content = decrypt(populatedMessage.content);

    return res.status(201).json({ message: populatedMessage });
  } catch (error) {
    console.error("Error saving message:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// In getMessages controller, decrypt content after fetching
const getMessages = async (req, res) => {
  const { chatId } = req.params;

  try {
    // Validate chat existence (same as before) ...

    let messages = await Message.find({ chat: chatId })
      .populate("sender", "username email profilePicture")
      .sort({ timestamp: 1 });

    // Decrypt all message contents
    messages = messages.map((msg) => {
      return {
        ...msg.toObject(),
        content: decrypt(msg.content),
      };
    });

    return res.status(200).json({ messages });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export { getMessages, saveMessage };
