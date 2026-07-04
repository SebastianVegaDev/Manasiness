import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { toast } from "react-toastify"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import {
    getReportMeta,
    normalizeReportRows,
    shouldUseBootstrapReport
} from "../utils/financeReport.utils"
import {
    getTodayDateString,
    resolveChartDate
} from "../utils/financeDate.utils"

import type {
    FinanceChartPoint,
    FinancePeriod,
    FinanceReportConfig,
    FinanceSummaryCard,
    UseFinancialReportPageInput,
    UseFinancialReportPageState
} from "../types/finance.types"
import type { CurrencyCode } from "@shared/types/common.types"

function getBootstrapChart(bootstrapData: unknown, key: string | undefined): unknown[] {
    const data = bootstrapData as {
        charts?: Record<string, unknown[]>
    } | null

    return key ? data?.charts?.[key] ?? [] : []
}

function getBootstrapCard(bootstrapData: unknown, key: string | undefined): unknown {
    const data = bootstrapData as {
        dashboard?: Record<string, unknown>
    } | null

    return key ? data?.dashboard?.[key] ?? null : null
}

function getCurrencyCode(bootstrapData: unknown): CurrencyCode | string {
    const data = bootstrapData as {
        session?: {
            store?: {
                currency_code?: string
                currencyCode?: string
            }
        }
    } | null

    return (
        data?.session?.store?.currency_code ||
        data?.session?.store?.currencyCode ||
        "PEN"
    )
}

function resolveInput(input: FinanceReportConfig | UseFinancialReportPageInput): {
    config: FinanceReportConfig
    getReport: UseFinancialReportPageInput["getReport"]
    getDaySummary: UseFinancialReportPageInput["getDaySummary"]
} {
    if ("config" in input) {
        return input as {
            config: FinanceReportConfig
            getReport: UseFinancialReportPageInput["getReport"]
            getDaySummary: UseFinancialReportPageInput["getDaySummary"]
        }
    }

    const config = input as FinanceReportConfig

    if (!config.getPeriod || !config.getDay) {
        throw new Error("Finance report config is missing loaders")
    }

    return {
        config,
        getReport: config.getReport ?? config.getPeriod,
        getDaySummary: config.getDaySummary ?? config.getDay
    }
}

function createEmptySummaryCard(
    config: FinanceReportConfig,
    currencyCode: CurrencyCode | string
): FinanceSummaryCard {
    return {
        ...(config.emptyCard ?? {
            total: 0,
            totalsub1: 0,
            totalsub2: 0,
            count: 0,
            average: 0
        }),
        currencyCode
    }
}

