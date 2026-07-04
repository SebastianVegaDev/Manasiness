import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"

import ForgotPasswordForm from "@features/auth/components/forms/ForgotPasswordForm"
import {
    resetPassword,
    sendPasswordResetCode,
    verifyPasswordResetCode
} from "@features/auth/shared/api/auth.api"
import { getApiErrorMessage } from "@shared/api/httpError"
import AuthLayout from "@features/auth/layouts/AuthLayout/AuthLayout"
import AuthOverlay from "@shared/ui/modal/AuthOverlay"

import type {
    EmailCodePayload,
    ResetPasswordPayload,
    VerifyCodePayload
} from "@features/auth/shared/types/auth.types"

function ForgotPasswordPage() {
    const navigate = useNavigate()

    async function handleSendCode(data: EmailCodePayload): Promise<void> {
        try {
            await sendPasswordResetCode(data)
            toast.success("If the account exists, the code was sent")
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not send code"))
            throw error
        }
    }

    async function handleVerifyCode(data: VerifyCodePayload): Promise<void> {
        try {
            await verifyPasswordResetCode(data)
            toast.success("Code verified")
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Could not verify code"))
            throw error
        }
    }

    async function handleResetPassword(data: ResetPasswordPayload): Promise<void> {
        try {
            await resetPassword(data)
            toast.success("Password updated successfully")
            navigate("/login", { replace: true })
        } catch (error) {
            toast.error(getApiErrorMessage(error, "Password could not be reset"))
            throw error
        }
    }

    return (
        <AuthOverlay>
            <AuthLayout>
                <ForgotPasswordForm
                    onSendCode={handleSendCode}
                    onVerifyCode={handleVerifyCode}
                    onResetPassword={handleResetPassword}
                />
            </AuthLayout>
        </AuthOverlay>
    )
}

export default ForgotPasswordPage
