import { useContext } from "react"

import { BootstrapContext } from "../context/BootstrapContext"

import type { BootstrapContextValue } from "../shared/types/bootstrap.types"

export function useBootstrap(): BootstrapContextValue {
    const context = useContext(BootstrapContext)

    if (!context) {
        throw new Error("useBootstrap must be used inside BootstrapProvider")
    }

    return context
}

export default useBootstrap







