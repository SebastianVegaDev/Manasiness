import { formatCurrency } from "@shared/utils/currency"
import {
    createActivityRangeLabel,
    formatActivityDate,
    getEnglishDay
} from "../utils/activityDate.utils"

import type {
    ActivityCatalogPerformance,
    ActivityCatalogPerformanceResponse,
    ActivityCurrencyCode,
    ActivityDayPerformance,
    ActivityDayPerformanceResponse,
    ActivityGrowthRate,
    ActivityGrowthRateResponse
} from "../types/activity.types"

const FALLBACK_IMAGE = "https://i.postimg.cc/KYydTs9w/noimage.png"

export function mapGrowthRate(data: ActivityGrowthRateResponse | null | undefined): ActivityGrowthRate {
    const rate = Number(data?.growth_rate ?? 0)

    return {
        growthRate: rate,
        date: createActivityRangeLabel(data?.start_date, data?.end_date),
        hasOlder: Boolean(data?.has_older),
        summary: rate > 0
            ? "Higher than the previous period."
            : rate < 0
                ? "Lower than the previous period."
                : "Same as the previous period."
    }
}

export function mapDayPerformance(
    data: ActivityDayPerformanceResponse | null | undefined,
    currencyCode: ActivityCurrencyCode = "PEN"
): ActivityDayPerformance {
    return {
        bestDay: getEnglishDay(data?.best_day_date),
        bestDayDate: formatActivityDate(data?.best_day_date),
        bestDayTotalLabel: formatCurrency(data?.best_day_total, currencyCode),
        worstDay: getEnglishDay(data?.worst_day_date),
        worstDayDate: formatActivityDate(data?.worst_day_date),
        worstDayTotalLabel: formatCurrency(data?.worst_day_total, currencyCode)
    }
}

export function mapCatalogPerformance(
    data: ActivityCatalogPerformanceResponse | null | undefined
): ActivityCatalogPerformance {
    return {
        categoryId: data?.category_id ?? null,
        categoryImg: data?.category_image || FALLBACK_IMAGE,
        categoryName: data?.category_name ?? "",
        categoryQuantity: Number(data?.category_total_quantity ?? 0),
        productId: data?.product_id ?? null,
        productImg: data?.product_image || FALLBACK_IMAGE,
        productName: data?.product_name ?? "",
        productQuantity: Number(data?.product_total_quantity ?? 0)
    }
}
