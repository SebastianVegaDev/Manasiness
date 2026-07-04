import { notFound } from "../../errors/http-errors.js"
import { mapPersonDetail } from "../../shared/mappers/person.mapper.js"
import type { StoreScopedData } from "../../types/history.types.js"
import type {
    PeopleFilterData,
    PersonDetailData,
    UserOptionRow,
    UserRow
} from "../../types/person.types.js"
import { mapSupplierOptions, mapSuppliers } from "./suppliers.mapper.js"
import {
    findActiveSuppliersOptions,
    findAllSuppliers,
    findSupplierBaseById,
    findSupplierRowsById,
    getSupplierTotalRows,
    getSupplierWindowInfo
} from "./suppliers.repository.js"

export async function getAllSuppliers(data: PeopleFilterData): Promise<UserRow[]> {
    return mapSuppliers(await findAllSuppliers(data))
}

export async function getSupplierDetail(data: PersonDetailData) {
    const supplier = await findSupplierBaseById({
        id: data.id,
        storeId: data.storeId
    })

    if (!supplier) {
        throw notFound("Supplier not found")
    }

    const [rows, totalRows, windowInfo] = await Promise.all([
        findSupplierRowsById(data),
        getSupplierTotalRows({
            id: data.id,
            storeId: data.storeId,
            dayOffset: data.dayOffset
        }),
        getSupplierWindowInfo({
            id: data.id,
            storeId: data.storeId,
            dayOffset: data.dayOffset
        })
    ])

    return mapPersonDetail(supplier, rows, totalRows, windowInfo)
}

export async function getActiveSuppliersOptions(data: StoreScopedData): Promise<UserOptionRow[]> {
    return mapSupplierOptions(await findActiveSuppliersOptions(data))
}