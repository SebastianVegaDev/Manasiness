import type { BootstrapPayload } from "../../types/bootstrap.types.js"
import type { StoreSession } from "../../types/store.types.js"

type BootstrapData = {
    store: StoreSession
    categoryOptions: unknown
    productOptions: unknown
    customerOptions: unknown
    supplierOptions: unknown
    workerOptions: unknown
    categories: unknown
    products: unknown
    users: unknown
    customers: unknown
    suppliers: unknown
    workers: unknown
    salesStats: unknown
    ordersStats: unknown
    staffStats: unknown
    pendingSummary: unknown
    customersPending: unknown
    suppliersPending: unknown
    workersPending: unknown
    incomeToday: unknown
    expensesToday: unknown
    incomeWeek: unknown
    expensesWeek: unknown
    sales: unknown
    orders: unknown
    staff: unknown
    growthRate: unknown
    dayPerformance: unknown
    topSoldCatalog: unknown
    leastSoldCatalog: unknown
}

export function mapBootstrapPayload(data: BootstrapData): BootstrapPayload {
    return {
        meta: {
            generated_at: new Date().toISOString()
        },

        session: {
            store: data.store
        },

        options: {
            categories: data.categoryOptions,
            products: data.productOptions,
            customers: data.customerOptions,
            suppliers: data.supplierOptions,
            workers: data.workerOptions
        },

        catalog: {
            categories: data.categories,
            products: data.products
        },

        people: {
            users: data.users,
            customers: data.customers,
            suppliers: data.suppliers,
            workers: data.workers
        },

        dashboard: {
            stats: {
                sales: data.salesStats,
                orders: data.ordersStats,
                staff: data.staffStats
            },
            pending: data.pendingSummary,
            incomeToday: data.incomeToday,
            expensesToday: data.expensesToday
        },

        pending: {
            summary: data.pendingSummary,
            customers: data.customersPending,
            suppliers: data.suppliersPending,
            workers: data.workersPending
        },

        charts: {
            incomeWeek: data.incomeWeek,
            expensesWeek: data.expensesWeek
        },

        initialWindows: {
            sales: data.sales,
            orders: data.orders,
            staff: data.staff
        },

        activity: {
            growthRate: data.growthRate,
            dayPerformance: data.dayPerformance,
            topSoldCatalog: data.topSoldCatalog,
            leastSoldCatalog: data.leastSoldCatalog
        }
    }
}