import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth.ts";
import { Card } from "../../../shared/ui/Card/Card.tsx";
import "./AdminHomePage.css";

export function AdminHomePage() {
	const { user } = useAuth();

	return (
		<div className="admin-home-page">
			<Card className="admin-home-card">
				<h1>Admin panel</h1>
				<p>
					Hello, <strong>{user?.username}</strong>
				</p>
				<p>From here you will manage DevJudge content.</p>
				<div className="admin-home-grid">
					<article className="admin-home-box">
						<h2>Challenges</h2>
						<p>Create and manage coding challenges.</p>
						<Link to="/admin/challenges">Open challenges</Link>
					</article>
					<article className="admin-home-box">
						<h2>Test cases</h2>
						<p>Manage visible and hidden tests from each challenge.</p>
					</article>
					<article className="admin-home-box">
						<h2>Users</h2>
						<p>Future user and role tools.</p>
					</article>
				</div>
			</Card>
		</div>
	);
}