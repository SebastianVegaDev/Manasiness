import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { LoginInput } from "../types/auth.types";
import "./LoginPage.css";

export function LoginPage() {
	const navigate = useNavigate();
	const { login } = useAuth();

	const [form, setForm] = useState<LoginInput>({
		email: "",
		password: "",
	});

	const [error, setError] = useState("");

	function handleChange(event: ChangeEvent<HTMLInputElement>) {
		const { name, value } = event.target;

		setForm((currentForm) => ({
			...currentForm,
			[name]: value,
		}));
	}

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		setError("");

		try {
			await login(form);
			navigate("/dashboard");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Login failed";
			setError(message);
		}
	}

	return (
		<main className="login-page">
			<section className="login-card">
				<h1>Login</h1>

				<form onSubmit={handleSubmit} className="login-form">
					<label>
						Email
						<input
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							placeholder="you@example.com"
						/>
					</label>

					<label>
						Password
						<input
							name="password"
							type="password"
							value={form.password}
							onChange={handleChange}
							placeholder="Your password"
						/>
					</label>

					{error && <p className="login-error">{error}</p>}

					<button type="submit">Login</button>
				</form>

				<p className="login-footer">
					No account? <Link to="/register">Register</Link>
				</p>
			</section>
		</main>
	);
}