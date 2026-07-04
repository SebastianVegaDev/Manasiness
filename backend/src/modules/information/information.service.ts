import { conflict, unauthorized } from "../../errors/http-errors.js"
import { getCurrencySymbol, type CurrencyCode } from "../../shared/validators/index.js"
import type { StoreInformation } from "../../types/store.types.js"
import { findStoreByEmail, findStoreById, findStoreByPhone } from "../auth/auth.repository.js"
import { mapStoreInformation } from "./information.mapper.js"
import { findInformationStore, updateInformationStore } from "./information.repository.js"

type StoreScopedData = {
    storeId: number
}

type EditInformationData = StoreScopedData & {
    name: string
    email: string
    phone: string | null
    currency_code: CurrencyCode
    image: string
}

export async function getInformationStore(data: StoreScopedData): Promise<StoreInformation> {
    const store = await findInformationStore({ storeId: data.storeId })

    if (!store) {
        throw unauthorized("Unauthorized")
    }

    return mapStoreInformation(store)
}

export async function editInformationStore(data: EditInformationData): Promise<StoreInformation> {
    const currentStore = await findStoreById(data.storeId)

    if (!currentStore) {
        throw unauthorized("Unauthorized")
    }

    const existingStoreByEmail = await findStoreByEmail(data.email)

    if (existingStoreByEmail && existingStoreByEmail.id !== data.storeId) {
        throw conflict("Email unavailable")
    }

    if (data.phone) {
        const existingStoreByPhone = await findStoreByPhone(data.phone)

        if (existingStoreByPhone && existingStoreByPhone.id !== data.storeId) {
            throw conflict("Phone unavailable")
        }
    }

    const information = await updateInformationStore({
        storeId: data.storeId,
        name: data.name,
        email: data.email,
        phone: data.phone,
        currency_code: data.currency_code,
        currency_symbol: getCurrencySymbol(data.currency_code),
        cleanImage: data.image
    })

    if (!information) {
        throw unauthorized("Unauthorized")
    }

    return mapStoreInformation(information)
}