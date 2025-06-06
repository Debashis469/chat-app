import jwt from "jsonwebtoken";
import dotenv from "dotenv" ;

// Secret key for JWT (make sure to store this in environment variables)
const SECRET_KEY = process.env.SECRET_KEY ;

const authenticate = (req, res, next) => {
  // Get token from headers
  const token = req.headers.authorization?.split(" ")[1];

  console.log("token : " , token) ;

  // Check if token is available
  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    // Verify token and decode user information
    const decoded = jwt.verify(token, SECRET_KEY);


    console.log("decoded : " , decoded) ;
    // Attach user information to req.user
    req.user = decoded;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    next(error);
  }
};

export default authenticate;
