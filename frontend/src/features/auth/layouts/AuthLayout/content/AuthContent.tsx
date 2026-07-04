import "./AuthContent.css"

import type { ReactNode } from "react"

type AuthContentProps = {
    children: ReactNode
}

function AuthContent({ children }: AuthContentProps) {
    return (
        <div id="shared-auth-content">
            {children}
        </div>
    )
}

export default AuthContent
