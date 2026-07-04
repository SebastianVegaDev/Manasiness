import type { FormValues } from "@shared/types/form.types"
import type {
    ProductMovementPayload,
    StaffMovementPayload
} from "../types/movement.types"

function toNumber(value: unknown): number {
    const numericValue = Number(value ?? 0)
    return Number.isFinite(numericValue) ? numericValue : 0
}

export function mapProductMovementPayload(formData: FormValues): ProductMovementPayload {
    return {
        product_id: toNumber(formData.product_id),
        user_id: toNumber(formData.user_id),
        quantity: toNumber(formData.quantity),
        state: String(formData.state ?? "")
    }
}

export function mapStaffMovementPayload(formData: FormValues): StaffMovementPayload {
    return {
        user_id: toNumber(formData.user_id),
        salary: toNumber(formData.salary),
        state: String(formData.state ?? "")
    }
}

