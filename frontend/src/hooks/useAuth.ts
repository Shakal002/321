import { useState, useEffect } from "react";
export function useAuth() {
	const [user, setUser] = useState<any>(null);
	useEffect(() => {
		const raw = localStorage.getItem("user");
		if (raw) setUser(JSON.parse(raw));
	}, []);
	const save = (token: string, userObj: any) => {
		localStorage.setItem("token", token);
		localStorage.setItem("user", JSON.stringify(userObj));
		setUser(userObj);
	};
	const logout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
	};
	return { user, save, logout };
}
