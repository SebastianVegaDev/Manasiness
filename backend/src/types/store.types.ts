export type StoreSession = {
    id: number
    name: string
    email: string
    phone: string | null
    currency_code: string
    currency_symbol: string
    image: string | null
}

export type StoreSessionRow = StoreSession

export type AuthStoreRow = StoreSessionRow & {
    password_hash: string
}

export type EmailCodeRow = {
    email: string
    code_hash: string
    expires_at: Date
}

export type StoreInformation = {
    name: string
    email: string
    phone: string | null
    currency_code: string
    currency_symbol: string
    image: string | null
}