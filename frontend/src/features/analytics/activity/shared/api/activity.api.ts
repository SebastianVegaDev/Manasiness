import { apiGet } from "@shared/api/client"

import type {
    ActivityCatalogPerformanceResponse,
    ActivityDayPerformanceResponse,
    ActivityGrowthRateResponse,
    ActivityQueryParams
} from "../types/activity.types"
import type { QueryParamValue } from "@shared/types/api.types"

function sanitizeParams(params: ActivityQueryParams): Record<string, QueryParamValue> {
    const sanitizedParams: Record<string, QueryParamValue> = {
        offset: params.offset,
        activityDateFilter: params.activityDateFilter
    }

    if (params.catalogOption) {
        sanitizedParams.catalogOption = params.catalogOption
    }

    return sanitizedParams
}

export async function getGrowthRate(
    params: ActivityQueryParams
): Promise<ActivityGrowthRateResponse> {
    return apiGet<ActivityGrowthRateResponse>("/activity/growth-rate", {
        params: sanitizeParams(params)
    })
}

export async function getDayPerformance(
    params: ActivityQueryParams
): Promise<ActivityDayPerformanceResponse> {
    return apiGet<ActivityDayPerformanceResponse>("/activity/day-performance", {
        params: sanitizeParams(params)
    })
}

export async function getCatalogPerformance(
    params: ActivityQueryParams
): Promise<ActivityCatalogPerformanceResponse> {
    return apiGet<ActivityCatalogPerformanceResponse>("/activity/catalog-performance", {
        params: sanitizeParams(params)
    })
}
