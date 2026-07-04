import { badRequest, conflict, notFound } from "../../errors/http-errors.js"
import { MOVEMENT_STATE } from "../../shared/constants/movement-states.constants.js"
import { withTransaction } from "../../shared/db/transaction.js"
import type { CreateStaffData, MovementWindowData, StaffRow } from "../../types/movement.types.js"
import { mapStaffWindow } from "./staff.mapper.js"
import {
    findAllStaff,
    findUserForStaff,
    insertStaff
} from "./staff.repository.js"

export async function getAllStaff(data: MovementWindowData) {
    return mapStaffWindow(await findAllStaff(data))
}

export async function createNewStaff(data: CreateStaffData): Promise<StaffRow> {
    return withTransaction(async (client) => {
        const worker = await findUserForStaff(client, {
            userId: data.userId,
            storeId: data.storeId
        })

        if (!worker || worker.role !== "worker") {
            throw notFound("Worker not found")
        }

        if (!worker.is_active) {
            throw conflict("Worker unavailable")
        }

        if (worker.is_default && data.state === MOVEMENT_STATE.pending) {
            throw conflict("Default worker cannot have pending payments")
        }

        const staff = await insertStaff(client, data)

        if (!staff) {
            throw badRequest("Staff payment could not be created")
        }

        return staff
    })
}