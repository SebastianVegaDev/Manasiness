export const BOOTSTRAP_CATALOG_FILTER = {
    search: "",
    status: "all"
} as const

export const BOOTSTRAP_PEOPLE_FILTER = {
    search: "",
    status: "all"
} as const

export const BOOTSTRAP_HISTORY_WINDOW = {
    page: 1,
    sort: "recent",
    period: "day",
    limit: 10,
    dayOffset: 0,
    rowOffset: 0,
    orderDirection: "DESC"
} as const

export const BOOTSTRAP_PERIOD_WINDOW = {
    offset: 0,
    period: "week"
} as const

export const BOOTSTRAP_ACTIVITY_WEEK = {
    offset: 0,
    activityDateFilter: "week"
} as const

export const BOOTSTRAP_TOP_SOLD_CATALOG = {
    offset: 0,
    activityDateFilter: "week",
    catalogOption: "topSold"
} as const

export const BOOTSTRAP_LEAST_SOLD_CATALOG = {
    offset: 0,
    activityDateFilter: "week",
    catalogOption: "leastSold"
} as const