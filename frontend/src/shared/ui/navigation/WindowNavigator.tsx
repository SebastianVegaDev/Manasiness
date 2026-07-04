import "./WindowNavigator.css"

import {
    ChevronLeft,
    ChevronRight
} from "lucide-react"

type WindowNavigatorProps = {
    label?: string | undefined
    emptyLabel?: string | undefined
    hasOlder?: boolean | undefined
    hasNewer?: boolean | undefined
    onOlder?: (() => void) | undefined
    onNewer?: (() => void) | undefined
    hasPrevious?: boolean | undefined
    hasNext?: boolean | undefined
    onPrevious?: (() => void) | undefined
    onNext?: (() => void) | undefined
    className?: string | undefined
}

function WindowNavigator({
    label = "",
    emptyLabel = "Current window",
    hasOlder,
    hasNewer,
    onOlder,
    onNewer,
    hasPrevious,
    hasNext,
    onPrevious,
    onNext,
    className = "shared-window-navigator"
}: WindowNavigatorProps) {
    const canGoOlder = hasOlder ?? hasPrevious ?? false
    const canGoNewer = hasNewer ?? hasNext ?? false
    const handleOlder = onOlder ?? onPrevious
    const handleNewer = onNewer ?? onNext

    return (
        <div className={className}>
            <button
                type="button"
                onClick={handleOlder}
                disabled={!canGoOlder || !handleOlder}
                aria-label="Older window"
            >
                <ChevronLeft size={18} />
            </button>

            <span>{label || emptyLabel}</span>

            <button
                type="button"
                onClick={handleNewer}
                disabled={!canGoNewer || !handleNewer}
                aria-label="Newer window"
            >
                <ChevronRight size={18} />
            </button>
        </div>
    )
}

export default WindowNavigator
