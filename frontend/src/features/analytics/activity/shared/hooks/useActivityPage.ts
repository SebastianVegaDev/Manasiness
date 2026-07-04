import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from "react"
import { toast } from "react-toastify"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import {
    getCatalogPerformance,
    getDayPerformance,
    getGrowthRate
} from "../api/activity.api"
import { ACTIVITY_PAGE_CONFIG } from "../config/activity.config"
import {
    mapCatalogPerformance,
    mapDayPerformance,
    mapGrowthRate
} from "../mappers/activity.mapper"

import type {
    ActivityBootstrapData,
    ActivityCatalogOption,
    ActivityChangeEvent,
    ActivityDayPerformance,
    ActivityCatalogPerformance,
    ActivityGrowthRate,
    ActivityPeriod,
    UseActivityPageState
} from "../types/activity.types"

function getCurrencyCode(bootstrapData: unknown): string {
    const data = bootstrapData as {
        session?: {
            store?: {
                currency_code?: string
                currencyCode?: string
            }
        }
    } | null

    return data?.session?.store?.currency_code || data?.session?.store?.currencyCode || "PEN"
}

function getBootstrapActivity(bootstrapData: unknown): ActivityBootstrapData | null {
    const data = bootstrapData as {
        activity?: ActivityBootstrapData
    } | null

    return data?.activity ?? null
}

function shouldUseBootstrapActivity({
    period,
    offset
}: {
    period: ActivityPeriod
    offset: number
}): boolean {
    return (
        period === ACTIVITY_PAGE_CONFIG.initialPeriod &&
        Number(offset) === ACTIVITY_PAGE_CONFIG.initialOffset
    )
}

function normalizePeriod(value: string): ActivityPeriod {
    return value === "month" ? "month" : "week"
}

function normalizeCatalogOption(value: string): ActivityCatalogOption {
    return value === "leastSold" ? "leastSold" : "topSold"
}

export function useActivityPage(): UseActivityPageState {
    const bootstrap = useBootstrapData()

    const [period, setPeriodState] = useState<ActivityPeriod>(ACTIVITY_PAGE_CONFIG.initialPeriod)
    const [catalogOption, setCatalogOptionState] = useState<ActivityCatalogOption>(ACTIVITY_PAGE_CONFIG.initialCatalogOption)
    const [offset, setOffset] = useState<number>(ACTIVITY_PAGE_CONFIG.initialOffset)
    const [growthRate, setGrowthRate] = useState<ActivityGrowthRate | null>(null)
    const [dayPerformance, setDayPerformance] = useState<ActivityDayPerformance | null>(null)
    const [catalogPerformance, setCatalogPerformance] = useState<ActivityCatalogPerformance | null>(null)
    const [hasOlder, setHasOlder] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const currencyCode = useMemo(() => {
        return getCurrencyCode(bootstrap.data)
    }, [bootstrap.data])

    const filters = useMemo(() => {
        return {
            offset,
            activityDateFilter: period,
            catalogOption
        }
    }, [
        catalogOption,
        offset,
        period
    ])

    const applyBootstrapDataIfAvailable = useCallback(() => {
        if (!shouldUseBootstrapActivity({ period, offset })) {
            return false
        }

        const activity = getBootstrapActivity(bootstrap.data)

        if (!activity) {
            return false
        }

        const catalogData = catalogOption === "leastSold"
            ? activity.leastSoldCatalog
            : activity.topSoldCatalog

        setGrowthRate(mapGrowthRate(activity.growthRate))
        setDayPerformance(mapDayPerformance(activity.dayPerformance, currencyCode))
        setCatalogPerformance(mapCatalogPerformance(catalogData))
        setHasOlder(Boolean(activity.growthRate?.has_older))

        return true
    }, [
        bootstrap.data,
        catalogOption,
        currencyCode,
        offset,
        period
    ])

    const loadActivity = useCallback(async () => {
        if (applyBootstrapDataIfAvailable()) {
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        try {
            const [growthRateData, dayPerformanceData, catalogPerformanceData] = await Promise.all([
                getGrowthRate(filters),
                getDayPerformance(filters),
                getCatalogPerformance(filters)
            ])

            setGrowthRate(mapGrowthRate(growthRateData))
            setDayPerformance(mapDayPerformance(dayPerformanceData, currencyCode))
            setCatalogPerformance(mapCatalogPerformance(catalogPerformanceData))
            setHasOlder(Boolean(growthRateData?.has_older))
        } catch (caughtError) {
            console.error(caughtError)
            setGrowthRate(null)
            setDayPerformance(null)
            setCatalogPerformance(null)
            setHasOlder(false)
            toast.error("Could not load activity")
        } finally {
            setIsLoading(false)
        }
    }, [
        applyBootstrapDataIfAvailable,
        currencyCode,
        filters
    ])

    useEffect(() => {
        void loadActivity()
    }, [loadActivity])

    function handlePeriodChange(event: ActivityChangeEvent): void {
        setPeriodState(normalizePeriod(event.target.value))
        setOffset(0)
    }

    function handleCatalogOptionChange(event: ActivityChangeEvent): void {
        setCatalogOptionState(normalizeCatalogOption(event.target.value))
        setOffset(0)
    }

    function handleOlder(): void {
        if (!hasOlder) {
            return
        }

        setOffset((currentOffset) => currentOffset + 1)
    }

    function handleNewer(): void {
        setOffset((currentOffset) => Math.max(currentOffset - 1, 0))
    }

    return {
        title: ACTIVITY_PAGE_CONFIG.title,
        description: ACTIVITY_PAGE_CONFIG.description,
        periodOptions: ACTIVITY_PAGE_CONFIG.periodOptions,
        catalogOptions: ACTIVITY_PAGE_CONFIG.catalogOptions,
        growthRate,
        dayPerformance,
        catalogPerformance,
        period,
        catalogOption,
        offset,
        hasOlder,
        hasNewer: offset > 0,
        isLoading: isLoading || bootstrap.isLoading,
        handlePeriodChange,
        handleCatalogOptionChange,
        handleOlder,
        handleNewer,
        reload: loadActivity
    }
}
