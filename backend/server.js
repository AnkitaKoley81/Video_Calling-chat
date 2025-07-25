import express from "express"
import "dotenv/config";
import authRoutes from "./src/routes/auth.route.js"
import userRoutes from "./src/routes/user.route.js"
import chatRoutes from "./src/routes/chat.route.js"
import { connectDB } from "./src/lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"


const app = express();
const PORT = process.env.PORT;

// app.get("/api/auth/signup",(req,res)=>{
//     res.send("Hello World!");
// })

// app.get("/api/auth/login",(req,res)=>{  
//     res.send("Login Route");
// })

// app.get("/api/auth/logout",(req,res)=>{
//     res.send("Logout Route");
// })

app.use(cors({
    origin: true,
    credentials: true
}))

app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/chat",chatRoutes);

app.get("/api/status", (req, res) => {
    res.json({ message: "Backend is working ✅" });
});

if (process.env.NODE_ENV === "development") {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
  });
} else {
  connectDB(); // optional: still connect to DB in production
}
export default app;
