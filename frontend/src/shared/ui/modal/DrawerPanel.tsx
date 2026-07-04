import "./DrawerPanel.css"

import type { ReactNode } from "react"

type DrawerPanelProps = {
    children: ReactNode
    onClose: () => void
}

function DrawerPanel({ children, onClose }: DrawerPanelProps) {
    return (
        <div className="shared-drawer-panel-overlay" onClick={onClose}>
            <div className="shared-drawer-panel-content" onClick={(event) => event.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default DrawerPanel
