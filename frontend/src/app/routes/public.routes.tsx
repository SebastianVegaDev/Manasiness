import { Route } from "react-router-dom"

import ForgotPasswordPage from "@features/auth/pages/ForgotPasswordPage"
import LoginPage from "@features/auth/pages/LoginPage"
import RegisterPage from "@features/auth/pages/RegisterPage"
import WelcomePage from "@features/welcome/pages/WelcomePage"

function PublicRoutes() {
    return (
        <>
            <Route path="/" element={<WelcomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </>
    )
}

export { PublicRoutes }
