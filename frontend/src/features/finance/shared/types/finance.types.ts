import type {
    CurrencyCode,
    EntityId,
    PeriodFilter
} from "@shared/types/common.types"
import type {
    BootstrapContextValue,
    BootstrapData
} from "@features/bootstrap/shared/types/bootstrap.types"

export type FinanceReportScope = "income" | "expenses"

export type FinancePeriod = PeriodFilter | "week" | "month"

export type FinanceReportParams = {
    period?: FinancePeriod
    offset?: number
}

export type FinanceDayParams = {
    date?: string
}

export type FinanceChartPoint = {
    date: string
    day?: string
    name?: string
    label: string
    total: number
    raw?: unknown
}

export type FinanceSummaryCard = {
    total: number
    totalsub1?: number
    totalsub2?: number
    count: number
    average: number
    currencyCode: CurrencyCode | string
}

export type FinanceSummaryLabels = {
    total?: string
    totalsub1?: string
    totalsub2?: string
    totalLabel: string
    countLabel: string
    averageLabel: string
}

export type FinanceReportResponse = {
    rows?: unknown[]
    data?: unknown[]
    chart?: unknown[]
    total?: number | string
    count?: number | string
    average?: number | string
    summary?: {
        total?: number | string
        count?: number | string
        average?: number | string
        [key: string]: unknown
    }
    [key: string]: unknown
}

export type FinanceDaySummaryResponse = {
    total?: number | string
    count?: number | string
    average?: number | string
    data?: {
        total?: number | string
        count?: number | string
        average?: number | string
        [key: string]: unknown
    }
    summary?: {
        total?: number | string
        count?: number | string
        average?: number | string
        [key: string]: unknown
    }
    [key: string]: unknown
}

export type FinanceReportConfig = {
    scope: FinanceReportScope
    title: string
    description?: string
    subtitle: string
    chartTitle: string
    summaryTitle: string
    emptyMessage: string
    totalLabel: string
    countLabel: string
    averageLabel: string
    loadErrorMessage: string
    daySummaryErrorMessage: string
    bootstrapChartKey?: string
    bootstrapCardKey?: string
    getPeriod?: (params: FinanceReportParams) => Promise<FinanceReportResponse>
    getDay?: (params: FinanceDayParams & { period?: FinancePeriod }) => Promise<FinanceDaySummaryResponse>
    getReport?: (params: FinanceReportParams) => Promise<FinanceReportResponse>
    getDaySummary?: (params: FinanceDayParams) => Promise<FinanceDaySummaryResponse>
    mapChart?: (rows: unknown[]) => FinanceChartPoint[]
    normalizeCard?: (data: unknown) => FinanceSummaryCard
    emptyCard?: FinanceSummaryCard
    summaryLabels?: FinanceSummaryLabels
}

export type UseFinancialReportPageInput = {
    config: FinanceReportConfig
    getReport: (params: FinanceReportParams) => Promise<FinanceReportResponse>
    getDaySummary: (params: FinanceDayParams) => Promise<FinanceDaySummaryResponse>
}

export type UseFinancialReportPageState = {
    period: FinancePeriod
    periodOffset: number
    selectedDate: string | null

    chartData: FinanceChartPoint[]
    summaryCard: FinanceSummaryCard
    summaryLabels: FinanceSummaryLabels

    currencyCode: CurrencyCode | string

    isLoadingChart: boolean
    isLoadingSummary: boolean

    onPeriodChange: (event: { target: { value: string } }) => void
    onPeriodOffsetChange: (nextOffset: number) => void
    onChartDateSelect: (date: string) => void
    reload: () => Promise<void>
    title?: string
    description?: string
    startDate?: string
    endDate?: string
    hasOlder?: boolean
    handlePeriodChange: (period: FinancePeriod) => void
    setPeriodOffset: (nextOffset: number) => void
    handleChartDateSelect: (date: string) => void

    /*
     * Aliases temporales por compatibilidad si alguna pantalla JSX vieja
     * todavia usa nombres anteriores.
     */
    infoBar: FinanceChartPoint[]
    infoCard: FinanceSummaryCard
    titlesCard: FinanceSummaryLabels
    offset: number
    setOffset: (nextOffset: number) => void
    setDate: (date: string) => void
    isLoadingBar: boolean
    isLoadingCard: boolean
}

export type LegacyPendingScope = "customers" | "suppliers" | "workers"

export type PendingScope = "sales" | "orders" | "staff" | LegacyPendingScope

export type PendingSummaryScope = {
    count: number
    total: number
}

export type PendingSummary = {
    global: PendingSummaryScope
    sales: PendingSummaryScope
    orders: PendingSummaryScope
    staff: PendingSummaryScope
    customers?: PendingSummaryScope
    suppliers?: PendingSummaryScope
    workers?: PendingSummaryScope
}

export type PendingRow = {
    id: EntityId
    date?: string | null
    created_at?: string | null
    createdAt?: string | null
    person?: string
    customer?: string
    supplier?: string
    worker?: string
    product?: string
    amount?: number | string
    total?: number | string
    price?: number | string
    salary?: number | string
    state?: string
    [key: string]: unknown
}

export type PendingRowsResponse =
    | PendingRow[]
    | {
        rows?: PendingRow[]
        data?: PendingRow[]
        pending?: PendingRow[]
        [key: string]: unknown
    }

export type PendingSummaryResponse =
    | PendingSummary
    | {
        data?: Partial<PendingSummary>
        summary?: Partial<PendingSummary>
        [key: string]: unknown
    }

export type PendingConfig = {
    scopes: PendingScope[]
    defaultScope: PendingScope
    title: string
    subtitle: string
    emptyMessage: string
    loadErrorMessage: string
    updateSuccessMessage: string
    updateErrorMessage: string
}

export type UsePendingPageInput = {
    config: PendingConfig
    getSummary: () => Promise<PendingSummaryResponse>
    getRows: (scope: PendingScope) => Promise<PendingRowsResponse>
    markAsPaid: (scope: PendingScope, id: EntityId) => Promise<unknown>
    bootstrap?: BootstrapContextValue
}

export type UsePendingPageState = {
    scopes: PendingScope[]
    selectedScope: PendingScope
    summary: PendingSummary
    rows: PendingRow[]
    currencyCode: CurrencyCode | string
    isLoading: boolean
    isUpdating: boolean
    setSelectedScope: (scope: PendingScope) => void
    handleScopeChange: (event: { target: { value: string } }) => void
    handleMarkAsPaid: (row: PendingRow) => Promise<void>
    reload: () => Promise<void>
    activeScope?: LegacyPendingScope
    rowsByScope?: Record<LegacyPendingScope, PendingRow[]>
    customers?: PendingRow[]
    suppliers?: PendingRow[]
    workers?: PendingRow[]
    isResolving?: boolean
    submittingKey?: string
    changeScope?: (scope: LegacyPendingScope) => void
    resolvePending?: (scope: LegacyPendingScope, id: EntityId, state: string) => Promise<void>
    refreshPending?: () => Promise<void>
}

export type FinanceBootstrapUpdateInput = {
    bootstrap: BootstrapContextValue
    scope: PendingScope
    rows?: PendingRow[]
    summary?: PendingSummary
}

export type FinanceBootstrapData = BootstrapData | null
