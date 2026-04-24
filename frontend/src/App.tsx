import { useState } from "react";

type Post = {
	id: number;
	title: string;
	content?: string;
};

const initial: Post[] = [
	{ id: 1, title: "Welcome", content: "This is a simple demo post." },
	{ id: 2, title: "Second post", content: "Add your own posts here." },
];

export default function App() {
	const [posts, setPosts] = useState<Post[]>(initial);
	const [title, setTitle] = useState("");
	const [content, setContent] = useState("");

	function addPost() {
		if (!title.trim()) return;
		const next: Post = {
			id: Date.now(),
			title: title.trim(),
			content: content.trim(),
		};
		setPosts((p) => [next, ...p]);
		setTitle("");
		setContent("");
	}

	return (
		<div className="app">
			<header className="header">
				<h1>Demo Blog</h1>
			</header>

			<section className="compose">
				<input
					className="input"
					placeholder="Post title"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
				<textarea
					className="textarea"
					placeholder="Post content (optional)"
					value={content}
					onChange={(e) => setContent(e.target.value)}
				/>
				<button className="btn" onClick={addPost}>
					Add post
				</button>
			</section>

			<main className="posts">
				{posts.map((p) => (
					<article key={p.id} className="card">
						<h2 className="card-title">{p.title}</h2>
						{p.content && (
							<p className="card-content">{p.content}</p>
						)}
					</article>
				))}
				{posts.length === 0 && <p>No posts yet.</p>}
			</main>
		</div>
	);
}
