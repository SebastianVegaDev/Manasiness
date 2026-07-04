import "./DesktopOnlyGuard.css"

import {
    useEffect,
    useState
} from "react"

import type { ReactNode } from "react"

type DesktopOnlyGuardProps = {
    children: ReactNode
}

type NavigatorWithUserAgentData = Navigator & {
    userAgentData?: {
        mobile?: boolean
    }
}

function isBlockedDevice(): boolean {
    const smallScreen = window.innerWidth < 1615
    const mobileUserAgent = /Android|iPhone|iPad|iPod|Mobile|Tablet/i.test(navigator.userAgent)
    const userAgentData = (navigator as NavigatorWithUserAgentData).userAgentData
    const mobileClientHint = userAgentData?.mobile === true
    const touchOnly = window.matchMedia("(hover: none) and (pointer: coarse)").matches

    return smallScreen || mobileUserAgent || mobileClientHint || touchOnly
}

function DesktopOnlyGuard({ children }: DesktopOnlyGuardProps) {
    const [isBlocked, setIsBlocked] = useState<boolean>(() => isBlockedDevice())

    useEffect(() => {
        function checkDevice(): void {
            setIsBlocked(isBlockedDevice())
        }

        window.addEventListener("resize", checkDevice)

        return () => {
            window.removeEventListener("resize", checkDevice)
        }
    }, [])

    if (isBlocked) {
        return (
            <main className="desktop-only">
                <section className="desktop-only-card">
                    <h1>Manasiness</h1>
                    <h2>Desktop version only</h2>
                    <p>This first version is made for computers and laptops.</p>
                    <p>The mobile version will come later with voice support.</p>
                </section>
            </main>
        )
    }

    return children
}

export default DesktopOnlyGuard
