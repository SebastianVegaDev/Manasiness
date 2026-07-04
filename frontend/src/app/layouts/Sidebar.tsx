import { NavLink } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth.ts";
import "./Sidebar.css";

export function Sidebar() {
    const { user } = useAuth();

    return (
        <aside className="sidebar">
            <div className="sidebar-brand">
                <strong>DevJudge</strong>
                <span>Code practice</span>
            </div>
            <nav className="sidebar-nav" aria-label="Main navigation">
                <NavLink to="/dashboard">Dashboard</NavLink>
                <NavLink to="/challenges">Challenges</NavLink>

                {user?.role === "admin" && <NavLink to="/admin">Admin</NavLink>}
            </nav>
        </aside>
    )
}