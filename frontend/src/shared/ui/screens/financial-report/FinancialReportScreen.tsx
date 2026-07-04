import "./FinancialReportScreen.css"

import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"
import StatsLayout from "@shared/ui/layouts/stats/StatsLayout"
import FinancialBar from "./FinancialBar"
import FinancialCard from "./FinancialCard"
import FinancialToolbar from "./FinancialToolbar"

import type { FinancialReportScreenProps } from "@shared/types/financialReportScreen.types"

function FinancialReportScreen(props: FinancialReportScreenProps) {
    const chartData = props.chartData ?? props.infoBar ?? []
    const summaryCard = props.summaryCard ?? props.infoCard ?? { total: 0, count: 0, average: 0 }
    const summaryLabels = props.summaryLabels ?? props.titlesCard ?? { totalLabel: "Total", countLabel: "Records", averageLabel: "Average" }
    const periodOffset = props.periodOffset ?? props.offset ?? 0
    const onPeriodOffsetChange = props.onPeriodOffsetChange ?? props.setOffset ?? (() => {})
    const onChartDateSelect = props.onChartDateSelect ?? props.setDate ?? (() => {})
    const isLoading = Boolean(props.isLoadingChart ?? props.isLoadingBar ?? props.isLoadingSummary ?? props.isLoadingCard)

    const toolbar = (
        <FinancialToolbar
            period={String(props.period ?? "week")}
            onPeriodChange={props.onPeriodChange ?? (() => {})}
            periodOffset={periodOffset}
            onPeriodOffsetChange={onPeriodOffsetChange}
        />
    )

    return (
        <StatsLayout
            className="shared-financial-layout"
            titleClassName="shared-financial-layout-title"
            contentClassName="shared-financial-layout-content"
            toolbarClassName="shared-financial-layout-toolbar"
            title={props.title}
            description={props.subtitle ?? ""}
            toolbar={toolbar}
            toolbarPosition="after-content"
        >
            <div className="shared-financial-content-card">
                <FinancialCard summary={summaryCard} labels={summaryLabels} currencyCode={props.currencyCode ?? "PEN"} />
            </div>
            <div className="shared-financial-layout-bar">
                <FinancialBar data={chartData} onDateSelect={onChartDateSelect} currencyCode={props.currencyCode ?? "PEN"} emptyMessage={props.emptyMessage} />
            </div>
            {isLoading ? <LoadingOverlay /> : null}
        </StatsLayout>
    )
}

export default FinancialReportScreen
