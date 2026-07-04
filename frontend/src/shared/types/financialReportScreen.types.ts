import type {
    CurrencyCode,
    PeriodFilter
} from "@shared/types/common.types"

export type FinancePeriod = PeriodFilter | "week" | "month"

export type FinancialChartPoint = {
    date: string
    day?: string
    name?: string
    label: string
    total: number
    raw?: unknown
}

export type FinancialSummaryCard = {
    total: number
    totalsub1?: number
    totalsub2?: number
    count: number
    average: number
    currencyCode?: CurrencyCode | string
}

export type FinancialSummaryLabels = {
    total?: string
    totalsub1?: string
    totalsub2?: string
    totalLabel: string
    countLabel: string
    averageLabel: string
}

export type FinancialReportPeriodChangeEvent = {
    target: {
        value: string
    }
}

export type FinancialReportScreenProps = {
    title: string
    subtitle?: string
    chartTitle?: string
    summaryTitle?: string
    emptyMessage?: string

    period?: FinancePeriod | string
    onPeriodChange?: (event: FinancialReportPeriodChangeEvent) => void

    periodOffset?: number
    onPeriodOffsetChange?: (offset: number) => void

    selectedDate?: string | null
    onChartDateSelect?: (date: string) => void

    chartData?: FinancialChartPoint[]
    summaryCard?: FinancialSummaryCard
    summaryLabels?: FinancialSummaryLabels

    currencyCode?: CurrencyCode | string

    isLoadingChart?: boolean
    isLoadingSummary?: boolean

    infoBar?: FinancialChartPoint[]
    infoCard?: FinancialSummaryCard
    titlesCard?: FinancialSummaryLabels
    offset?: number
    setOffset?: (offset: number) => void
    setDate?: (date: string) => void
    isLoadingBar?: boolean
    isLoadingCard?: boolean
}

