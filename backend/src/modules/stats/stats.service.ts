import type { StoreScopedData } from "../../types/history.types.js"
import { mapStatsSummary } from "./stats.mapper.js"
import {
    findOrdersStatsSummary,
    findSalesStatsSummary,
    findStaffStatsSummary
} from "./repository/index.js"

export async function getStatsSales(data: StoreScopedData) {
    return mapStatsSummary(await findSalesStatsSummary(data))
}

export async function getStatsOrders(data: StoreScopedData) {
    return mapStatsSummary(await findOrdersStatsSummary(data))
}

export async function getStatsStaff(data: StoreScopedData) {
    return mapStatsSummary(await findStaffStatsSummary(data))
}