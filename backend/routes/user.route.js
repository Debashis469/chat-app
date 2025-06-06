// auth.routes.js
import express from "express";
import { fetchUserFromToken, searchUsers } from "../controllers/user.controller.js";
import authenticate from "../middlewares/authenticate.js";

const router = express.Router();

router.use(authenticate) ;

router.post("/searchUser" , searchUsers) ;
router.get("/fetchUser", fetchUserFromToken) ;

export default router;
