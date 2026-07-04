import { Link } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth";
import { Badge } from "../../shared/ui/Badge/Badge";
import { Button } from "../../shared/ui/Button/Button";
import "./Topbar.css";

export function Topbar() {
	const { user, logout } = useAuth();

	return (
		<header className="topbar">
			<div>
				<p className="topbar-eyebrow">DevJudge</p>
				<h1>Learning dashboard</h1>
			</div>
			<div className="topbar-actions">
				{user && <Badge>{user.role}</Badge>}
				<Link to="/">Home</Link>
				<Button variant="secondary" onClick={() => void logout()}>
					Logout
				</Button>
			</div>
		</header>
	);
}