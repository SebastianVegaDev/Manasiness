import bcrypt from "bcrypt"

import { conflict, unauthorized } from "../../errors/http-errors.js"
import { findPasswordById, updatePassword } from "./password.repository.js"

type EditAccountPasswordData = {
    storeId: number
    currentPassword: string
    newPassword: string
}

export async function editAccountPassword(data: EditAccountPasswordData): Promise<void> {
    const store = await findPasswordById({ storeId: data.storeId })

    if (!store) {
        throw unauthorized("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(data.currentPassword, store.password_hash)

    if (!isPasswordValid) {
        throw unauthorized("Invalid credentials")
    }

    const isSamePassword = await bcrypt.compare(data.newPassword, store.password_hash)

    if (isSamePassword) {
        throw conflict("Password unchanged")
    }

    const passwordHash = await bcrypt.hash(data.newPassword, 10)

    await updatePassword({
        storeId: data.storeId,
        passwordHash
    })
}