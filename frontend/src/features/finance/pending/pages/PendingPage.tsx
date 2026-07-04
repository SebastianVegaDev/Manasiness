import "./PendingPage.css"

import {
    useCallback,
    useEffect,
    useState
} from "react"
import { toast } from "react-toastify"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import {
    getPendingRows,
    getPendingSummary,
    updatePendingState
} from "@features/finance/shared/api/finance.api"
import type {
    PendingRowsResponse,
    PendingSummaryResponse
} from "@features/finance/shared/types/finance.types"
import { getApiErrorMessage } from "@shared/api/httpError"
import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"
import StatsLayout from "@shared/ui/layouts/stats/StatsLayout"
import { formatCurrency } from "@shared/utils/currency"
import type { EntityId } from "@shared/types/common.types"

type PendingScope = "customers" | "suppliers" | "workers"
type PendingState = "paid" | "canceled"

type PendingSummaryItem = {
    count: number
    total: number
}

type PendingSummary = {
    customers: PendingSummaryItem
    suppliers: PendingSummaryItem
    workers: PendingSummaryItem
    global: PendingSummaryItem
}

type PendingItem = {
    id: EntityId
    name: string
    amount: number
    dayAgo: string
}

type PendingSectionConfig = {
    title: string
    scope: PendingScope
    items: PendingItem[]
}

const EMPTY_SUMMARY: PendingSummary = {
    customers: { count: 0, total: 0 },
    suppliers: { count: 0, total: 0 },
    workers: { count: 0, total: 0 },
    global: { count: 0, total: 0 }
}

function toRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object" ? value as Record<string, unknown> : {}
}

function toNumber(value: unknown): number {
    const numberValue = Number(value ?? 0)
    return Number.isFinite(numberValue) ? numberValue : 0
}

function formatPendingTime(date: unknown): string {
    const parsedDate = new Date(String(date ?? ""))
    const timestamp = parsedDate.getTime()

    if (!Number.isFinite(timestamp)) {
        return "Just now"
    }

    const diffMs = Date.now() - timestamp
    const hours = Math.floor(diffMs / (1000 * 60 * 60))
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (hours < 1) {
        return "Just now"
    }

    if (hours < 24) {
        return `${hours} h ago`
    }

    return `${days} ${days === 1 ? "day" : "days"} ago`
}

function unwrapPendingRows(response: PendingRowsResponse): Record<string, unknown>[] {
    if (Array.isArray(response)) {
        return response.map(toRecord)
    }

    const responseRecord = toRecord(response)

    if (Array.isArray(responseRecord.rows)) {
        return responseRecord.rows.map(toRecord)
    }

    if (Array.isArray(responseRecord.data)) {
        return responseRecord.data.map(toRecord)
    }

    if (Array.isArray(responseRecord.pending)) {
        return responseRecord.pending.map(toRecord)
    }

    return []
}

function mapPendingItems(response: PendingRowsResponse): PendingItem[] {
    return unwrapPendingRows(response).map((item) => ({
        id: item.id as EntityId,
        name: String(
            item.name ??
            item.person ??
            item.customer ??
            item.supplier ??
            item.worker ??
            "Unknown"
        ),
        amount: toNumber(item.amount ?? item.total ?? item.price ?? item.salary),
        dayAgo: formatPendingTime(item.day_ago ?? item.date ?? item.created_at ?? item.createdAt)
    }))
}

function mapSummaryGroup(data: unknown): PendingSummaryItem {
    const record = toRecord(data)

    return {
        count: toNumber(record.count),
        total: toNumber(record.total)
    }
}

function mapPendingSummary(response: PendingSummaryResponse): PendingSummary {
    const responseRecord = toRecord(response)
    const source = toRecord(responseRecord.summary ?? responseRecord.data ?? response)
    const customers = mapSummaryGroup(source.customers ?? source.sales)
    const suppliers = mapSummaryGroup(source.suppliers ?? source.orders)
    const workers = mapSummaryGroup(source.workers ?? source.staff)

    return {
        customers,
        suppliers,
        workers,
        global: mapSummaryGroup(source.global ?? {
            count: customers.count + suppliers.count + workers.count,
            total: customers.total + suppliers.total + workers.total
        })
    }
}

function PendingSummaryCards({
    summary,
    currencyCode
}: {
    summary: PendingSummary
    currencyCode: string
}) {
    return (
        <div className="pending-content-summary">
            <div className="pending-content-summary-card">
                <h3>All Pending</h3>
                <h2>{formatCurrency(summary.global.total, currencyCode)}</h2>
                <p>{summary.global.count} records</p>
            </div>

            <div className="pending-content-summary-card">
                <h3>Customers</h3>
                <h2>{formatCurrency(summary.customers.total, currencyCode)}</h2>
                <p>{summary.customers.count} records</p>
            </div>

            <div className="pending-content-summary-card">
                <h3>Suppliers</h3>
                <h2>{formatCurrency(summary.suppliers.total, currencyCode)}</h2>
                <p>{summary.suppliers.count} records</p>
            </div>

            <div className="pending-content-summary-card">
                <h3>Workers</h3>
                <h2>{formatCurrency(summary.workers.total, currencyCode)}</h2>
                <p>{summary.workers.count} records</p>
            </div>
        </div>
    )
}

