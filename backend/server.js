import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDB from "./config/db.config.js";
import cookieParser from "cookie-parser";
import cors from "cors";

// All Routers
import authRouter from "./routes/auth.routes.js";

const PORT = process.env.PORT || 3000;

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors());

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log("Server is Running on http://localhost:" + PORT);
});