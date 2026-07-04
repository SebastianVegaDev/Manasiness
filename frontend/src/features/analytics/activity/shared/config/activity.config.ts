import type { ActivityPageConfig } from "../types/activity.types"

export const ACTIVITY_PAGE_CONFIG: ActivityPageConfig = {
    title: "Activity",
    description: "On this page, you can view your activity in a more organized and straightforward way.",
    initialPeriod: "week",
    initialCatalogOption: "topSold",
    initialOffset: 0,
    periodOptions: [
        { value: "week", label: "Week" },
        { value: "month", label: "Month" }
    ],
    catalogOptions: [
        { value: "topSold", label: "Top Sold" },
        { value: "leastSold", label: "Least Sold" }
    ]
}
