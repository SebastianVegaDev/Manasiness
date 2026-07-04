import StatsTitle from "../../titles/stats/StatsTitle"

import type { ReactNode } from "react"

type StatsLayoutProps = {
    className?: string
    titleClassName?: string
    contentClassName?: string
    toolbarClassName?: string
    title: string
    description?: string
    toolbar?: ReactNode
    toolbarPosition?: "before-content" | "after-content"
    children: ReactNode
}

function StatsLayout({
    className = "",
    titleClassName = "",
    contentClassName = "",
    toolbarClassName = "",
    title,
    description = "",
    toolbar = null,
    toolbarPosition = "before-content",
    children
}: StatsLayoutProps) {
    return (
        <div className={className}>
            <div className={titleClassName}>
                <StatsTitle
                    title={title}
                    description={description}
                />
            </div>

            {toolbar && toolbarPosition === "before-content" ? (
                <div className={toolbarClassName}>{toolbar}</div>
            ) : null}

            <div className={contentClassName}>
                {children}
            </div>

            {toolbar && toolbarPosition === "after-content" ? (
                <div className={toolbarClassName}>{toolbar}</div>
            ) : null}
        </div>
    )
}

export default StatsLayout
