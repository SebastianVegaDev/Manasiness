import {
    getIncomeDaySummary,
    getIncomeReport
} from "@features/finance/shared/api/finance.api"
import { FINANCE_REPORT_CONFIG } from "@features/finance/shared/config/financeReports.config"
import { useFinancialReportPage } from "@features/finance/shared/hooks/useFinancialReportPage"
import FinancialReportScreen from "@shared/ui/screens/financial-report/FinancialReportScreen"

function IncomePage() {
    const config = FINANCE_REPORT_CONFIG.income

    const report = useFinancialReportPage({
        config,
        getReport: getIncomeReport,
        getDaySummary: getIncomeDaySummary
    })

    return (
        <FinancialReportScreen
            title={config.title}
            subtitle={config.subtitle}
            chartTitle={config.chartTitle}
            summaryTitle={config.summaryTitle}
            emptyMessage={config.emptyMessage}
            period={report.period}
            onPeriodChange={report.onPeriodChange}
            periodOffset={report.periodOffset}
            onPeriodOffsetChange={report.onPeriodOffsetChange}
            selectedDate={report.selectedDate}
            onChartDateSelect={report.onChartDateSelect}
            chartData={report.chartData}
            summaryCard={report.summaryCard}
            summaryLabels={report.summaryLabels}
            currencyCode={report.currencyCode}
            isLoadingChart={report.isLoadingChart}
            isLoadingSummary={report.isLoadingSummary}
        />
    )
}

export default IncomePage
