import { Navigate, Outlet, useLocation } from "react-router-dom"

import { getRouteAuthToken } from "./authRoute.utils"

import type { RouteGuardProps } from "@shared/types/route.types"

function ProtectedRoute({ children }: RouteGuardProps) {
    const location = useLocation()
    const token = getRouteAuthToken()

    if (!token) {
        return (
            <Navigate
                to="/login"
                replace
                state={{ from: location }}
            />
        )
    }

    return children ? <>{children}</> : <Outlet />
}

export default ProtectedRoute









