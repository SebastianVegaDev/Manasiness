import { conflict, notFound } from "../../errors/http-errors.js"
import type {
    UserMutationData,
    UserRow,
    UsersFilterData,
    UserStatusData,
    UserUpdateData
} from "../../types/person.types.js"
import type { IdScopedData } from "../../types/history.types.js"
import { mapUser, mapUsers } from "./users.mapper.js"
import {
    findAllUsers,
    findUserById,
    findUserByPhone,
    insertUser,
    updateUserById,
    updateUserStatus
} from "./users.repository.js"

export async function getAllUsers(data: UsersFilterData): Promise<UserRow[]> {
    return mapUsers(await findAllUsers(data))
}

export async function getUserDetail(data: IdScopedData): Promise<UserRow> {
    const user = await findUserById(data)

    if (!user) {
        throw notFound("User not found")
    }

    return mapUser(user)
}

export async function createNewUser(data: UserMutationData): Promise<UserRow> {
    const existingUser = await findUserByPhone({
        phone: data.phone,
        storeId: data.storeId
    })

    if (existingUser) {
        throw conflict("User already exists")
    }

    const user = await insertUser(data)

    if (!user) {
        throw conflict("User could not be created")
    }

    return mapUser(user)
}

export async function updateUser(data: UserUpdateData): Promise<UserRow> {
    const user = await findUserById({
        id: data.id,
        storeId: data.storeId
    })

    if (!user) {
        throw notFound("User not found")
    }

    if (user.is_default) {
        throw conflict("User unavailable")
    }

    const existingUser = await findUserByPhone({
        phone: data.phone,
        storeId: data.storeId
    })

    if (existingUser && existingUser.id !== data.id) {
        throw conflict("User already exists")
    }

    if (data.role !== user.role) {
        throw conflict("Role change unavailable")
    }

    const updatedUser = await updateUserById({
        ...data,
        role: user.role
    })

    if (!updatedUser) {
        throw notFound("User not found")
    }

    return mapUser(updatedUser)
}

export async function disableUser(data: UserStatusData): Promise<UserRow> {
    return updateUserAvailability(data)
}

export async function enableUser(data: UserStatusData): Promise<UserRow> {
    return updateUserAvailability(data)
}

async function updateUserAvailability(data: UserStatusData): Promise<UserRow> {
    const user = await findUserById({
        id: data.id,
        storeId: data.storeId
    })

    if (!user) {
        throw notFound("User not found")
    }

    if (user.is_default) {
        throw conflict("User unavailable")
    }

    const updatedUser = await updateUserStatus(data)

    if (!updatedUser) {
        throw notFound("User not found")
    }

    return mapUser(updatedUser)
}