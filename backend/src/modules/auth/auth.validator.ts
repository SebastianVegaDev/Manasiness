import {
    parseOptionalImage,
    parseOptionalPhone,
    requireEmail,
    requireLoginPassword,
    requireObject,
    requirePassword,
    requirePasswordMatch,
    requireText,
    requireVerificationCode
} from "../../shared/validators/index.js"

export function validateLoginPayload(body: unknown) {
    const data = requireObject(body)

    return {
        email: requireEmail(data.email),
        password: requireLoginPassword(data.password)
    }
}

export function validateEmailPayload(body: unknown) {
    const data = requireObject(body)

    return {
        email: requireEmail(data.email)
    }
}

export function validateEmailCodePayload(body: unknown) {
    const data = requireObject(body)

    return {
        email: requireEmail(data.email),
        code: requireVerificationCode(data.code, "code")
    }
}

export function validateRegisterPayload(body: unknown) {
    const data = requireObject(body)

    const password = requirePassword(data.password)
    const repeatPassword = requirePassword(data.repassword, "repassword")

    requirePasswordMatch(password, repeatPassword, "password")

    return {
        name: requireText(data.name, "name"),
        email: requireEmail(data.email),
        password,
        phone: parseOptionalPhone(data.phone, "phone"),
        image: parseOptionalImage(data.image, "image"),
        code: requireVerificationCode(data.code, "code")
    }
}

export function validateResetPasswordPayload(body: unknown) {
    const data = requireObject(body)

    const password = requirePassword(data.password)
    const repeatPassword = requirePassword(data.repassword, "repassword")

    requirePasswordMatch(password, repeatPassword, "password")

    return {
        email: requireEmail(data.email),
        code: requireVerificationCode(data.code, "code"),
        password
    }
}