import express, { type Request, type Response } from "express";
import cors from "cors";
import "dotenv/config";

import authRouter from "./api/auth";
import postsRouter from "./api/posts"; // <-- Добавляем импорт

const app = express();

app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter); // <-- Подключаем посты по адресу /api/posts

app.get("/", (req, res) => {
	res.status(200).json({ status: "ok!!!!!!" });
});
const PORT = 3000;
app.listen(PORT, () => {
	console.log(`Server running on http://localhost:${PORT}`);
});
