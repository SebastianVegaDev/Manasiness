import { badRequest, conflict, notFound } from "../../errors/http-errors.js"
import { MOVEMENT_STATE } from "../../shared/constants/movement-states.constants.js"
import { withTransaction } from "../../shared/db/transaction.js"
import type { CreateSaleData, SaleRow, MovementWindowData } from "../../types/movement.types.js"
import { mapSalesWindow } from "./sales.mapper.js"
import {
    findAllSales,
    findProductForUpdate,
    findUserForSale,
    insertSale
} from "./sales.repository.js"

export async function getAllSales(data: MovementWindowData) {
    return mapSalesWindow(await findAllSales(data))
}

export async function createNewSale(data: CreateSaleData): Promise<SaleRow> {
    return withTransaction(async (client) => {
        const product = await findProductForUpdate(client, {
            id: data.productId,
            storeId: data.storeId
        })

        if (!product) {
            throw notFound("Product not found")
        }

        if (!product.is_active) {
            throw conflict("Product unavailable")
        }

        if (
            data.state === MOVEMENT_STATE.paid &&
            Number(product.stock) < data.quantity
        ) {
            throw conflict("Insufficient stock")
        }

        const customer = await findUserForSale(client, {
            userId: data.userId,
            storeId: data.storeId
        })

        if (!customer || customer.role !== "customer") {
            throw notFound("Customer not found")
        }

        if (!customer.is_active) {
            throw conflict("Customer unavailable")
        }

        if (customer.is_default && data.state === MOVEMENT_STATE.pending) {
            throw conflict("Default customer cannot have pending sales")
        }

        const sale = await insertSale(client, {
            ...data,
            salePrice: Number(product.sale_price)
        })

        if (!sale) {
            throw badRequest("Sale could not be created")
        }

        return sale
    })
}