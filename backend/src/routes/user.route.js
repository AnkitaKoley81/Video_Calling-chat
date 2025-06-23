import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js";
import { acceptFriendRequest, getFriendRequest, getMyFriends, getOutgoingFriendReqs, getRecommendedUsers, sendFriendRequest } from "../controllers/user.controller.js";

const router = express.Router();

//APPLY AUTH MIDDLEWARE TO ALL ROUTE
router.use(protectRoute)

router.get("/",getRecommendedUsers)
router.get("/friends",getMyFriends)
router.post("/friend-request/:id",sendFriendRequest);
router.put("/friend-request/:id/accept",acceptFriendRequest);

router.get("/friend-request",getFriendRequest);
router.get("/outgoing-friend-requests",getOutgoingFriendReqs);



export default router;