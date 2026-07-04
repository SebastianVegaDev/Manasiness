import bcrypt from "bcrypt"

import { badRequest, conflict, unauthorized } from "../../errors/http-errors.js"
import { sendPasswordResetEmail, sendVerificationEmail } from "../../shared/email/email.service.js"
import type { StoreSession } from "../../types/store.types.js"
import { mapStoreSession } from "./auth.mapper.js"
import {
    findEmailCode,
    findPasswordResetCode,
    findStoreByEmail,
    findStoreById,
    insertEmailCode,
    insertPasswordResetCode,
    insertStore,
    removeEmailCode,
    removePasswordResetCode,
    updateStorePasswordByEmail
} from "./auth.repository.js"
import { generateToken } from "./auth.utils.js"

type LoginData = {
    email: string
    password: string
}

type EmailData = {
    email: string
}

type CodeData = {
    email: string
    code: string
}

type RegisterData = {
    name: string
    email: string
    password: string
    phone: string | null
    image: string
    code: string
}

type ResetPasswordData = CodeData & {
    password: string
}

function generateEmailCode(): string {
    return String(Math.floor(100000 + Math.random() * 900000))
}

function getEmailCodeExpirationDate(): Date {
    return new Date(Date.now() + 10 * 60 * 1000)
}

async function validateEmailCode(data: CodeData): Promise<void> {
    const verification = await findEmailCode(data.email)

    if (!verification) {
        throw badRequest("Code invalid")
    }

    if (new Date(verification.expires_at).getTime() < Date.now()) {
        await removeEmailCode(data.email)
        throw badRequest("Code invalid")
    }

    const isCodeValid = await bcrypt.compare(data.code, verification.code_hash)

    if (!isCodeValid) {
        throw badRequest("Code invalid")
    }
}

async function validatePasswordResetCode(data: CodeData): Promise<void> {
    const verification = await findPasswordResetCode(data.email)

    if (!verification) {
        throw badRequest("Code invalid")
    }

    if (new Date(verification.expires_at).getTime() < Date.now()) {
        await removePasswordResetCode(data.email)
        throw badRequest("Code invalid")
    }

    const isCodeValid = await bcrypt.compare(data.code, verification.code_hash)

    if (!isCodeValid) {
        throw badRequest("Code invalid")
    }
}

export async function loginStore(data: LoginData): Promise<{ token: string; store: StoreSession }> {
    const store = await findStoreByEmail(data.email)

    if (!store) {
        throw unauthorized("Invalid credentials")
    }

    const isPasswordValid = await bcrypt.compare(data.password, store.password_hash)

    if (!isPasswordValid) {
        throw unauthorized("Invalid credentials")
    }

    return {
        token: generateToken(store),
        store: mapStoreSession(store)
    }
}

export async function sendRegisterCode(data: EmailData): Promise<void> {
    const existingStore = await findStoreByEmail(data.email)

    if (existingStore) {
        throw conflict("Register failed")
    }

    const code = generateEmailCode()
    const codeHash = await bcrypt.hash(code, 10)
    const expiresAt = getEmailCodeExpirationDate()

    await insertEmailCode({ email: data.email, codeHash, expiresAt })

    try {
        await sendVerificationEmail({ to: data.email, code })
    } catch (error) {
        await removeEmailCode(data.email)
        throw error
    }
}

export async function verifyRegisterCode(data: CodeData): Promise<void> {
    const existingStore = await findStoreByEmail(data.email)

    if (existingStore) {
        throw conflict("Register failed")
    }

    await validateEmailCode(data)
}

export async function registerStore(data: RegisterData): Promise<StoreSession> {
    const existingStore = await findStoreByEmail(data.email)

    if (existingStore) {
        throw conflict("Register failed")
    }

    await validateEmailCode({ email: data.email, code: data.code })

    const passwordHash = await bcrypt.hash(data.password, 10)

    const store = await insertStore({
        name: data.name,
        email: data.email,
        passwordHash,
        phone: data.phone,
        image: data.image
    })

    if (!store) {
        throw badRequest("Register failed")
    }

    await removeEmailCode(data.email)

    return mapStoreSession(store)
}

export async function getStoreSession(storeId: number): Promise<StoreSession> {
    const store = await findStoreById(storeId)

    if (!store) {
        throw unauthorized("Unauthorized")
    }

    return mapStoreSession(store)
}

export async function sendPasswordResetCode(data: EmailData): Promise<void> {
    const store = await findStoreByEmail(data.email)

    if (!store) {
        return
    }

    const code = generateEmailCode()
    const codeHash = await bcrypt.hash(code, 10)
    const expiresAt = getEmailCodeExpirationDate()

    await insertPasswordResetCode({ email: data.email, codeHash, expiresAt })

    try {
        await sendPasswordResetEmail({ to: data.email, code })
    } catch (error) {
        await removePasswordResetCode(data.email)
        throw error
    }
}

export async function verifyPasswordResetCode(data: CodeData): Promise<void> {
    const store = await findStoreByEmail(data.email)

    if (!store) {
        throw badRequest("Code invalid")
    }

    await validatePasswordResetCode(data)
}

export async function resetStorePassword(data: ResetPasswordData): Promise<StoreSession> {
    const store = await findStoreByEmail(data.email)

    if (!store) {
        throw badRequest("Code invalid")
    }

    await validatePasswordResetCode({ email: data.email, code: data.code })

    const isSamePassword = await bcrypt.compare(data.password, store.password_hash)

    if (isSamePassword) {
        throw conflict("Password unchanged")
    }

    const passwordHash = await bcrypt.hash(data.password, 10)

    const updatedStore = await updateStorePasswordByEmail({
        email: data.email,
        passwordHash
    })

    if (!updatedStore) {
        throw badRequest("Password reset failed")
    }

    await removePasswordResetCode(data.email)

    return mapStoreSession(updatedStore)
}