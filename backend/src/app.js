
import express  from "express";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import foodRoutes from "./routes/food.routes.js";
import feedRoutes from "./routes/feed.routes.js";
import cors from "cors";
import likeRoutes from "./routes/like.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import BookMarkRoutes from "./routes/bookmark.route.js";
import userRoutes from "./routes/user.routes.js";

const app = express();
app.use(cors({
    origin : ["http://localhost:5173",
        "https://foodverse-tan.vercel.app",
    "https://foodverse-git-main-rahulmishra.vercel.app"],
    credentials : true
}));
app.use(express.json());        
app.use(cookieParser());

app.use("/api/auth",authRoutes)
app.use("/api/food",foodRoutes)
app.use("/api/feed",feedRoutes)
app.use("/api/like",likeRoutes)
app.use("/api/comment",commentRoutes)
app.use("/api/bookmark", BookMarkRoutes)
app.use("/api/user", userRoutes)

app.use("/uploads",express.static("uploads"))

export default app;