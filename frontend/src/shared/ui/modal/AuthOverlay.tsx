import "./AuthOverlay.css"

import type { ReactNode } from "react"

type AuthOverlayProps = {
    children: ReactNode
}

function AuthOverlay({ children }: AuthOverlayProps) {
    return (
        <div id="shared-auth-overlay">
            {children}
        </div>
    )
}

export default AuthOverlay
