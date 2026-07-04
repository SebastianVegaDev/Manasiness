import { apiGet, apiPost } from "@shared/api/client"

import type {
    AuthResponse,
    EmailCodePayload,
    ForgotPasswordPayload,
    ForgotPasswordResponse,
    LoginCredentials,
    RegisterPayload,
    ResetPasswordPayload,
    VerifyCodePayload
} from "../types/auth.types"

type MessageResponse = {
    message?: string
}

export async function loginRequest(credentials: LoginCredentials): Promise<AuthResponse> {
    return apiPost<AuthResponse, LoginCredentials>("/auth/login", credentials)
}

export async function registerRequest(payload: RegisterPayload): Promise<AuthResponse> {
    return apiPost<AuthResponse, RegisterPayload>("/auth/register", payload)
}

export async function getCurrentUserRequest(): Promise<AuthResponse> {
    return apiGet<AuthResponse>("/auth/me")
}

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
    return loginRequest(credentials)
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
    return registerRequest(payload)
}

export async function sendRegisterCode(payload: EmailCodePayload): Promise<MessageResponse> {
    return apiPost<MessageResponse, EmailCodePayload>("/auth/register/send-code", payload)
}

export async function verifyRegisterCode(payload: VerifyCodePayload): Promise<MessageResponse> {
    return apiPost<MessageResponse, VerifyCodePayload>("/auth/register/verify-code", payload)
}

export async function sendPasswordResetCode(payload: EmailCodePayload): Promise<MessageResponse> {
    return apiPost<MessageResponse, EmailCodePayload>("/auth/password/send-code", payload)
}

export async function verifyPasswordResetCode(payload: VerifyCodePayload): Promise<MessageResponse> {
    return apiPost<MessageResponse, VerifyCodePayload>("/auth/password/verify-code", payload)
}

export async function resetPassword(payload: ResetPasswordPayload): Promise<MessageResponse> {
    return apiPost<MessageResponse, ResetPasswordPayload>("/auth/password/reset", payload)
}

export async function requestPasswordReset(
    payload: ForgotPasswordPayload
): Promise<ForgotPasswordResponse> {
    return apiPost<ForgotPasswordResponse, ForgotPasswordPayload>("/auth/forgot-password", payload)
}








