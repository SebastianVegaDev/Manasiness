import "./ModalOverlay.css"

import type { ReactNode } from "react"

type ModalOverlayProps = {
    children: ReactNode
    onClose: () => void
}

function ModalOverlay({ children, onClose }: ModalOverlayProps) {
    return (
        <div className="shared-modal-overlay" onClick={onClose}>
            <div className="shared-modal-content" onClick={(event) => event.stopPropagation()}>
                {children}
            </div>
        </div>
    )
}

export default ModalOverlay
