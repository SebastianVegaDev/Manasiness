import "./FinancialCard.css"

import { formatCurrency } from "@shared/utils/currency"

import type { FinancialSummaryCard, FinancialSummaryLabels } from "@shared/types/financialReportScreen.types"
import type { CurrencyCode } from "@shared/types/common.types"

type FinancialCardProps = {
    summary?: FinancialSummaryCard
    labels?: FinancialSummaryLabels
    currencyCode?: CurrencyCode | string
    isLoading?: boolean
}

function FinancialCard({ summary, labels, isLoading = false, currencyCode = "PEN" }: FinancialCardProps) {
    if (isLoading) {
        return <div className="shared-financial-content-cards">Loading summary...</div>
    }

    const infoCard = summary ?? { total: 0, count: 0, average: 0 }
    const titlesCard = labels ?? { totalLabel: "Total", countLabel: "Records", averageLabel: "Average" }
    const sub1 = infoCard.totalsub1 ?? infoCard.count ?? 0
    const sub2 = infoCard.totalsub2 ?? infoCard.average ?? 0

    return (
        <div className="shared-financial-content-cards">
            <div className="shared-financial-card">
                <h3>{titlesCard.total ?? titlesCard.totalLabel}</h3>
                <h2 className="shared-financial-card-number">{formatCurrency(infoCard.total, currencyCode)}</h2>
            </div>
            <div className="shared-financial-card">
                <h3>{titlesCard.totalsub1 ?? titlesCard.countLabel}</h3>
                <h4 className="shared-financial-card-number">{formatCurrency(sub1, currencyCode)}</h4>
                <h3>{titlesCard.totalsub2 ?? titlesCard.averageLabel}</h3>
                <h4 className="shared-financial-card-number">{formatCurrency(sub2, currencyCode)}</h4>
            </div>
        </div>
    )
}

export default FinancialCard
