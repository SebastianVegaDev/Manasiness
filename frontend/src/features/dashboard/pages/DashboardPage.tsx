import { Link } from "react-router-dom";
import { useAuth } from "../../auth/hooks/useAuth";
import { Badge } from "../../../shared/ui/Badge/Badge";
import { Card } from "../../../shared/ui/Card/Card";
import "./DashboardPage.css";

export function DashboardPage() {
	const { user } = useAuth();

	return (
		<div className="dashboard-page">
			<Card className="dashboard-card">
				<h1>Dashboard</h1>
				<p>
					Welcome, <strong>{user?.username}</strong>
				</p>
				<Badge>Role: {user?.role}</Badge>
				<div className="dashboard-actions">
					<Link to="/challenges" className="dashboard-link">
						View challenges
					</Link>
					{user?.role === "admin" && (
						<Link to="/admin" className="dashboard-link">
							Admin panel
						</Link>
					)}
				</div>
			</Card>
		</div>
	);
}