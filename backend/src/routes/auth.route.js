import express from "express";

const router = express.Router();
import {
  signup,login,logout,onboard,} from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

// router.get("/signup",(req,res)=>{
//     res.send("Signup Route")
// })

// router.get("/login",(req,res)=>{
//     res.send("login Route")
// })

// router.get("/logout",(req,res)=>{
//     res.send("Logout Route")
// })

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);  //POST method is the operation that changes the server states

router.post("/onboarding", protectRoute, onboard);



//CHECK IF USER IS LOGGED IN OR NOT
router.get("/me",protectRoute,(req,res)=>{
  res.status(200).json({success:true,user:req.user})
})

export default router;
