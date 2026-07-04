import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"

import {
    clearCachedBootstrapData,
    getCachedBootstrapData,
    setCachedBootstrapData
} from "../cache/bootstrap.cache"
import { BootstrapContext } from "../context/BootstrapContext"
import { loadBootstrapData } from "../service/bootstrap.service"

import { getApiErrorMessage } from "@shared/api/httpError"

import type { ReactNode } from "react"
import type {
    BootstrapContextValue,
    BootstrapData,
    BootstrapUpdater
} from "../shared/types/bootstrap.types"

type BootstrapProviderProps = {
    children: ReactNode
}

export function BootstrapProvider({ children }: BootstrapProviderProps) {
    const [data, setData] = useState<BootstrapData | null>(() => getCachedBootstrapData())
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    const setBootstrapData = useCallback((nextData: BootstrapData | null) => {
        setData(nextData)

        if (nextData) {
            setCachedBootstrapData(nextData)
            return
        }

        clearCachedBootstrapData()
    }, [])

    const clearBootstrap = useCallback(() => {
        setData(null)
        clearCachedBootstrapData()
    }, [])

    const reload = useCallback(async () => {
        setIsLoading(true)
        setError(null)

        try {
            const nextData = await loadBootstrapData()

            setBootstrapData(nextData)
        } catch (caughtError) {
            console.error(caughtError)
            setError(getApiErrorMessage(caughtError, "Could not load bootstrap data"))
        } finally {
            setIsLoading(false)
        }
    }, [setBootstrapData])

    const updateBootstrap = useCallback((updater: BootstrapUpdater) => {
        setData((currentData) => {
            const nextData = updater(currentData)

            setCachedBootstrapData(nextData)

            return nextData
        })
    }, [])

    useEffect(() => {
        reload()
    }, [reload])

    const value = useMemo<BootstrapContextValue>(() => {
        return {
            data,
            isLoading,
            error,
            reload,
            clearBootstrap,
            setBootstrapData,
            updateBootstrap
        }
    }, [
        clearBootstrap,
        data,
        error,
        isLoading,
        reload,
        setBootstrapData,
        updateBootstrap
    ])

    return (
        <BootstrapContext.Provider value={value}>
            {children}
        </BootstrapContext.Provider>
    )
}

export default BootstrapProvider







