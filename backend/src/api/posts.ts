import express from "express";
import prisma from "../db";
import jwt from "jsonwebtoken";

const router = express.Router();
const SECRET = "super-secret-key-123";

function getUserIdFromToken(req: express.Request): number | null {
	const authHeader = req.headers.authorization;
	if (!authHeader) return null;

	const token = authHeader.split(" ")[1];
	try {
		const decoded = jwt.verify(token, SECRET) as { userId: number };
		return decoded.userId;
	} catch (e) {
		return null;
	}
}

router.get("/", async (req, res) => {
	try {
		const posts = await prisma.post.findMany({
			orderBy: { id: "desc" },
			include: { author: { select: { username: true } } },
		});
		res.json(posts);
	} catch (error) {
		res.status(500).json({ error: "Ошибка при получении постов" });
	}
});

router.post("/", async (req, res) => {
	const userId = getUserIdFromToken(req);
	if (!userId) {
		return res.status(401).json({ error: "Не авторизован" });
	}

	try {
		const { title, content } = req.body;
		const newPost = await prisma.post.create({
			data: {
				title,
				content,
				authorId: userId,
			},
		});
		res.status(200).json(newPost);
	} catch (error) {
		res.status(500).json({ error: "Ошибка при создании поста" });
	}
});

router.delete("/:id", async (req, res) => {
	const userId = getUserIdFromToken(req);
	if (!userId) return res.status(401).json({ error: "Не авторизован" });

	try {
		const postId = Number(req.params.id);

		await prisma.post.delete({
			where: { id: postId },
		});

		res.json({ success: true });
	} catch (error) {
		res.status(500).json({ error: "Ошибка при удалении поста" });
	}
});

export default router;
