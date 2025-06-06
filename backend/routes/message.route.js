import express from "express";
import { saveMessage, getMessages } from "../controllers/message.controller.js";
import  authenticate  from "../middlewares/authenticate.js"; // Assuming you have authentication middleware

const router = express.Router();

router.use(authenticate) ;

// Route to save a message
router.post("/save", saveMessage);

// Route to get messages for a particular chat room
router.get("/messages/:chatId", getMessages);

export default router;
