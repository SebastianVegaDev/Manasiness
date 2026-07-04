import { Navigate, useNavigate } from "react-router-dom"
import { useState } from "react"
import { toast } from "react-toastify"

import LoginForm from "@features/auth/components/forms/LoginForm"
import { useAuth } from "@features/auth/hooks/useAuth"
import AuthLayout from "@features/auth/layouts/AuthLayout/AuthLayout"
import { getApiErrorMessage } from "@shared/api/httpError"
import AuthOverlay from "@shared/ui/modal/AuthOverlay"
import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"

import type { LoginCredentials } from "@features/auth/shared/types/auth.types"

function LoginPage() {
    const navigate = useNavigate()
    const { store, isLoading, login } = useAuth()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    if (isLoading) {
        return <LoadingOverlay />
    }

    if (store) {
        return <Navigate to="/dashboard" replace />
    }

    async function handleSubmit(credentials: LoginCredentials): Promise<void> {
        if (isSubmitting) {
            return
        }

        setIsSubmitting(true)

        try {
            await login(credentials)
            navigate("/dashboard")
            toast.success("Login successful!")
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Invalid credentials"))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <AuthOverlay>
            <AuthLayout>
                <LoginForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
                {isSubmitting ? <LoadingOverlay /> : null}
            </AuthLayout>
        </AuthOverlay>
    )
}

export default LoginPage
