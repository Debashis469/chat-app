// Import the User model
import User from "../models/user.model.js";

// Search users by email or username with regex, excluding the current user
const searchUsers = async (req, res, next) => {
  try {
    // Get search query and current user's ID from request
    const { query } = req.body;

    const currentUserId = req.user.userId; // Assuming you get current user's ID from the JWT middleware

    // Build regex for case-insensitive search
    const regex = new RegExp(query, "i");

    // Find users where email or username matches the regex, excluding the current user
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUserId } }, // Exclude current user
        {
          $or: [{ username: { $regex: regex } }],
        },
      ],
    });

    // Return the fetched users
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error searching users:", error);

    next(error);
  }
};

// Fetch user details from JWT token
const fetchUserFromToken = async (req, res, next) => {
  try {
    const userId = req.user.userId; // Current user's ID from JWT middleware

    // Find the user by their ID
    const user = await User.findById(userId).select("-password"); // Exclude password field

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user from token:", error);
    next(error);
  }
};

export { searchUsers, fetchUserFromToken };
