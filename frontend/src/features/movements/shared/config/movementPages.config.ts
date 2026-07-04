import {
    mapProductMovementPayload,
    mapStaffMovementPayload
} from "../mappers/movementPayload.mapper"

import type {
    MovementPageConfig,
    MovementScope
} from "../types/movement.types"

export const MOVEMENT_PAGE_CONFIG: Record<MovementScope, MovementPageConfig> = {
    sales: {
        title: "Sales",
        subtitle: "Track product sales and customer payments.",
        modalTitle: "Register Sale",
        modalSectionLabel: "Sale",
        emptyMessage: "No sales found.",
        bootstrapKey: "sales",
        successMessage: "Sale registered successfully.",
        errorMessage: "Could not load sales",
        createErrorMessage: "The sale could not be created",
        mapPayload: mapProductMovementPayload
    },

    orders: {
        title: "Orders",
        subtitle: "Track product purchases and supplier payments.",
        modalTitle: "Register Order",
        modalSectionLabel: "Order",
        emptyMessage: "No orders found.",
        bootstrapKey: "orders",
        successMessage: "Order registered successfully.",
        errorMessage: "Could not load orders",
        createErrorMessage: "The order could not be created",
        mapPayload: mapProductMovementPayload
    },

    staff: {
        title: "Staff",
        subtitle: "Track staff payments.",
        modalTitle: "Register Staff Payment",
        modalSectionLabel: "Staff",
        emptyMessage: "No staff payments found.",
        bootstrapKey: "staff",
        successMessage: "Staff payment registered successfully.",
        errorMessage: "Could not load staff history",
        createErrorMessage: "The staff record could not be created",
        mapPayload: mapStaffMovementPayload
    }
}

