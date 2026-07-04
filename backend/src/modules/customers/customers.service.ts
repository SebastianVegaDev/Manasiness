import { notFound } from "../../errors/http-errors.js"
import { mapPersonDetail } from "../../shared/mappers/person.mapper.js"
import type { StoreScopedData } from "../../types/history.types.js"
import type {
    PeopleFilterData,
    PersonDetailData,
    UserOptionRow,
    UserRow
} from "../../types/person.types.js"
import { mapCustomerOptions, mapCustomers } from "./customers.mapper.js"
import {
    findActiveCustomersOptions,
    findAllCustomers,
    findCustomerBaseById,
    findCustomerRowsById,
    getCustomerTotalRows,
    getCustomerWindowInfo
} from "./customers.repository.js"

export async function getAllCustomers(data: PeopleFilterData): Promise<UserRow[]> {
    return mapCustomers(await findAllCustomers(data))
}

export async function getCustomerDetail(data: PersonDetailData) {
    const customer = await findCustomerBaseById({
        id: data.id,
        storeId: data.storeId
    })

    if (!customer) {
        throw notFound("Customer not found")
    }

    const [rows, totalRows, windowInfo] = await Promise.all([
        findCustomerRowsById(data),
        getCustomerTotalRows({
            id: data.id,
            storeId: data.storeId,
            dayOffset: data.dayOffset
        }),
        getCustomerWindowInfo({
            id: data.id,
            storeId: data.storeId,
            dayOffset: data.dayOffset
        })
    ])

    return mapPersonDetail(customer, rows, totalRows, windowInfo)
}

export async function getActiveCustomersOptions(data: StoreScopedData): Promise<UserOptionRow[]> {
    return mapCustomerOptions(await findActiveCustomersOptions(data))
}