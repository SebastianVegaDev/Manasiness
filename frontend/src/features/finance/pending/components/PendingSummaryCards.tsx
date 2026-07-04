import { formatCurrency } from "@shared/utils/currency"

import type {
    PendingScope,
    PendingSummary
} from "@features/finance/shared/types/finance.types"
import type { CurrencyCode } from "@shared/types/common.types"

type PendingSummaryCardsProps = {
    summary: PendingSummary
    currencyCode: CurrencyCode | string
}

type SummaryCardItem = {
    key: "global" | PendingScope
    label: string
}

const SUMMARY_ITEMS: SummaryCardItem[] = [
    { key: "global", label: "Global" },
    { key: "sales", label: "Sales" },
    { key: "orders", label: "Orders" },
    { key: "staff", label: "Staff" }
]

function PendingSummaryCards({
    summary,
    currencyCode
}: PendingSummaryCardsProps) {
    return (
        <section className="pending-summary-cards">
            {SUMMARY_ITEMS.map((item) => {
                const scopeSummary = summary[item.key] ?? { count: 0, total: 0 }

                return (
                    <article className="pending-summary-card" key={item.key}>
                        <span>{item.label}</span>

                        <strong>
                            {formatCurrency(scopeSummary.total, currencyCode)}
                        </strong>

                        <small>
                            {scopeSummary.count} pending
                        </small>
                    </article>
                )
            })}
        </section>
    )
}

export default PendingSummaryCards
