import express from 'express'
import { protectRoute } from "../middleware/auth.middleware.js";
import { getStreamToken } from "../controllers/chat.controller.js"; // stream ke user ar kache authenticate korar jonno use hoi


const router = express.Router();

router.get("/token",protectRoute,getStreamToken)

export default router;


// 🔍 Context:
// You're working with Stream Chat (a chat SDK), and to connect any user to Stream's real-time chat, you must generate a user-specific token.

// ✅ Purpose of getStreamToken:
// getStreamToken controller generates a chat token for the currently logged-in user so they can connect to Stream Chat from the frontend (like React, etc.).