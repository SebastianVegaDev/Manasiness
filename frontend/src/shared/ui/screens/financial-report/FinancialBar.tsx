import "./FinancialBar.css"

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import { formatCurrency } from "@shared/utils/currency"

import type { FinancialChartPoint } from "@shared/types/financialReportScreen.types"
import type { CurrencyCode } from "@shared/types/common.types"

type FinancialBarProps = {
    data?: FinancialChartPoint[]
    onDateSelect?: ((date: string) => void) | undefined
    currencyCode?: CurrencyCode | string
    emptyMessage?: string | undefined
}

function getBarColor(value: number) {
    const safeValue = Math.max(-100, Math.min(100, value))
    const hue = ((safeValue + 100) / 200) * 120
    return `hsl(${hue}, 80%, 45%)`
}

function FinancialBar({ data = [], onDateSelect, currencyCode = "PEN", emptyMessage = "No chart data found for this range." }: FinancialBarProps) {
    const infoBar = Array.isArray(data)
        ? data.map((item) => ({ ...item, name: item.name ?? item.label, day: item.day ?? item.date }))
        : []

    if (!infoBar.length) {
        return (
            <div className="shared-financial-bar shared-financial-bar-empty">
                <span className="shared-financial-bar-empty-kicker">No movement yet</span>
                <h3>{emptyMessage}</h3>
                <p>When you register records for this range, the chart will show totals by day here.</p>
            </div>
        )
    }

    return (
        <div className="shared-financial-bar">
            <ResponsiveContainer width="100%" height={320}>
                <BarChart data={infoBar}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => formatCurrency(Number(value), currencyCode)} />
                    <Tooltip formatter={(value) => formatCurrency(Number(value), currencyCode)} />
                    <Bar dataKey="total" radius={[10, 10, 0, 0]}>
                        {infoBar.map((item, index) => (
                            <Cell key={index} fill={getBarColor(Number(item.total ?? 0))} onClick={() => onDateSelect?.(String(item.day ?? item.date))} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default FinancialBar
