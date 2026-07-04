import type { CurrencyCode } from "@shared/types/common.types"
import type { SelectOption } from "@shared/types/form.types"

export type ActivityPeriod = "week" | "month"

export type ActivityCatalogOption = "topSold" | "leastSold"

export type ActivityQueryParams = {
    offset: number
    activityDateFilter: ActivityPeriod | string
    catalogOption?: ActivityCatalogOption | string
}

export type ActivityGrowthRateResponse = {
    growth_rate?: number | string
    start_date?: string | null
    end_date?: string | null
    has_older?: boolean
    [key: string]: unknown
}

export type ActivityDayPerformanceResponse = {
    best_day_date?: string | null
    best_day_total?: number | string
    worst_day_date?: string | null
    worst_day_total?: number | string
    [key: string]: unknown
}

export type ActivityCatalogPerformanceResponse = {
    category_id?: number | string | null
    category_image?: string | null
    category_name?: string | null
    category_total_quantity?: number | string
    product_id?: number | string | null
    product_image?: string | null
    product_name?: string | null
    product_total_quantity?: number | string
    [key: string]: unknown
}

export type ActivityGrowthRate = {
    growthRate: number
    date: string
    hasOlder: boolean
    summary: string
}

export type ActivityDayPerformance = {
    bestDay: string
    bestDayDate: string
    bestDayTotalLabel: string
    worstDay: string
    worstDayDate: string
    worstDayTotalLabel: string
}

export type ActivityCatalogPerformance = {
    categoryId: number | string | null
    categoryImg: string
    categoryName: string
    categoryQuantity: number
    productId: number | string | null
    productImg: string
    productName: string
    productQuantity: number
}

export type ActivityBootstrapData = {
    growthRate?: ActivityGrowthRateResponse
    dayPerformance?: ActivityDayPerformanceResponse
    topSoldCatalog?: ActivityCatalogPerformanceResponse
    leastSoldCatalog?: ActivityCatalogPerformanceResponse
}

export type ActivityPageConfig = {
    title: string
    description: string
    initialPeriod: ActivityPeriod
    initialCatalogOption: ActivityCatalogOption
    initialOffset: number
    periodOptions: SelectOption[]
    catalogOptions: SelectOption[]
}

export type ActivityChangeEvent = {
    target: {
        value: string
    }
}

export type UseActivityPageState = {
    title: string
    description: string
    periodOptions: SelectOption[]
    catalogOptions: SelectOption[]
    growthRate: ActivityGrowthRate | null
    dayPerformance: ActivityDayPerformance | null
    catalogPerformance: ActivityCatalogPerformance | null
    period: ActivityPeriod
    catalogOption: ActivityCatalogOption
    offset: number
    hasOlder: boolean
    hasNewer: boolean
    isLoading: boolean
    handlePeriodChange: (event: ActivityChangeEvent) => void
    handleCatalogOptionChange: (event: ActivityChangeEvent) => void
    handleOlder: () => void
    handleNewer: () => void
    reload: () => Promise<void>
}

export type ActivityDashboardProps = {
    title: string
    description: string
    growthRate: ActivityGrowthRate | null
    dayPerformance: ActivityDayPerformance | null
    catalogPerformance: ActivityCatalogPerformance | null
    period: ActivityPeriod
    periodOptions: SelectOption[]
    onPeriodChange: (event: ActivityChangeEvent) => void
    catalogOption: ActivityCatalogOption
    catalogOptions: SelectOption[]
    onCatalogOptionChange: (event: ActivityChangeEvent) => void
    windowLabel: string
    hasOlder: boolean
    hasNewer: boolean
    onOlder: () => void
    onNewer: () => void
    isLoading: boolean
}

export type ActivityCurrencyCode = CurrencyCode | string
