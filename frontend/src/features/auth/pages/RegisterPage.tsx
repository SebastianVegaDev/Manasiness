import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import type { RegisterInput } from "../types/auth.types";
import "./RegisterPage.css";

export function RegisterPage() {
	const navigate = useNavigate();
	const { register } = useAuth();

	const [form, setForm] = useState<RegisterInput>({
		username: "",
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
			await register(form);
			navigate("/dashboard");
		} catch (error) {
			const message = error instanceof Error ? error.message : "Register failed";
			setError(message);
		}
	}

	return (
		<main className="register-page">
			<section className="register-card">
				<h1>Register</h1>

				<form onSubmit={handleSubmit} className="register-form">
					<label>
						Username
						<input
							name="username"
							type="text"
							value={form.username}
							onChange={handleChange}
							placeholder="fabricio"
						/>
					</label>

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

					{error && <p className="register-error">{error}</p>}

					<button type="submit">Create account</button>
				</form>

				<p className="register-footer">
					Already have an account? <Link to="/login">Login</Link>
				</p>
			</section>
		</main>
	);
}