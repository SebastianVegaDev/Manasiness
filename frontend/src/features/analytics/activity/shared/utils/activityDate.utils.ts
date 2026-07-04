export function formatActivityDate(date: string | null | undefined): string {
    if (!date) {
        return ""
    }

    return new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    })
}

export function getEnglishDay(date: string | null | undefined): string {
    if (!date) {
        return ""
    }

    return new Date(`${String(date).slice(0, 10)}T00:00:00`).toLocaleDateString("en-US", {
        weekday: "long"
    })
}

export function createActivityRangeLabel(
    startDate: string | null | undefined,
    endDate: string | null | undefined
): string {
    const formattedStartDate = formatActivityDate(startDate)
    const formattedEndDate = formatActivityDate(endDate)

    if (!formattedStartDate && !formattedEndDate) {
        return ""
    }

    if (formattedStartDate && !formattedEndDate) {
        return formattedStartDate
    }

    if (!formattedStartDate && formattedEndDate) {
        return formattedEndDate
    }

    if (formattedStartDate === formattedEndDate) {
        return formattedStartDate
    }

    return `${formattedStartDate} - ${formattedEndDate}`
}
