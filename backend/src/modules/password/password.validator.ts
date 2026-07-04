import {
    requireLoginPassword,
    requireObject,
    requirePassword,
    requirePasswordMatch
} from "../../shared/validators/index.js"

export function validateEditPasswordPayload(body: unknown) {
    const data = requireObject(body)

    const currentPassword = requireLoginPassword(data.currentPassword, "currentPassword")
    const newPassword = requirePassword(data.newPassword, "newPassword")
    const repeatPassword = requirePassword(data.repeatPassword, "repeatPassword")

    requirePasswordMatch(newPassword, repeatPassword, "newPassword")

    return {
        currentPassword,
        newPassword
    }
}