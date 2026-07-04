import "./BasePageLayout.css"

import LoadingOverlay from "@shared/ui/modal/LoadingOverlay"

import type { ReactNode } from "react"

type BasePageLayoutProps = {
    children?: ReactNode
    header?: ReactNode
    toolbar?: ReactNode
    className?: string
    isLoading?: boolean
}

function BasePageLayout({
    children,
    header,
    toolbar,
    className = "",
    isLoading = false
}: BasePageLayoutProps) {
    return (
        <div className={className || "shared-base-page-layout"}>
            {header}
            {toolbar}
            {children}
            {isLoading ? <LoadingOverlay /> : null}
        </div>
    )
}

export default BasePageLayout
