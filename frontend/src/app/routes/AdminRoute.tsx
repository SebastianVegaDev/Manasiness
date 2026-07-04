import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../features/auth/hooks/useAuth.ts";
import { LoadingState } from "../../shared/ui/LoadingState/LoadingState.tsx";

export function AdminRoute() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
		return <LoadingState message="Loading session..." />;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
}