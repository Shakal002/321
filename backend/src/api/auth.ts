import express, { Request, Response } from "express";
import { hashPass } from "../utils/hashPass";
import prisma from "../db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
interface RegisterBody {
	username?: string;
	email?: string;
	password?: string;
}
const router = express.Router();

const SECRET = "super-secret-key-123";
router.post("/login", async function (req, res) {
	try {
		const { email, password } = req.body;

		const user = await prisma.user.findUnique({ where: { email } });
		if (!user) {
			return res.status(400).json({ error: "Пользователь не найден" });
		}

		// Проверяем пароль
		const isPassValid = await bcrypt.compare(password, user.password);
		if (!isPassValid) {
			return res.status(400).json({ error: "Неверный пароль" });
		}

		const token = jwt.sign({ userId: user.id }, SECRET, {
			expiresIn: "24h",
		});

		return res.status(200).json({ token, username: user.username });
	} catch (e) {
		return res.status(500).json({ error: "Ошибка при входе" });
	}
});

router.post(
	"/register",
	async function (req: Request<{}, {}, RegisterBody>, res: Response) {
		try {
			const { username, email, password } = req.body;
			if (!email || !password || !username)
				throw new Error("Не все поля заполнены");

			// Проверяем, есть ли уже такой email
			const existingUser = await prisma.user.findUnique({
				where: { email },
			});
			if (existingUser) {
				return res.status(400).json({ error: "Такой email уже занят" });
			}

			const hashedPass = await hashPass(password);
			const newUser = await prisma.user.create({
				data: { username, email, password: hashedPass },
			});
			return res.status(200).json({ text: "Успешно зарегистрирован!" });
		} catch (e) {
			return res.status(400).json({ error: e });
		}
	},
);

router.post("/logout", async function (req, res) {
	res.status(200).json({ message: "Вы вышли" });
});

export default router;
