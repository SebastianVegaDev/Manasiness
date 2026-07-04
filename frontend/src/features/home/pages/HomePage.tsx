import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import "./HomePage.css";

export function HomePage() {
	const { user, isAuthenticated, logout } = useAuth();

	return (
		<main className="home-page">
			<section className="home-card">
				<h1>DevJudge</h1>

				<p>
					Practice coding challenges, submit solutions, and improve your
					programming skills.
				</p>

				<div className="home-actions">
					{isAuthenticated ? (
						<>
							<Link to="/dashboard" className="home-link">
								Go to dashboard
							</Link>

							{user?.role === "admin" && (
								<Link to="/admin" className="home-link">
									Admin panel
								</Link>
							)}

							<button type="button" onClick={() => void logout()}>
								Logout
							</button>
						</>
					) : (
						<>
							<Link to="/login" className="home-link">
								Login
							</Link>

							<Link to="/register" className="home-link">
								Register
							</Link>
						</>
					)}
				</div>
			</section>
		</main>
	);
}