import { BrowserRouter } from "react-router-dom"
import {
    Bounce,
    ToastContainer
} from "react-toastify"

import type { ReactNode } from "react"

type AppProvidersProps = {
    children: ReactNode
}

export function AppProviders({ children }: AppProvidersProps) {
    return (
        <BrowserRouter>
            {children}

            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick={false}
                rtl
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
                transition={Bounce}
            />
        </BrowserRouter>
    )
}
