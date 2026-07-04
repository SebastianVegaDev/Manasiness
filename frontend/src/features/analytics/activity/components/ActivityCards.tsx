import "./ActivityCards.css"

import type {
    ActivityDayPerformance,
    ActivityGrowthRate
} from "../shared/types/activity.types"

type ActivityCardsProps = {
    growthRate: ActivityGrowthRate | null
    dayPerformance: ActivityDayPerformance | null
}

function ActivityCards({
    growthRate,
    dayPerformance
}: ActivityCardsProps) {
    const hasGrowthData = Boolean(growthRate?.date)
    const hasDayData = Boolean(dayPerformance?.bestDayDate || dayPerformance?.worstDayDate)

    return (
        <div className="activity-content-cards">
            <div className="activity-content-card">
                <div className="activity-content-card-title">
                    <h1>Growth Rate</h1>
                </div>

                <div className="activity-content-card-content">
                    {hasGrowthData ? (
                        <div>
                            <h2 className="activity-content-card-percentage">
                                {growthRate?.growthRate ?? 0} %
                            </h2>
                            <p>{growthRate?.summary ?? "No previous paid sales to compare."}</p>
                        </div>
                    ) : (
                        <div className="activity-content-card-empty">
                            <span>No comparison yet</span>
                            <p>Paid sales for this period will show growth here.</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="activity-content-card">
                <div className="activity-content-card-title">
                    <h1>Day Performance</h1>
                </div>

                <div className="activity-content-card-content">
                    {hasDayData ? (
                        <>
                            <div>
                                <h3>Best Day</h3>
                                <h2>{dayPerformance?.bestDay ?? "No data"}</h2>
                                <p>{dayPerformance?.bestDayDate ?? ""}</p>
                                <p>Total: {dayPerformance?.bestDayTotalLabel ?? "$0.00"}</p>
                            </div>

                            <div>
                                <h3>Worst Day</h3>
                                <h2>{dayPerformance?.worstDay ?? "No data"}</h2>
                                <p>{dayPerformance?.worstDayDate ?? ""}</p>
                                <p>Total: {dayPerformance?.worstDayTotalLabel ?? "$0.00"}</p>
                            </div>
                        </>
                    ) : (
                        <div className="activity-content-card-empty">
                            <span>No days yet</span>
                            <p>Once sales are paid, best and worst days will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ActivityCards
