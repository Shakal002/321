import { useState, useEffect, useCallback } from "react";
import api from "../api/client";
type Post = {
	id: number;
	title: string;
	content?: string;
	// Добавим автора, так как наш бэкенд теперь его возвращает
	author?: { username: string };
};
export default function PostsList() {
	const [posts, setPosts] = useState<Post[]>([]);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");
	// Оборачиваем запрос в useCallback, чтобы линтер React не ругался
	const fetchPosts = useCallback(async () => {
		try {
			// Указываем TypeScript, что мы ждем массив постов: api.get<Post[]>
			const response = await api.get<Post[]>("/posts");
			setPosts(response.data);
		} catch (error) {
			console.error("Ошибка при загрузке постов", error);
		}
	}, []);
	// Теперь fetchPosts можно смело добавить в зависимости
	useEffect(() => {
		fetchPosts();
	}, [fetchPosts]);
	const addPost = async () => {
		if (!title.trim()) return;
		try {
			await api.post("/posts", { title, content });
			setTitle("");
			setContent("");
			fetchPosts();
		} catch (error) {
			alert("Ошибка при создании поста");
		}
	};
	const deletePost = async (id: number) => {
		try {
			await api.delete(`/posts/${id}`);
			fetchPosts();
		} catch (error) {
			alert("Ошибка при удалении поста");
		}
	};
	return (
		<div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
			<section
				style={{
					marginBottom: "30px",
					display: "flex",
					flexDirection: "column",
					gap: "10px",
				}}
			>
				<h3>Написать пост</h3>
				<input
					placeholder="Заголовок поста"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					placeholder="Текст (необязательно)"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<button onClick={addPost}>Добавить</button>
			</section>
			<main>
				<h3>Лента</h3>
				{posts.length === 0 ? <p>Постов пока нет.</p> : null}
				{posts.map((p) => (
					<article
						key={p.id}
						style={{
							border: "1px solid #ccc",
							padding: "10px",
							marginBottom: "10px",
							borderRadius: "8px",
						}}
					>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "flex-start",
							}}
						>
							<div>
								<h2 style={{ margin: "0 0 5px 0" }}>
									{p.title}
								</h2>
								{/* Выводим имя автора, если оно есть */}
								<small style={{ color: "gray" }}>
									Автор: {p.author?.username || "Неизвестен"}
								</small>
							</div>
							<button
								onClick={() => deletePost(p.id)}
								style={{
									height: "30px",
									background: "red",
									color: "white",
									border: "none",
									borderRadius: "4px",
									cursor: "pointer",
								}}
							>
								Удалить
							</button>
						</div>
						{p.content && (
							<p style={{ marginTop: "10px" }}>{p.content}</p>
						)}
					</article>
				))}
			</main>
		</div>
	);
}
