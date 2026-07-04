import type { StoreSession } from "./store.types.js"

export type BootstrapPayload = {
    meta: {
        generated_at: string
    }
    session: {
        store: StoreSession
    }
    options: Record<string, unknown>
    catalog: Record<string, unknown>
    people: Record<string, unknown>
    dashboard: Record<string, unknown>
    pending: Record<string, unknown>
    charts: Record<string, unknown>
    initialWindows: Record<string, unknown>
    activity: Record<string, unknown>
}