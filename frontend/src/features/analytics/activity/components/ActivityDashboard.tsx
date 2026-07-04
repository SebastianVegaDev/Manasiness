import "./ActivityDashboard.css"

import BasePageLayout from "@shared/ui/layouts/base/BasePageLayout"
import StatsLayout from "@shared/ui/layouts/stats/StatsLayout"
import ActivityCards from "./ActivityCards"
import ActivityCatalogPerformance from "./ActivityCatalogPerformance"
import ActivityToolbar from "./ActivityToolbar"

import type { ActivityDashboardProps } from "../shared/types/activity.types"

function ActivityDashboard({
    title,
    description,
    growthRate,
    dayPerformance,
    catalogPerformance,
    period,
    periodOptions,
    onPeriodChange,
    catalogOption,
    catalogOptions,
    onCatalogOptionChange,
    windowLabel,
    hasOlder,
    hasNewer,
    onOlder,
    onNewer,
    isLoading
}: ActivityDashboardProps) {
    return (
        <BasePageLayout
            className="activity-layout"
            isLoading={isLoading}
        >
            <StatsLayout
                className="activity-layout"
                titleClassName="activity-layout-title"
                contentClassName="activity-layout-content"
                title={title}
                description={description}
            >
                <div className="activity-content">
                    <ActivityToolbar
                        windowLabel={windowLabel}
                        period={period}
                        periodOptions={periodOptions}
                        onPeriodChange={onPeriodChange}
                        hasOlder={hasOlder}
                        hasNewer={hasNewer}
                        onOlder={onOlder}
                        onNewer={onNewer}
                    />

                    <ActivityCards
                        growthRate={growthRate}
                        dayPerformance={dayPerformance}
                    />

                    <ActivityCatalogPerformance
                        catalogPerformance={catalogPerformance}
                        catalogOption={catalogOption}
                        catalogOptions={catalogOptions}
                        onCatalogOptionChange={onCatalogOptionChange}
                    />
                </div>
            </StatsLayout>
        </BasePageLayout>
    )
}

export default ActivityDashboard
