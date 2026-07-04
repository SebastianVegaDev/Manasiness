import "./DashboardLayout.css"

import { Outlet } from "react-router-dom"

import DashboardSidebar from "@app/navigation/DashboardSidebar"

function DashboardLayout() {
    return (
        <div className="dashboard-layout">
            <aside className="dashboard-layout-sidebar">
                <DashboardSidebar />
            </aside>

            <main className="dashboard-layout-content">
                <div className="dashboard-layout-page">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}

export default DashboardLayout
