import { useContext } from "react"

import { AuthContext } from "../context/AuthContext"

import type { AuthContextValue } from "../shared/types/auth.types"

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider")
    }

    return context
}

export default useAuth








