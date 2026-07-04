import type {
    FinanceReportConfig,
    FinanceReportScope
} from "../types/finance.types"
import {
    getExpensesDay,
    getExpensesDaySummary,
    getExpensesPeriod,
    getExpensesReport,
    getIncomeDay,
    getIncomeDaySummary,
    getIncomePeriod,
    getIncomeReport
} from "../api/finance.api"
import {
    normalizeExpensesCard,
    normalizeIncomeCard
} from "../mappers/financeReport.mapper"
import type { FinanceChartPoint } from "../types/finance.types"

function getWeekDayName(date: string): string {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short" })
}

function mapFinancePeriodRows(data: unknown[]): FinanceChartPoint[] {
    return data.map((item) => {
        const record = item as {
            day?: unknown
            total?: unknown
        }
        const safeDay = String(record.day ?? "").split("T")[0] ?? ""

        return {
            date: safeDay,
            day: safeDay,
            name: getWeekDayName(safeDay),
            label: new Date(`${safeDay}T00:00:00`).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
            }),
            total: Number(record.total ?? 0),
            raw: item
        }
    })
}

export const FINANCE_REPORT_CONFIG: Record<FinanceReportScope, FinanceReportConfig> = {
    income: {
        scope: "income",
        title: "Income",
        description: "On this page, you can view your income in a more organized and straightforward way. Select a bar and check the information.",
        subtitle: "Review your income by period and day.",
        chartTitle: "Income chart",
        summaryTitle: "Income summary",
        emptyMessage: "No income records found.",
        totalLabel: "Total income",
        countLabel: "Paid records",
        averageLabel: "Average income",
        loadErrorMessage: "Could not load income report",
        daySummaryErrorMessage: "Could not load income day summary",
        bootstrapChartKey: "incomeWeek",
        bootstrapCardKey: "incomeToday",
        getPeriod: getIncomePeriod,
        getDay: getIncomeDay,
        getReport: getIncomeReport,
        getDaySummary: getIncomeDaySummary,
        mapChart: mapFinancePeriodRows,
        normalizeCard: normalizeIncomeCard,
        emptyCard: {
            total: 0,
            totalsub1: 0,
            totalsub2: 0,
            count: 0,
            average: 0,
            currencyCode: "PEN"
        },
        summaryLabels: {
            total: "Net Income",
            totalsub1: "Total Sold",
            totalsub2: "Total Spent",
            totalLabel: "Net Income",
            countLabel: "Total Sold",
            averageLabel: "Total Spent"
        }
    },

    expenses: {
        scope: "expenses",
        title: "Expenses",
        description: "On this page, you can view your expenses in a more organized and straightforward way. Select a bar and check the information.",
        subtitle: "Review your expenses by period and day.",
        chartTitle: "Expenses chart",
        summaryTitle: "Expenses summary",
        emptyMessage: "No expense records found.",
        totalLabel: "Total expenses",
        countLabel: "Paid records",
        averageLabel: "Average expense",
        loadErrorMessage: "Could not load expenses report",
        daySummaryErrorMessage: "Could not load expenses day summary",
        bootstrapChartKey: "expensesWeek",
        bootstrapCardKey: "expensesToday",
        getPeriod: getExpensesPeriod,
        getDay: getExpensesDay,
        getReport: getExpensesReport,
        getDaySummary: getExpensesDaySummary,
        mapChart: mapFinancePeriodRows,
        normalizeCard: normalizeExpensesCard,
        emptyCard: {
            total: 0,
            totalsub1: 0,
            totalsub2: 0,
            count: 0,
            average: 0,
            currencyCode: "PEN"
        },
        summaryLabels: {
            total: "Total Expenses",
            totalsub1: "Staff Expenses",
            totalsub2: "Orders Expenses",
            totalLabel: "Total Expenses",
            countLabel: "Staff Expenses",
            averageLabel: "Orders Expenses"
        }
    }
}

