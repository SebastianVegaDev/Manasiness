import type { ActivityBaseData, ActivityCatalogData } from "../../types/activity.types.js"
import {
    mapCatalogPerformance,
    mapDayPerformance,
    mapGrowthRate
} from "./activity.mapper.js"
import {
    findCatalogPerformance,
    findDayPerformance,
    findGrowthRate
} from "./repository/index.js"

export async function getGrowthRateByDate(data: ActivityBaseData) {
    return mapGrowthRate(await findGrowthRate(data))
}

export async function getDayPerformanceByDate(data: ActivityBaseData) {
    return mapDayPerformance(await findDayPerformance(data))
}

export async function getCatalogPerformanceByDate(data: ActivityCatalogData) {
    return mapCatalogPerformance(await findCatalogPerformance(data))
}