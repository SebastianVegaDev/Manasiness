import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import App from "./App"
import { AuthProvider } from "./features/auth/context/AuthContext"

import "../index.css"

const rootElement = document.getElementById("root")

if (!rootElement) {
    throw new Error("Root element #root was not found.")
}

createRoot(rootElement).render(
    <StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </StrictMode>
)
