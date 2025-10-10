import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import connectDB from "./src/config/db.js";
import userRoutes from "./src/routes/user.routes.js";
import publicRoutes from "./src/routes/public.routes.js";
import quizRoutes from "./src/routes/quiz.routes.js";
import { errorHandler } from "./src/middlewares/error.middleware.js";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 300,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/p", publicRoutes);
app.use("/api/quizzes", quizRoutes);

// Error handler
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("API server is working on root route");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
