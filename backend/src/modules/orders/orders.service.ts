import { badRequest, conflict, notFound } from "../../errors/http-errors.js"
import { MOVEMENT_STATE } from "../../shared/constants/movement-states.constants.js"
import { withTransaction } from "../../shared/db/transaction.js"
import type { CreateOrderData, MovementWindowData, OrderRow } from "../../types/movement.types.js"
import { mapOrdersWindow } from "./orders.mapper.js"
import {
    findAllOrders,
    findOrderProductForUpdate,
    findUserForOrder,
    insertOrder
} from "./orders.repository.js"

export async function getAllOrders(data: MovementWindowData) {
    return mapOrdersWindow(await findAllOrders(data))
}

export async function createNewOrder(data: CreateOrderData): Promise<OrderRow> {
    return withTransaction(async (client) => {
        const product = await findOrderProductForUpdate(client, {
            id: data.productId,
            storeId: data.storeId
        })

        if (!product) {
            throw notFound("Product not found")
        }

        if (!product.is_active) {
            throw conflict("Product unavailable")
        }

        const supplier = await findUserForOrder(client, {
            userId: data.userId,
            storeId: data.storeId
        })

        if (!supplier || supplier.role !== "supplier") {
            throw notFound("Supplier not found")
        }

        if (!supplier.is_active) {
            throw conflict("Supplier unavailable")
        }

        if (supplier.is_default && data.state === MOVEMENT_STATE.pending) {
            throw conflict("Default supplier cannot have pending orders")
        }

        const order = await insertOrder(client, {
            ...data,
            costPrice: Number(product.cost_price)
        })

        if (!order) {
            throw badRequest("Order could not be created")
        }

        return order
    })
}