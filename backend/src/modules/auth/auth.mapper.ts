import type { StoreSession, StoreSessionRow } from "../../types/store.types.js"

export function mapStoreSession(store: StoreSessionRow): StoreSession {
    return {
        id: store.id,
        name: store.name,
        email: store.email,
        phone: store.phone,
        currency_code: store.currency_code,
        currency_symbol: store.currency_symbol,
        image: store.image
    }
}