function parseDateValue(date: string | null | undefined): Date | null {
    if (!date) {
        return null
    }

    const normalizedDate = /^\d{4}-\d{2}-\d{2}$/.test(date)
        ? `${date}T00:00:00`
        : date

    const parsedDate = new Date(normalizedDate)

    return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

function formatDayLabel(date: string | null | undefined): string {
    const parsedDate = parseDateValue(date)

    if (!parsedDate) {
        return ""
    }

    const day = String(parsedDate.getDate()).padStart(2, "0")
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0")
    const year = parsedDate.getFullYear()

    return `${day}/${month}/${year}`
}

export function createMovementWindowLabel(
    startDate: string | null | undefined,
    endDate: string | null | undefined
): string {
    if (!startDate && !endDate) {
        return ""
    }

    if (startDate && !endDate) {
        return formatDayLabel(startDate)
    }

    if (!startDate && endDate) {
        return formatDayLabel(endDate)
    }

    if (startDate === endDate) {
        return formatDayLabel(startDate)
    }

    return `${formatDayLabel(startDate)} - ${formatDayLabel(endDate)}`
}

