import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use(
    cors({
      origin: "http://localhost:5174",
      credentials: true
    })
);
  
connectDB();


app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log(`Server running on ${process.env.PORT}`);
});