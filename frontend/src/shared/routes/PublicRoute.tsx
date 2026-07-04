import { Navigate, Outlet } from "react-router-dom"

import { getRouteAuthToken } from "./authRoute.utils"

import type { RouteGuardProps } from "@shared/types/route.types"

function PublicRoute({ children }: RouteGuardProps) {
    const token = getRouteAuthToken()

    if (token) {
        return <Navigate to="/dashboard" replace />
    }

    return children ? <>{children}</> : <Outlet />
}

export default PublicRoute









