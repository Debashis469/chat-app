import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.SECRET_KEY, { expiresIn: "48h" });
  return token;
};

const getUserIdFromToken = (token) => {
  try {
    const decodedToken = jwt.verify(token, SECRET_KEY);
    return decodedToken.userId;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      console.error("Token has expired");
      return null; // Or handle it based on your use case, such as throwing an error
    } else {
      console.error("Invalid token");
      return null; // Or handle other errors like invalid signature
    }
  }
};

export { generateToken, getUserIdFromToken };
