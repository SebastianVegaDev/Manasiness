import type {
    CurrencyCode,
    EntityId,
    EntityStatus,
    MovementState,
    UserRole
} from "@shared/types/common.types"

export type BootstrapOption = {
    id: EntityId
    name: string
    image?: string | null
    role?: UserRole | string
    status?: EntityStatus | string
    is_active?: boolean
    isActive?: boolean
    is_default?: boolean
    isDefault?: boolean
    disabled?: boolean
    disabledLabel?: string
}

export type BootstrapStore = {
    id?: EntityId
    name?: string
    email?: string
    phone?: string | null
    image?: string | null
    currency_code?: CurrencyCode | string
    currencyCode?: CurrencyCode | string
}

export type BootstrapUser = {
    id: EntityId
    name: string
    email?: string
    phone?: string | null
    image?: string | null
    role?: UserRole | string
    status?: EntityStatus | string
    is_active?: boolean
    isActive?: boolean
}

export type BootstrapCatalogItem = {
    id: EntityId
    name: string
    image?: string | null
    status?: EntityStatus | string
    is_active?: boolean
    isActive?: boolean
    category_id?: EntityId
    categoryId?: EntityId
    category_name?: string
    categoryName?: string
    cost_price?: number | string
    costPrice?: number | string
    sale_price?: number | string
    salePrice?: number | string
    stock?: number | string
}

export type BootstrapMovementRow = {
    id: EntityId
    date?: string
    created_at?: string
    createdAt?: string
    state?: MovementState | string
    amount?: number | string
    total?: number | string
    price?: number | string
    salary?: number | string
    [key: string]: unknown
}

export type BootstrapInitialWindow = {
    rows?: BootstrapMovementRow[]
    data?: BootstrapMovementRow[]
    total_rows?: number | string
    totalRows?: number | string
    has_older?: boolean
    hasOlder?: boolean
    start_date?: string
    startDate?: string
    end_date?: string
    endDate?: string
}

export type BootstrapStat = {
    count?: number | string
    total?: number | string
    [key: string]: unknown
}

export type BootstrapPendingSummaryScope = {
    count?: number | string
    total?: number | string
}

export type BootstrapPendingSummary = {
    global?: BootstrapPendingSummaryScope
    sales?: BootstrapPendingSummaryScope
    orders?: BootstrapPendingSummaryScope
    staff?: BootstrapPendingSummaryScope
    [key: string]: BootstrapPendingSummaryScope | undefined
}

export type BootstrapActivityData = {
    growthRate?: unknown
    dayPerformance?: unknown
    topSoldCatalog?: unknown
    leastSoldCatalog?: unknown
    [key: string]: unknown
}

export type BootstrapSession = {
    store?: BootstrapStore
    user?: BootstrapUser
    [key: string]: unknown
}

export type BootstrapOptions = {
    categories?: BootstrapOption[]
    products?: BootstrapOption[]
    users?: BootstrapOption[]
    customers?: BootstrapOption[]
    suppliers?: BootstrapOption[]
    workers?: BootstrapOption[]
    [key: string]: BootstrapOption[] | undefined
}

export type BootstrapCatalog = {
    categories?: BootstrapCatalogItem[]
    products?: BootstrapCatalogItem[]
    [key: string]: BootstrapCatalogItem[] | undefined
}

export type BootstrapPeople = {
    users?: BootstrapUser[]
    customers?: BootstrapUser[]
    suppliers?: BootstrapUser[]
    workers?: BootstrapUser[]
    [key: string]: BootstrapUser[] | undefined
}

export type BootstrapInitialWindows = {
    sales?: BootstrapInitialWindow
    orders?: BootstrapInitialWindow
    staff?: BootstrapInitialWindow
    [key: string]: BootstrapInitialWindow | undefined
}

export type BootstrapDashboard = {
    stats?: {
        sales?: BootstrapStat
        orders?: BootstrapStat
        staff?: BootstrapStat
        [key: string]: BootstrapStat | undefined
    }
    pending?: BootstrapPendingSummary
    incomeToday?: unknown
    expensesToday?: unknown
    [key: string]: unknown
}

export type BootstrapPending = {
    sales?: BootstrapMovementRow[]
    orders?: BootstrapMovementRow[]
    staff?: BootstrapMovementRow[]
    summary?: BootstrapPendingSummary
    [key: string]: BootstrapMovementRow[] | BootstrapPendingSummary | undefined
}

export type BootstrapCharts = {
    incomeWeek?: unknown[]
    expensesWeek?: unknown[]
    [key: string]: unknown[] | undefined
}

export type BootstrapData = {
    session?: BootstrapSession
    options?: BootstrapOptions
    catalog?: BootstrapCatalog
    people?: BootstrapPeople
    initialWindows?: BootstrapInitialWindows
    dashboard?: BootstrapDashboard
    pending?: BootstrapPending
    charts?: BootstrapCharts
    activity?: BootstrapActivityData
    [key: string]: unknown
}

export type BootstrapResponse = BootstrapData | {
    data?: BootstrapData
    bootstrap?: BootstrapData
    payload?: BootstrapData
}

export type BootstrapUpdater = (currentData: BootstrapData | null) => BootstrapData

export type BootstrapContextValue = {
    data: BootstrapData | null
    isLoading: boolean
    error: string | null
    reload: () => Promise<void>
    clearBootstrap: () => void
    setBootstrapData: (data: BootstrapData | null) => void
    updateBootstrap: (updater: BootstrapUpdater) => void
}







