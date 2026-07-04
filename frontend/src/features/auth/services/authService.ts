import type { AuthResponse, LoginInput, LogoutResponse, RegisterInput } from "../types/auth.types.ts";

import { apiGet, apiPost } from "../../../shared/api/apiClient.ts";

export const authService = {
    register(input: RegisterInput) {
        return apiPost<AuthResponse, RegisterInput>("/auth/register", input);
    },

    login(input: LoginInput) {
        return apiPost<AuthResponse, LoginInput>("/auth/login", input);
    },

    logout() {
        return apiPost<LogoutResponse>("/auth/logout");
    },

    me() {
        return apiGet<AuthResponse>("/auth/me")
    }
}