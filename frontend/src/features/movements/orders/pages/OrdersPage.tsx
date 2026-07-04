import MovementRegisterForm from "@features/movements/components/MovementRegisterForm/MovementRegisterForm"
import {
    createOrder,
    getOrdersHistory
} from "@features/movements/shared/api/movements.api"
import { MOVEMENT_PAGE_CONFIG } from "@features/movements/shared/config/movementPages.config"
import { buildOrderFields } from "@features/movements/shared/fields/movementFields.builders"
import { useMovementPage } from "@features/movements/shared/hooks/useMovementPage"
import { updateOrdersBootstrapAfterCreate } from "@features/movements/shared/utils/movementBootstrap.utils"
import { mapOrdersToTables } from "@features/movements/orders/mappers/orders.mapper"
import TableHistoryScreen from "@shared/ui/screens/table-history/TableHistoryScreen"

import type { TableHistoryColumn } from "@shared/types/tableHistory.types"

const ORDERS_COLUMNS: TableHistoryColumn[] = [
    { key: "date", label: "Date" },
    { key: "product", label: "Product" },
    { key: "supplier", label: "Supplier" },
    { key: "price", label: "Price", align: "right" },
    { key: "quantity", label: "Quantity", align: "right" },
    { key: "state", label: "State" }
]

function OrdersPage() {
    const config = MOVEMENT_PAGE_CONFIG.orders

    const movement = useMovementPage({
        config,
        getHistory: getOrdersHistory,
        createRecord: createOrder,
        buildFields: buildOrderFields,
        mapRows: mapOrdersToTables,
        updateBootstrapAfterCreate: updateOrdersBootstrapAfterCreate
    })

    return (
        <>
            <TableHistoryScreen
                title={config.title}
                subtitle={config.subtitle}
                rows={movement.rows}
                columns={ORDERS_COLUMNS}
                sortValue={movement.sort}
                onSortChange={movement.handleSortChange}
                windowLabel={movement.windowLabel}
                hasOlder={movement.hasOlder}
                hasNewer={movement.hasNewer}
                onOlder={movement.handleOlder}
                onNewer={movement.handleNewer}
                page={movement.page}
                totalPage={movement.totalPage}
                onPrevPage={movement.handlePrevPage}
                onNextPage={movement.handleNextPage}
                onRegisterClick={movement.openModal}
                emptyMessage={config.emptyMessage}
                isLoading={movement.isLoading}
            />

            {movement.isModalOpen ? (
                <MovementRegisterForm
                    title={config.modalTitle}
                    sectionLabel={config.modalSectionLabel}
                    fields={movement.fields}
                    helperMessage={movement.helperMessage}
                    isSubmitting={movement.isSubmitting}
                    onClose={movement.closeModal}
                    onSubmit={movement.handleSubmit}
                />
            ) : null}
        </>
    )
}

export default OrdersPage
