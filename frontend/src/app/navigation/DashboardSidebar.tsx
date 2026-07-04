import "./DashboardSidebar.css"

import {
    BadgeDollarSign,
    BriefcaseBusiness,
    ChartColumnDecreasing,
    FileUser,
    Menu,
    PackageSearch,
    PillBottle,
    TableOfContents,
    User
} from "lucide-react"
import { useState } from "react"
import {
    Link,
    NavLink,
    useNavigate
} from "react-router-dom"

import { useAuth } from "@features/auth/hooks/useAuth"

import Logotipo from "../../assets/images/Logotipo.png"

type DashboardSidebarSectionKey =
    | "catalog"
    | "register"
    | "people"
    | "reports"
    | "settings"

function DashboardSidebar() {
    const navigate = useNavigate()
    const { logoutSession } = useAuth()
    const [openSections, setOpenSections] = useState<Record<DashboardSidebarSectionKey, boolean>>({
        catalog: false,
        register: false,
        people: false,
        reports: false,
        settings: false
    })

    async function handleLogout(): Promise<void> {
        await logoutSession()
        navigate("/login", { replace: true })
    }

    function handleSection(section: DashboardSidebarSectionKey): void {
        setOpenSections((prev) => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    return (
        <div className="dashboard-sidebar">
            <div className="dashboard-sidebar-brand-wrapper">
                <Link to="/dashboard" className="dashboard-sidebar-brand">
                    <img src={Logotipo} alt="Manasiness" />
                </Link>
            </div>

            <div className="dashboard-sidebar-list">
                <div className="dashboard-sidebar-section">
                    <button type="button" aria-expanded={openSections.catalog} onClick={() => handleSection("catalog")}>Catalog <Menu /></button>
                    <ul hidden={!openSections.catalog}>
                        <li><NavLink to="/dashboard/categories"><TableOfContents />Categories</NavLink></li>
                        <li><NavLink to="/dashboard/products"><PackageSearch />Products</NavLink></li>
                        <li><NavLink to="/dashboard/users"><User />Users</NavLink></li>
                    </ul>
                </div>

                <div className="dashboard-sidebar-section">
                    <button type="button" aria-expanded={openSections.register} onClick={() => handleSection("register")}>Register <Menu /></button>
                    <ul hidden={!openSections.register}>
                        <li><NavLink to="/dashboard/sales"><BadgeDollarSign />Sales</NavLink></li>
                        <li><NavLink to="/dashboard/orders"><ChartColumnDecreasing />Orders</NavLink></li>
                        <li><NavLink to="/dashboard/staff"><FileUser />Staff</NavLink></li>
                    </ul>
                </div>

                <div className="dashboard-sidebar-section">
                    <button type="button" aria-expanded={openSections.people} onClick={() => handleSection("people")}>People <Menu /></button>
                    <ul hidden={!openSections.people}>
                        <li><NavLink to="/dashboard/customers"><FileUser />Customers</NavLink></li>
                        <li><NavLink to="/dashboard/suppliers"><PillBottle />Suppliers</NavLink></li>
                        <li><NavLink to="/dashboard/workers"><BriefcaseBusiness />Workers</NavLink></li>
                    </ul>
                </div>

                <div className="dashboard-sidebar-section">
                    <button type="button" aria-expanded={openSections.reports} onClick={() => handleSection("reports")}>Reports <Menu /></button>
                    <ul hidden={!openSections.reports}>
                        <li><NavLink to="/dashboard/income"><FileUser />Income</NavLink></li>
                        <li><NavLink to="/dashboard/expenses"><PillBottle />Expenses</NavLink></li>
                        <li><NavLink to="/dashboard/activity"><BriefcaseBusiness />Activity</NavLink></li>
                        <li><NavLink to="/dashboard/pending"><BriefcaseBusiness />Pending</NavLink></li>
                    </ul>
                </div>

                <div className="dashboard-sidebar-section">
                    <button type="button" aria-expanded={openSections.settings} onClick={() => handleSection("settings")}>Settings <Menu /></button>
                    <ul hidden={!openSections.settings}>
                        <li><NavLink to="/dashboard/information"><FileUser />Information</NavLink></li>
                        <li><NavLink to="/dashboard/password"><PillBottle />Password</NavLink></li>
                    </ul>
                </div>

                <div className="dashboard-sidebar-logout">
                    <button
                        type="button"
                        className="dashboard-sidebar-logout-button"
                        onClick={() => {
                            void handleLogout()
                        }}
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    )
}

export default DashboardSidebar