function PendingSection({
    title,
    scope,
    items,
    onResolve,
    submittingKey,
    currencyCode
}: {
    title: string
    scope: PendingScope
    items: PendingItem[]
    onResolve: (scope: PendingScope, id: EntityId, state: PendingState) => void
    submittingKey: string
    currencyCode: string
}) {
    return (
        <div className="pending-content-section">
            <div className="pending-content-title">
                <h3>{title}</h3>
                <p>{items.length} pending</p>
            </div>

            <div className="pending-content-users">
                {items.length === 0 ? (
                    <div className="pending-content-empty">
                        <p>No pending records.</p>
                    </div>
                ) : null}

                {items.map((item) => {
                    const isPaidLoading = submittingKey === `${scope}-${item.id}-paid`
                    const isCanceledLoading = submittingKey === `${scope}-${item.id}-canceled`
                    const isDisabled = Boolean(submittingKey)

                    return (
                        <div className="pending-content-user" key={item.id}>
                            <div className="pending-content-user-info">
                                <p className="pending-content-user-name">{item.name}</p>
                                <p className="pending-content-user-amount">{formatCurrency(item.amount, currencyCode)}</p>
                                <p className="pending-content-user-time">{item.dayAgo}</p>
                            </div>

                            <div className="pending-content-user-actions">
                                <button
                                    type="button"
                                    id="paid"
                                    onClick={() => onResolve(scope, item.id, "paid")}
                                    disabled={isDisabled}
                                >
                                    {isPaidLoading ? "Saving..." : "Mark Paid"}
                                </button>

                                <button
                                    type="button"
                                    id="canceled"
                                    onClick={() => onResolve(scope, item.id, "canceled")}
                                    disabled={isDisabled}
                                >
                                    {isCanceledLoading ? "Saving..." : "Cancel"}
                                </button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

function PendingContent({
    customers,
    suppliers,
    workers,
    summary,
    onResolve,
    submittingKey,
    currencyCode
}: {
    customers: PendingItem[]
    suppliers: PendingItem[]
    workers: PendingItem[]
    summary: PendingSummary
    onResolve: (scope: PendingScope, id: EntityId, state: PendingState) => void
    submittingKey: string
    currencyCode: string
}) {
    const sections: PendingSectionConfig[] = [
        { title: "Customer", scope: "customers", items: customers },
        { title: "Supplier", scope: "suppliers", items: suppliers },
        { title: "Worker", scope: "workers", items: workers }
    ]

    return (
        <div className="pending-content">
            <PendingSummaryCards summary={summary} currencyCode={currencyCode} />
            <div className="pending-content-sections">
                {sections.map((section) => (
                    <PendingSection
                        key={section.scope}
                        title={section.title}
                        scope={section.scope}
                        items={section.items}
                        onResolve={onResolve}
                        submittingKey={submittingKey}
                        currencyCode={currencyCode}
                    />
                ))}
            </div>
        </div>
    )
}

function PendingPage() {
    const bootstrap = useBootstrapData()
    const currencyCode = bootstrap.data?.session?.store?.currency_code ?? "PEN"
    const [customers, setCustomers] = useState<PendingItem[]>([])
    const [suppliers, setSuppliers] = useState<PendingItem[]>([])
    const [workers, setWorkers] = useState<PendingItem[]>([])
    const [summary, setSummary] = useState<PendingSummary>(EMPTY_SUMMARY)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [submittingKey, setSubmittingKey] = useState<string>("")

    const fetchUsersPending = useCallback(async () => {
        try {
            setIsLoading(true)

            const [summaryData, customersData, suppliersData, workersData] = await Promise.all([
                getPendingSummary(),
                getPendingRows("customers"),
                getPendingRows("suppliers"),
                getPendingRows("workers")
            ])

            setSummary(mapPendingSummary(summaryData))
            setCustomers(mapPendingItems(customersData))
            setSuppliers(mapPendingItems(suppliersData))
            setWorkers(mapPendingItems(workersData))
        } catch (caughtError) {
            console.error(caughtError)
            setSummary(EMPTY_SUMMARY)
            setCustomers([])
            setSuppliers([])
            setWorkers([])
            toast.error(getApiErrorMessage(caughtError, "Could not load pending records"))
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        void fetchUsersPending()
    }, [fetchUsersPending])

    const handleResolve = useCallback(async (scope: PendingScope, id: EntityId, state: PendingState) => {
        const nextSubmittingKey = `${scope}-${id}-${state}`

        try {
            setSubmittingKey(nextSubmittingKey)
            await updatePendingState({ scope, id, state })
            await fetchUsersPending()
            toast.success("Pending updated successfully")
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(caughtError, "Pending could not be updated"))
        } finally {
            setSubmittingKey("")
        }
    }, [fetchUsersPending])

    return (
        <StatsLayout
            className="pending-layout"
            titleClassName="pending-layout-title"
            contentClassName="pending-layout-content"
            title="Pending"
            description="On this page, you can review your pending records, check the pending amount by section, and resolve each record without leaving the stats area."
        >
            <PendingContent
                customers={customers}
                suppliers={suppliers}
                workers={workers}
                summary={summary}
                onResolve={(scope, id, state) => void handleResolve(scope, id, state)}
                submittingKey={submittingKey}
                currencyCode={currencyCode}
            />
            {isLoading ? <LoadingOverlay /> : null}
        </StatsLayout>
    )
}

export default PendingPage