export function useFinancialReportPage(
    input: FinanceReportConfig | UseFinancialReportPageInput
): UseFinancialReportPageState {
    const {
        config,
        getReport,
        getDaySummary
    } = resolveInput(input)

    const bootstrap = useBootstrapData()
    const [period, setPeriod] = useState<FinancePeriod>("week")
    const [periodOffset, setPeriodOffsetState] = useState<number>(0)
    const [selectedDate, setSelectedDate] = useState<string | null>(getTodayDateString())

    const [rawChartData, setRawChartData] = useState<unknown[]>(() => {
        return normalizeReportRows(getBootstrapChart(bootstrap.data, config.bootstrapChartKey))
    })

    const [summaryCard, setSummaryCard] = useState<FinanceSummaryCard>(() => {
        const currencyCode = getCurrencyCode(bootstrap.data)
        const bootstrapCard = getBootstrapCard(bootstrap.data, config.bootstrapCardKey)

        if (config.normalizeCard) {
            return {
                ...config.normalizeCard(bootstrapCard ?? config.emptyCard),
                currencyCode
            }
        }

        return createEmptySummaryCard(config, currencyCode)
    })

    const [isLoadingChart, setIsLoadingChart] = useState<boolean>(true)
    const [isLoadingSummary, setIsLoadingSummary] = useState<boolean>(false)

    const chartData = useMemo<FinanceChartPoint[]>(() => {
        const normalizedRows = normalizeReportRows(rawChartData)

        if (config.mapChart) {
            return config.mapChart(normalizedRows)
        }

        return normalizedRows as FinanceChartPoint[]
    }, [
        config,
        rawChartData
    ])

    const reportMeta = useMemo(() => {
        return getReportMeta(rawChartData)
    }, [rawChartData])

    const currencyCode = useMemo(() => {
        return getCurrencyCode(bootstrap.data)
    }, [bootstrap.data])

    const loadPeriod = useCallback(async () => {
        if (shouldUseBootstrapReport({ period, offset: periodOffset })) {
            const bootstrapChart = getBootstrapChart(bootstrap.data, config.bootstrapChartKey)

            if (Array.isArray(bootstrapChart)) {
                setRawChartData(normalizeReportRows(bootstrapChart))
                setIsLoadingChart(false)
                return
            }
        }

        setIsLoadingChart(true)

        try {
            const data = await getReport({
                period,
                offset: periodOffset
            })

            setRawChartData(normalizeReportRows(data))
        } catch (caughtError) {
            console.error(caughtError)
            setRawChartData([])
            toast.error(config.loadErrorMessage)
        } finally {
            setIsLoadingChart(false)
        }
    }, [
        bootstrap.data,
        config,
        getReport,
        period,
        periodOffset
    ])

    const loadDay = useCallback(async () => {
        if (!selectedDate) {
            setSummaryCard(createEmptySummaryCard(config, currencyCode))
            return
        }

        const today = getTodayDateString()

        if (selectedDate === today && shouldUseBootstrapReport({ period, offset: periodOffset })) {
            const bootstrapCard = getBootstrapCard(bootstrap.data, config.bootstrapCardKey)

            if (bootstrapCard && config.normalizeCard) {
                setSummaryCard({
                    ...config.normalizeCard(bootstrapCard),
                    currencyCode
                })
                setIsLoadingSummary(false)
                return
            }
        }

        setIsLoadingSummary(true)

        try {
            const data = await getDaySummary({
                date: selectedDate
            })

            const nextSummary = config.normalizeCard
                ? config.normalizeCard(data)
                : createEmptySummaryCard(config, currencyCode)

            setSummaryCard({
                ...nextSummary,
                currencyCode
            })
        } catch (caughtError) {
            console.error(caughtError)
            setSummaryCard(createEmptySummaryCard(config, currencyCode))
            toast.error(config.daySummaryErrorMessage)
        } finally {
            setIsLoadingSummary(false)
        }
    }, [
        bootstrap.data,
        config,
        currencyCode,
        getDaySummary,
        period,
        periodOffset,
        selectedDate
    ])

    useEffect(() => {
        void loadPeriod()
    }, [loadPeriod])

    useEffect(() => {
        if (!chartData.length) {
            setSelectedDate("")
            return
        }

        setSelectedDate((currentDate) => {
            const stillExists = chartData.some((item) => item.day === currentDate)
            const lastItem = chartData[chartData.length - 1]

            return stillExists ? currentDate : lastItem?.day ?? ""
        })
    }, [chartData])

    useEffect(() => {
        void loadDay()
    }, [loadDay])

    function handlePeriodChange(nextPeriod: FinancePeriod): void {
        setPeriod(nextPeriod)
        setPeriodOffsetState(0)
        setSelectedDate(getTodayDateString())
    }

    function onPeriodChange(event: { target: { value: string } }): void {
        handlePeriodChange(event.target.value as FinancePeriod)
    }

    function setPeriodOffset(nextOffset: number): void {
        setPeriodOffsetState(nextOffset)
    }

    function handleChartDateSelect(value: string): void {
        const resolvedDate = resolveChartDate(value)

        if (!resolvedDate) {
            return
        }

        setSelectedDate(resolvedDate)
    }

    const reload = useCallback(async () => {
        await Promise.all([
            loadPeriod(),
            loadDay()
        ])
    }, [
        loadDay,
        loadPeriod
    ])

    const summaryLabels = config.summaryLabels ?? {
        totalLabel: config.totalLabel,
        countLabel: config.countLabel,
        averageLabel: config.averageLabel
    }

    return {
        period,
        periodOffset,
        selectedDate,
        chartData,
        summaryCard,
        summaryLabels,
        currencyCode,
        isLoadingChart: isLoadingChart || bootstrap.isLoading,
        isLoadingSummary: isLoadingSummary || bootstrap.isLoading,
        onPeriodChange,
        onPeriodOffsetChange: setPeriodOffset,
        onChartDateSelect: handleChartDateSelect,
        reload,
        title: config.title,
        description: config.description ?? config.subtitle,
        startDate: reportMeta.startDate,
        endDate: reportMeta.endDate,
        hasOlder: reportMeta.hasOlder,
        handlePeriodChange,
        setPeriodOffset,
        handleChartDateSelect,
        infoBar: chartData,
        infoCard: summaryCard,
        titlesCard: summaryLabels,
        offset: periodOffset,
        setOffset: setPeriodOffset,
        setDate: handleChartDateSelect,
        isLoadingBar: isLoadingChart || bootstrap.isLoading,
        isLoadingCard: isLoadingSummary || bootstrap.isLoading
    }
}

export default useFinancialReportPage
