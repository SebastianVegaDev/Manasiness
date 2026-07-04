import "./FinancialToolbar.css"

import { StepBack, StepForward } from "lucide-react"

import type { FinancialReportPeriodChangeEvent } from "@shared/types/financialReportScreen.types"

type FinancialToolbarProps = {
    period: string
    onPeriodChange: (event: FinancialReportPeriodChangeEvent) => void
    periodOffset: number
    onPeriodOffsetChange: (offset: number) => void
    hasOlder?: boolean
    startDate?: string
    endDate?: string
}

function FinancialToolbar({ period, onPeriodChange, periodOffset, onPeriodOffsetChange, hasOlder = true, startDate = "", endDate = "" }: FinancialToolbarProps) {
    return (
        <div className="shared-financial-toolbar">
            <div className="shared-financial-toolbar-side">
                <div className="shared-financial-toolbar-filters">
                    <label className="shared-financial-toolbar-filter">
                        <span>Range</span>
                        <select value={period} onChange={onPeriodChange}>
                            <option value="week">Week</option>
                            <option value="month">Month</option>
                        </select>
                    </label>
                </div>
            </div>
            <div className="shared-financial-toolbar-center">
                <div className="shared-financial-window">
                    <button type="button" onClick={() => onPeriodOffsetChange(periodOffset + 1)} disabled={!hasOlder}><StepBack /></button>
                    <p>{startDate && endDate ? `${startDate} to ${endDate}` : `Offset ${periodOffset}`}</p>
                    <button type="button" onClick={() => onPeriodOffsetChange(periodOffset - 1)} disabled={periodOffset === 0}><StepForward /></button>
                </div>
            </div>
            <div className="shared-financial-toolbar-side" />
        </div>
    )
}

export default FinancialToolbar
