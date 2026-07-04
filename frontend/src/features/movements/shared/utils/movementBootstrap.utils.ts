import { updateBootstrapInitialWindow } from "@features/bootstrap/updaters/bootstrap.updaters"

import type { MovementBootstrapAfterCreateInput } from "../types/movement.types"

function updateMovementInitialWindow({
    bootstrap,
    config,
    latestWindow
}: MovementBootstrapAfterCreateInput): void {
    if (!latestWindow) {
        return
    }

    bootstrap.updateBootstrap((currentData) => {
        return updateBootstrapInitialWindow(currentData, config.bootstrapKey, latestWindow)
    })
}

export function updateSalesBootstrapAfterCreate(data: MovementBootstrapAfterCreateInput): void {
    updateMovementInitialWindow(data)
}

export function updateOrdersBootstrapAfterCreate(data: MovementBootstrapAfterCreateInput): void {
    updateMovementInitialWindow(data)
}

export function updateStaffBootstrapAfterCreate(data: MovementBootstrapAfterCreateInput): void {
    updateMovementInitialWindow(data)
}

