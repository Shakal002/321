import { useState } from "react";
import api from "../api/client";
// Передаем пропс onLogin, чтобы сообщить App.tsx, что мы успешно вошли
export default function Auth({ onLogin }: { onLogin: () => void }) {
	const [isLoginMode, setIsLoginMode] = useState(true);
	const [username, setUsername] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			if (isLoginMode) {
				// Логин
				const response = await api.post("/auth/login", {
					email,
					password,
				});
				// Сохраняем токен (предполагаем, что бэк возвращает { token: "..." })
				localStorage.setItem("token", response.data.token);
				onLogin(); // Говорим приложению, что мы авторизованы
			} else {
				// Регистрация (учитываем, что твой бэк ждет username, email, password)
				await api.post("/auth/register", { username, email, password });
				alert("Регистрация успешна! Теперь войди.");
				setIsLoginMode(true); // Переключаем на форму входа
			}
		} catch (error) {
			console.error(error);
			alert("Произошла ошибка. Проверь данные или посмотри консоль.");
		}
	};
	return (
		<div
			style={{
				maxWidth: "400px",
				margin: "50px auto",
				textAlign: "center",
			}}
		>
			<h2>{isLoginMode ? "Вход" : "Регистрация"}</h2>
			<form
				onSubmit={handleSubmit}
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				{/* Показываем поле Username только при регистрации */}
				{!isLoginMode && (
					<input
						type="text"
						placeholder="Имя пользователя"
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						required
					/>
				)}
				<input
					type="email"
					placeholder="Email"
					value={email}
					onChange={(e) => setEmail(e.target.value)}
					required
				/>
				<input
					type="password"
					placeholder="Пароль"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
					required
				/>
				<button type="submit">
					{isLoginMode ? "Войти" : "Зарегистрироваться"}
				</button>
			</form>
			<p
				style={{ marginTop: "20px", cursor: "pointer", color: "blue" }}
				onClick={() => setIsLoginMode(!isLoginMode)}
			>
				{isLoginMode
					? "Нет аккаунта? Зарегистрируйся"
					: "Уже есть аккаунт? Войди"}
			</p>
		</div>
	);
}
