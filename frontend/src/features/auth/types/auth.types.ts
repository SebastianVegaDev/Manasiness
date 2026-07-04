import type { ReactNode } from "react";

export type UserRole = "user" | "admin";

export type AuthUser = {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    created_at: string;
};

export type RegisterInput = {
    username: string;
    email: string;
    password: string;
};

export type LoginInput = {
    email: string;
    password: string;
}

export type AuthResponse = {
    user: AuthUser;
}

export type LogoutResponse = {
    message: string;
}

export type AuthContextValue = {
    user: AuthUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (input: LoginInput) => Promise<void>;
    register: (input: RegisterInput) => Promise<void>;
    logout: () => Promise<void>;
}

export type AuthProviderProps = {
    children: ReactNode;
};