import ActivityDashboard from "../components/ActivityDashboard"
import { useActivityPage } from "../shared/hooks/useActivityPage"

function ActivityPage() {
    const activity = useActivityPage()

    return (
        <ActivityDashboard
            title={activity.title}
            description={activity.description}
            growthRate={activity.growthRate}
            dayPerformance={activity.dayPerformance}
            catalogPerformance={activity.catalogPerformance}
            period={activity.period}
            periodOptions={activity.periodOptions}
            onPeriodChange={activity.handlePeriodChange}
            catalogOption={activity.catalogOption}
            catalogOptions={activity.catalogOptions}
            onCatalogOptionChange={activity.handleCatalogOptionChange}
            windowLabel={activity.growthRate?.date ?? ""}
            hasOlder={activity.hasOlder}
            hasNewer={activity.hasNewer}
            onOlder={activity.handleOlder}
            onNewer={activity.handleNewer}
            isLoading={activity.isLoading}
        />
    )
}

export default ActivityPage
