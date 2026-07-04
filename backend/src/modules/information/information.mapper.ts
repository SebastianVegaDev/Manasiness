import type { StoreInformation } from "../../types/store.types.js"

export function mapStoreInformation(row: StoreInformation): StoreInformation {
    return {
        name: row.name,
        email: row.email,
        phone: row.phone,
        currency_code: row.currency_code,
        currency_symbol: row.currency_symbol,
        image: row.image
    }
}