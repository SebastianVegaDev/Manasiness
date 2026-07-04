import type {
    BootstrapData,
    BootstrapOption
} from "../../shared/types/bootstrap.types"
import type { EntityId } from "@shared/types/common.types"

export type BootstrapRecord = {
    id?: EntityId
    _id?: EntityId
    name?: string
    image?: string | null
    role?: string
    status?: string
    is_active?: boolean
    isActive?: boolean
    disabled?: boolean
    disabledLabel?: string
}

export function toArray<T>(value: T[] | null | undefined): T[] {
    return Array.isArray(value) ? value : []
}

export function isSameId(left: EntityId | null | undefined, right: EntityId | null | undefined): boolean {
    if (left === null || left === undefined || right === null || right === undefined) {
        return false
    }

    return String(left) === String(right)
}

export function getRecordId(record: BootstrapRecord | null | undefined): EntityId | null {
    return record?.id ?? record?._id ?? null
}

export function hasRecordById<T extends BootstrapRecord>(
    list: T[] | null | undefined,
    id: EntityId | null | undefined
): boolean {
    return toArray(list).some((item) => isSameId(getRecordId(item), id))
}

export function isActiveRecord(record: BootstrapRecord | null | undefined): boolean {
    if (!record) {
        return false
    }

    if (typeof record.is_active === "boolean") {
        return record.is_active
    }

    if (typeof record.isActive === "boolean") {
        return record.isActive
    }

    if (typeof record.status === "string") {
        return record.status.toLowerCase() === "active"
    }

    return true
}

export function upsertById<T extends BootstrapRecord>(
    list: T[] | null | undefined,
    item: T
): T[] {
    const safeList = toArray(list)
    const itemId = getRecordId(item)

    if (!itemId) {
        return safeList
    }

    const exists = safeList.some((currentItem) => {
        return isSameId(getRecordId(currentItem), itemId)
    })

    if (!exists) {
        return [item, ...safeList]
    }

    return safeList.map((currentItem) => {
        if (!isSameId(getRecordId(currentItem), itemId)) {
            return currentItem
        }

        return {
            ...currentItem,
            ...item
        }
    })
}

export function removeById<T extends BootstrapRecord>(
    list: T[] | null | undefined,
    id: EntityId | null | undefined
): T[] {
    return toArray(list).filter((item) => {
        return !isSameId(getRecordId(item), id)
    })
}

export function limitList<T>(list: T[] | null | undefined, limit = 10): T[] {
    return toArray(list).slice(0, limit)
}

export function toOption(record: BootstrapRecord | null | undefined): BootstrapOption | null {
    const id = getRecordId(record)

    if (!record || !id) {
        return null
    }

    const option: BootstrapOption = {
        id,
        name: record.name ?? ""
    }

    if (record.image !== undefined) option.image = record.image
    if (record.role !== undefined) option.role = record.role
    if (record.status !== undefined) option.status = record.status
    if (record.is_active !== undefined) option.is_active = record.is_active
    if (record.isActive !== undefined) option.isActive = record.isActive
    if (record.disabled !== undefined) option.disabled = record.disabled
    if (record.disabledLabel !== undefined) option.disabledLabel = record.disabledLabel

    return option
}

export function upsertActiveOption(
    list: BootstrapOption[] | null | undefined,
    record: BootstrapRecord
): BootstrapOption[] {
    const option = toOption(record)

    if (!option) {
        return toArray(list)
    }

    if (!isActiveRecord(record)) {
        return removeById(list, getRecordId(record))
    }

    return upsertById(list, option)
}

export function safeBootstrapData(currentData: BootstrapData | null | undefined): BootstrapData {
    return currentData ?? {}
}





