import { getGrowthRateByDate, getDayPerformanceByDate, getCatalogPerformanceByDate } from "../activity/activity.service.js"
import { getStoreSession } from "../auth/auth.service.js"
import { getActiveCategoryOptions, getAllCategories } from "../categories/categories.service.js"
import { getActiveCustomersOptions, getAllCustomers } from "../customers/customers.service.js"
import { getExpensesByDay, getExpensesByPeriod } from "../expenses/expenses.service.js"
import { getIncomeByDay, getIncomeByPeriod } from "../income/income.service.js"
import { getAllOrders } from "../orders/orders.service.js"
import { getPendingSummaryData, getUsersPending } from "../pending/pending.service.js"
import { getActiveProductOptions, getAllProducts } from "../products/products.service.js"
import { getAllSales } from "../sales/sales.service.js"
import { getAllStaff } from "../staff/staff.service.js"
import { getStatsOrders, getStatsSales, getStatsStaff } from "../stats/stats.service.js"
import { getActiveSuppliersOptions, getAllSuppliers } from "../suppliers/suppliers.service.js"
import { getAllUsers } from "../users/users.service.js"
import { getActiveWorkersOptions, getAllWorkers } from "../workers/workers.service.js"
import { mapBootstrapPayload } from "./bootstrap.mapper.js"
import {
    BOOTSTRAP_ACTIVITY_WEEK,
    BOOTSTRAP_CATALOG_FILTER,
    BOOTSTRAP_HISTORY_WINDOW,
    BOOTSTRAP_LEAST_SOLD_CATALOG,
    BOOTSTRAP_PEOPLE_FILTER,
    BOOTSTRAP_PERIOD_WINDOW,
    BOOTSTRAP_TOP_SOLD_CATALOG
} from "./bootstrap.constants.js"

function getTodayDateString(): string {
    return new Date().toISOString().slice(0, 10)
}

export async function getBootstrapData(data: { storeId: number }) {
    const { storeId } = data
    const today = getTodayDateString()

    const [
        store,

        categoryOptions,
        productOptions,
        customerOptions,
        supplierOptions,
        workerOptions,

        categories,
        products,

        users,
        customers,
        suppliers,
        workers,

        salesStats,
        ordersStats,
        staffStats,

        pendingSummary,
        customersPending,
        suppliersPending,
        workersPending,

        incomeToday,
        expensesToday,

        incomeWeek,
        expensesWeek,

        sales,
        orders,
        staff,

        growthRate,
        dayPerformance,
        topSoldCatalog,
        leastSoldCatalog
    ] = await Promise.all([
        getStoreSession(storeId),

        getActiveCategoryOptions({ storeId }),
        getActiveProductOptions({ storeId }),
        getActiveCustomersOptions({ storeId }),
        getActiveSuppliersOptions({ storeId }),
        getActiveWorkersOptions({ storeId }),

        getAllCategories({
            storeId,
            ...BOOTSTRAP_CATALOG_FILTER
        }),
        getAllProducts({
            storeId,
            ...BOOTSTRAP_CATALOG_FILTER,
            categoryId: null
        }),

        getAllUsers({
            storeId,
            search: "",
            status: "all",
            role: "all"
        }),
        getAllCustomers({
            storeId,
            ...BOOTSTRAP_PEOPLE_FILTER
        }),
        getAllSuppliers({
            storeId,
            ...BOOTSTRAP_PEOPLE_FILTER
        }),
        getAllWorkers({
            storeId,
            ...BOOTSTRAP_PEOPLE_FILTER
        }),

        getStatsSales({ storeId }),
        getStatsOrders({ storeId }),
        getStatsStaff({ storeId }),

        getPendingSummaryData({ storeId }),
        getUsersPending({ storeId, scope: "customers" }),
        getUsersPending({ storeId, scope: "suppliers" }),
        getUsersPending({ storeId, scope: "workers" }),

        getIncomeByDay({
            storeId,
            date: today,
            period: "week"
        }),
        getExpensesByDay({
            storeId,
            date: today,
            period: "week"
        }),

        getIncomeByPeriod({
            storeId,
            ...BOOTSTRAP_PERIOD_WINDOW
        }),
        getExpensesByPeriod({
            storeId,
            ...BOOTSTRAP_PERIOD_WINDOW
        }),

        getAllSales({
            storeId,
            ...BOOTSTRAP_HISTORY_WINDOW
        }),
        getAllOrders({
            storeId,
            ...BOOTSTRAP_HISTORY_WINDOW
        }),
        getAllStaff({
            storeId,
            ...BOOTSTRAP_HISTORY_WINDOW
        }),

        getGrowthRateByDate({
            storeId,
            ...BOOTSTRAP_ACTIVITY_WEEK
        }),
        getDayPerformanceByDate({
            storeId,
            ...BOOTSTRAP_ACTIVITY_WEEK
        }),
        getCatalogPerformanceByDate({
            storeId,
            ...BOOTSTRAP_TOP_SOLD_CATALOG
        }),
        getCatalogPerformanceByDate({
            storeId,
            ...BOOTSTRAP_LEAST_SOLD_CATALOG
        })
    ])

    return mapBootstrapPayload({
        store,

        categoryOptions,
        productOptions,
        customerOptions,
        supplierOptions,
        workerOptions,

        categories,
        products,

        users,
        customers,
        suppliers,
        workers,

        salesStats,
        ordersStats,
        staffStats,

        pendingSummary,
        customersPending,
        suppliersPending,
        workersPending,

        incomeToday,
        expensesToday,

        incomeWeek,
        expensesWeek,

        sales,
        orders,
        staff,

        growthRate,
        dayPerformance,
        topSoldCatalog,
        leastSoldCatalog
    })
}