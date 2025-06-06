import Chat from "../models/chat.model.js";

// Access or create a private chat with another user
const accessPrivateChat = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;
    const { friendId } = req.body;

    // Check if the chat already exists between the two users
    let chat = await Chat.findOne({
      isGroupChat: false,
      users: { $all: [currentUserId, friendId] },
    }).populate("users", "username email profilePicture");

    if (!chat) {
      // If no chat exists, create a new chat
      chat = await Chat.create({
        isGroupChat: false,
        users: [currentUserId, friendId],
      });

      chat = await chat.populate("users", "username email profilePicture");
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error accessing private chat:", error);
    next(error);
  }
};

// Fetch all chats for the current user
const fetchUserChats = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;

    const chats = await Chat.find({
      users: currentUserId,
    })
      .populate("users", "username email profilePic")
      .populate("groupAdmin", "username email profilePic")
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    return res.status(200).json(chats);
  } catch (error) {
    console.error("Error fetching user chats:", error);
    next(error);
  }
};

// Access group chat
const accessGroupChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findById(chatId)
      .populate("users", "username email profilePic")
      .populate("groupAdmin", "username email profilePic");

    if (!chat || !chat.isGroupChat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error accessing group chat:", error);
    next(error);
  }
};

// Create a new group chat
const createGroupChat = async (req, res, next) => {
  try {
    const currentUserId = req.user.userId;
    const { groupName, users } = req.body;

    if (!groupName || !users || users.length < 2) {
      return res.status(400).json({
        message: "Group chat requires a name and at least two members",
      });
    }

    const groupChat = await Chat.create({
      isGroupChat: true,
      groupName,
      users: [...users, currentUserId],
      groupAdmin: currentUserId,
    });

    // Re-fetch the newly created group chat to populate required fields
    const populatedGroupChat = await Chat.findById(groupChat._id)
      .populate("users", "username email profilePicture")
      .populate("groupAdmin", "username email profilePicture");

    return res.status(201).json(populatedGroupChat);
  } catch (error) {
    console.error("Error creating group chat:", error);
    next(error);
  }
};

// Rename group chat
const renameGroupChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { newName } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { groupName: newName },
      { new: true }
    )
      .populate("users", "username email profilePicture")
      .populate("groupAdmin", "username email profilePicture");

    if (!chat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error renaming group chat:", error);
    next(error);
  }
};

// Add a user to the group chat
const addToGroup = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $addToSet: { users: userId } },
      { new: true }
    )
      .populate("users", "username email profilePicture")
      .populate("groupAdmin", "username email profilePicture");

    if (!chat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error adding user to group chat:", error);
    next(error);
  }
};

// Remove a user from the group chat
const removeFromGroup = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const { userId } = req.body;

    const chat = await Chat.findByIdAndUpdate(
      chatId,
      { $pull: { users: userId } },
      { new: true }
    )
      .populate("users", "username email profilePicture")
      .populate("groupAdmin", "username email profilePicture");

    if (!chat) {
      return res.status(404).json({ message: "Group chat not found" });
    }

    return res.status(200).json(chat);
  } catch (error) {
    console.error("Error removing user from group chat:", error);
    next(error);
  }
};

// Delete a chat (private or group)
const deleteChat = async (req, res, next) => {
  try {
    const { chatId } = req.params;

    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    return res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    console.error("Error deleting chat:", error);
    next(error);
  }
};

export {
  accessPrivateChat,
  fetchUserChats,
  accessGroupChat,
  createGroupChat,
  renameGroupChat,
  addToGroup,
  removeFromGroup,
  deleteChat,
};
