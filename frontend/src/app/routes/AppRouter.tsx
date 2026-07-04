import { Route, Routes } from "react-router-dom"

import NotFoundPage from "@features/not-found/pages/NotFoundPage"
import { DashboardRoutes } from "./dashboard.routes"
import { PublicRoutes } from "./public.routes"

function AppRouter() {
    return (
        <Routes>
            {PublicRoutes()}
            {DashboardRoutes()}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    )
}

export { AppRouter }
