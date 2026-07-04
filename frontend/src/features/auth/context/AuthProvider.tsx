import { useEffect, useState } from "react";
import { authService } from "../services/authService";
import type {
	AuthProviderProps,
	AuthUser,
	LoginInput,
	RegisterInput,
} from "../types/auth.types";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }: AuthProviderProps) {
	const [user, setUser] = useState<AuthUser | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	const isAuthenticated = user !== null;

	useEffect(() => {
		async function loadSession() {
			try {
				const data = await authService.me();
				setUser(data.user);
			} catch {
				setUser(null);
			} finally {
				setIsLoading(false);
			}
		}

		void loadSession();
	}, []);

	async function register(input: RegisterInput) {
		const data = await authService.register(input);
		setUser(data.user);
	}

	async function login(input: LoginInput) {
		const data = await authService.login(input);
		setUser(data.user);
	}

	async function logout() {
		await authService.logout();
		setUser(null);
	}

	return (
		<AuthContext.Provider
			value={{
				user,
				isLoading,
				isAuthenticated,
				register,
				login,
				logout,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
}