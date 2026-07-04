import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.ts";

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAut must be used inside AuthProveder");
    }

    return context;
}