import { useState } from "react";
import Auth from "./pages/Auth";
import PostsList from "./pages/PostsList";
import "./App.css";
export default function App() {
	// Проверяем, есть ли токен при старте приложения
	const [isAuth, setIsAuth] = useState<boolean>(
		!!localStorage.getItem("token"),
	);
	const handleLogout = () => {
		localStorage.removeItem("token"); // Удаляем токен
		setIsAuth(false); // Меняем стейт, чтобы нас выкинуло на страницу логина
	};
	return (
		<div className="app">
			<header
				style={{
					padding: "20px",
					borderBottom: "1px solid #ccc",
					display: "flex",
					justifyContent: "space-between",
				}}
			>
				<h1>Моя Соцсеть</h1>
				{isAuth && <button onClick={handleLogout}>Выйти</button>}
			</header>
			{/* Если авторизован — показываем посты, иначе — форму логина */}
			{isAuth ? <PostsList /> : <Auth onLogin={() => setIsAuth(true)} />}
		</div>
	);
}
