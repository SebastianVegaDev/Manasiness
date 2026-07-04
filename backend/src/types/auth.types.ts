export type UserRole = "user" | "admin";

export type AuthenticatedUser = {
    id: string;
    username: string;
    email: string;
    role: UserRole;
    created_at: string;
};