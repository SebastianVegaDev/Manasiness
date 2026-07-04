import {
    removeById,
    safeBootstrapData,
    upsertActiveOption,
    upsertById
} from "./shared/bootstrapUpdater.utils"

import type {
    BootstrapData,
    BootstrapOptions,
    BootstrapPeople,
    BootstrapUser
} from "../shared/types/bootstrap.types"
import type { EntityId, UserRole } from "@shared/types/common.types"

type RoleCollection = "customers" | "suppliers" | "workers"

const ROLE_COLLECTION: Partial<Record<UserRole | string, RoleCollection>> = {
    customer: "customers",
    supplier: "suppliers",
    worker: "workers"
}

function getRoleCollection(role: string | undefined): RoleCollection | null {
    return role ? ROLE_COLLECTION[role] ?? null : null
}

function removeUserFromRoleCollections(
    people: BootstrapPeople | undefined,
    userId: EntityId
): BootstrapPeople {
    return {
        ...people,
        customers: removeById(people?.customers, userId),
        suppliers: removeById(people?.suppliers, userId),
        workers: removeById(people?.workers, userId)
    }
}

function removeUserFromOptionCollections(
    options: BootstrapOptions | undefined,
    userId: EntityId
): BootstrapOptions {
    return {
        ...options,
        customers: removeById(options?.customers, userId),
        suppliers: removeById(options?.suppliers, userId),
        workers: removeById(options?.workers, userId)
    }
}

function upsertUserIntoRoleCollection(
    people: BootstrapPeople,
    user: BootstrapUser
): BootstrapPeople {
    const roleCollection = getRoleCollection(user.role)

    if (!roleCollection) {
        return people
    }

    return {
        ...people,
        [roleCollection]: upsertById(people[roleCollection], user)
    }
}

function upsertUserIntoOptionCollection(
    options: BootstrapOptions,
    user: BootstrapUser
): BootstrapOptions {
    const roleCollection = getRoleCollection(user.role)

    if (!roleCollection) {
        return options
    }

    return {
        ...options,
        [roleCollection]: upsertActiveOption(options[roleCollection], user)
    }
}

export function upsertBootstrapUser(
    currentData: BootstrapData | null,
    user: BootstrapUser | null | undefined
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!user?.id) {
        return data
    }

    const peopleWithoutOldRole = removeUserFromRoleCollections(data.people, user.id)
    const optionsWithoutOldRole = removeUserFromOptionCollections(data.options, user.id)

    return {
        ...data,
        options: upsertUserIntoOptionCollection(optionsWithoutOldRole, user),
        people: upsertUserIntoRoleCollection(
            {
                ...peopleWithoutOldRole,
                users: upsertById(data.people?.users, user)
            },
            user
        )
    }
}

export function removeBootstrapUser(
    currentData: BootstrapData | null,
    userId: EntityId
): BootstrapData {
    const data = safeBootstrapData(currentData)

    return {
        ...data,
        options: removeUserFromOptionCollections(data.options, userId),
        people: {
            ...removeUserFromRoleCollections(data.people, userId),
            users: removeById(data.people?.users, userId)
        }
    }
}





