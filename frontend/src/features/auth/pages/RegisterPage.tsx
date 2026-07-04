import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import RegisterForm from "@features/auth/components/forms/RegisterForm"
import {
    register,
    sendRegisterCode,
    verifyRegisterCode
} from "@features/auth/shared/api/auth.api"
import { getApiErrorMessage } from "@shared/api/httpError"
import AuthLayout from "@features/auth/layouts/AuthLayout/AuthLayout"
import AuthOverlay from "@shared/ui/modal/AuthOverlay"

import type {
    EmailCodePayload,
    RegisterPayload,
    VerifyCodePayload
} from "@features/auth/shared/types/auth.types"

function RegisterPage() {
    const navigate = useNavigate()

    async function handleSendCode(data: EmailCodePayload): Promise<void> {
        try {
            await sendRegisterCode(data)
            toast.success("Code sent")
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not send code"))
            throw error
        }
    }

    async function handleVerifyCode(data: VerifyCodePayload): Promise<void> {
        try {
            await verifyRegisterCode(data)
            toast.success("Code verified")
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not verify code"))
            throw error
        }
    }

    async function handleRegister(data: RegisterPayload): Promise<void> {
        try {
            await register(data)
            toast.success("Register successful!")
            navigate("/login")
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not register"))
            throw error
        }
    }

    return (
        <AuthOverlay>
            <AuthLayout>
                <RegisterForm
                    onRegister={handleRegister}
                    onVerifyEmail={handleSendCode}
                    onVerifyCode={handleVerifyCode}
                />
            </AuthLayout>
        </AuthOverlay>
    )
}

export default RegisterPage
