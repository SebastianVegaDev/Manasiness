import { notFound } from "../../errors/http-errors.js"
import { mapPersonDetail } from "../../shared/mappers/person.mapper.js"
import type { StoreScopedData } from "../../types/history.types.js"
import type {
    PeopleFilterData,
    PersonDetailData,
    UserOptionRow,
    UserRow
} from "../../types/person.types.js"
import { mapWorkerOptions, mapWorkers } from "./workers.mapper.js"
import {
    findActiveWorkersOptions,
    findAllWorkers,
    findWorkerBaseById,
    findWorkerRowsById,
    getWorkerTotalRows,
    getWorkerWindowInfo
} from "./workers.repository.js"

export async function getAllWorkers(data: PeopleFilterData): Promise<UserRow[]> {
    return mapWorkers(await findAllWorkers(data))
}

export async function getWorkerDetail(data: PersonDetailData) {
    const worker = await findWorkerBaseById({
        id: data.id,
        storeId: data.storeId
    })

    if (!worker) {
        throw notFound("Worker not found")
    }

    const [rows, totalRows, windowInfo] = await Promise.all([
        findWorkerRowsById(data),
        getWorkerTotalRows({
            id: data.id,
            storeId: data.storeId,
            dayOffset: data.dayOffset
        }),
        getWorkerWindowInfo({
            id: data.id,
            storeId: data.storeId,
            dayOffset: data.dayOffset
        })
    ])

    return mapPersonDetail(worker, rows, totalRows, windowInfo)
}

export async function getActiveWorkersOptions(data: StoreScopedData): Promise<UserOptionRow[]> {
    return mapWorkerOptions(await findActiveWorkersOptions(data))
}