import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { toast } from "react-toastify"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import {
    removeBootstrapPendingRow,
    replaceBootstrapPendingScope,
    replaceBootstrapPendingSummary
} from "@features/bootstrap/updaters/bootstrap.updaters"
import { getApiErrorMessage } from "@shared/api/httpError"

import {
    mapPendingRows,
    mapPendingSummary
} from "../mappers/financeReport.mapper"

import type {
    PendingRow,
    PendingScope,
    PendingSummary,
    UsePendingPageInput,
    UsePendingPageState
} from "../types/finance.types"

function createEmptySummary(): PendingSummary {
    return {
        global: { count: 0, total: 0 },
        sales: { count: 0, total: 0 },
        orders: { count: 0, total: 0 },
        staff: { count: 0, total: 0 }
    }
}

function getCurrencyCode(data: unknown): string {
    const bootstrapData = data as {
        session?: {
            store?: {
                currency_code?: string
                currencyCode?: string
            }
        }
    } | null

    return (
        bootstrapData?.session?.store?.currency_code ||
        bootstrapData?.session?.store?.currencyCode ||
        "PEN"
    )
}

function isPendingScope(value: string, scopes: PendingScope[]): value is PendingScope {
    return scopes.includes(value as PendingScope)
}

export function usePendingPage({
    config,
    getSummary,
    getRows,
    markAsPaid
}: UsePendingPageInput): UsePendingPageState {
    const bootstrap = useBootstrapData()

    const [selectedScope, setSelectedScopeState] = useState<PendingScope>(config.defaultScope)
    const [summary, setSummary] = useState<PendingSummary>(() => createEmptySummary())
    const [rows, setRows] = useState<PendingRow[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isUpdating, setIsUpdating] = useState<boolean>(false)

    const currencyCode = useMemo(() => {
        return getCurrencyCode(bootstrap.data)
    }, [bootstrap.data])

    const loadSummary = useCallback(async () => {
        const response = await getSummary()
        const nextSummary = mapPendingSummary(response)

        setSummary(nextSummary)

        bootstrap.updateBootstrap((currentData) => {
            return replaceBootstrapPendingSummary(currentData, nextSummary)
        })
    }, [
        bootstrap,
        getSummary
    ])

    const loadRows = useCallback(async () => {
        const response = await getRows(selectedScope)
        const nextRows = mapPendingRows(response)

        setRows(nextRows)

        bootstrap.updateBootstrap((currentData) => {
            return replaceBootstrapPendingScope(currentData, selectedScope, nextRows as never)
        })
    }, [
        bootstrap,
        getRows,
        selectedScope
    ])

    const reload = useCallback(async () => {
        setIsLoading(true)

        try {
            await Promise.all([
                loadSummary(),
                loadRows()
            ])
        } catch (caughtError) {
            console.error(caughtError)
            setRows([])
            toast.error(getApiErrorMessage(caughtError, config.loadErrorMessage))
        } finally {
            setIsLoading(false)
        }
    }, [
        config.loadErrorMessage,
        loadRows,
        loadSummary
    ])

    useEffect(() => {
        void reload()
    }, [reload])

    function setSelectedScope(scope: PendingScope): void {
        setSelectedScopeState(scope)
    }

    function handleScopeChange(event: { target: { value: string } }): void {
        const nextScope = event.target.value

        if (isPendingScope(nextScope, config.scopes)) {
            setSelectedScopeState(nextScope)
        }
    }

    async function handleMarkAsPaid(row: PendingRow): Promise<void> {
        if (isUpdating) {
            return
        }

        setIsUpdating(true)

        try {
            await markAsPaid(selectedScope, row.id)

            setRows((currentRows) => {
                return currentRows.filter((currentRow) => {
                    return String(currentRow.id) !== String(row.id)
                })
            })

            bootstrap.updateBootstrap((currentData) => {
                return removeBootstrapPendingRow(currentData, selectedScope, row as never)
            })

            await loadSummary()

            toast.success(config.updateSuccessMessage)
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(caughtError, config.updateErrorMessage))
        } finally {
            setIsUpdating(false)
        }
    }

    return {
        scopes: config.scopes,
        selectedScope,
        summary,
        rows,
        currencyCode,
        isLoading: isLoading || bootstrap.isLoading,
        isUpdating,
        setSelectedScope,
        handleScopeChange,
        handleMarkAsPaid,
        reload
    }
}

export default usePendingPage
