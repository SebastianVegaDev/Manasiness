import { mapProductOptions } from "@features/catalog/products/mappers/products.mapper"

import { mapCustomerOptions } from "../../sales/mappers/sales.mapper"
import { mapSupplierOptions } from "../../orders/mappers/orders.mapper"
import { mapWorkerOptions } from "../../staff/mappers/staff.mapper"

import type {
    BootstrapData,
    BootstrapOption
} from "@features/bootstrap/shared/types/bootstrap.types"
import type { FormValues } from "@shared/types/form.types"
import type {
    MovementField,
    MovementFieldOption,
    MovementFieldsBuildResult
} from "../types/movement.types"

function hasOptions(options: MovementFieldOption[]): boolean {
    return Array.isArray(options) && options.length > 0
}

function createDisabledState(disabled: boolean): boolean {
    return Boolean(disabled)
}

function buildProductOptions(bootstrapData: BootstrapData | null): MovementFieldOption[] {
    return mapProductOptions(bootstrapData?.options?.products ?? []) as MovementFieldOption[]
}

function buildCustomerOptions(bootstrapData: BootstrapData | null): MovementFieldOption[] {
    return mapCustomerOptions(bootstrapData?.options?.customers ?? [])
}

function buildSupplierOptions(bootstrapData: BootstrapData | null): MovementFieldOption[] {
    return mapSupplierOptions(bootstrapData?.options?.suppliers ?? [])
}

function buildWorkerOptions(bootstrapData: BootstrapData | null): MovementFieldOption[] {
    return mapWorkerOptions(bootstrapData?.options?.workers ?? [])
}

function buildProductField({
    id,
    productOptions,
    isDisabled
}: {
    id: string
    productOptions: MovementFieldOption[]
    isDisabled: boolean
}): MovementField {
    return {
        label: "Product",
        placeholder: "Select a product",
        id,
        name: "product_id",
        options: [
            { value: "", label: "Select a product", disabled: true },
            ...productOptions
        ],
        required: true,
        defaultValue: "",
        disabled: createDisabledState(isDisabled)
    }
}

function buildQuantityField({
    id,
    isDisabled
}: {
    id: string
    isDisabled: boolean
}): MovementField {
    return {
        label: "Quantity",
        placeholder: "Write the quantity",
        id,
        name: "quantity",
        type: "number",
        required: true,
        min: 1,
        step: 1,
        inputMode: "numeric",
        disabled: createDisabledState(isDisabled)
    }
}

function buildStateField({
    id,
    options,
    disabledLabel,
    isDisabled
}: {
    id: string
    options: MovementFieldOption[]
    disabledLabel: string
    isDisabled: boolean
}): MovementField {
    return {
        label: "State",
        placeholder: "Select a state",
        id,
        name: "state",
        options: [
            { value: "", label: "Select a state", disabled: true },
            {
                value: "pending",
                label: "Pending",
                disabledWhen: (formValues: FormValues) => {
                    return options.some((item) => item.value === formValues.user_id && item.isDefault)
                },
                disabledLabel
            },
            { value: "paid", label: "Paid" }
        ],
        required: true,
        defaultValue: "",
        disabled: createDisabledState(isDisabled)
    }
}

export function buildSaleFields(bootstrapData: BootstrapData | null): MovementFieldsBuildResult {
    const customerOptions = buildCustomerOptions(bootstrapData)
    const productOptions = buildProductOptions(bootstrapData)
    const isDisabled = !hasOptions(customerOptions) || !hasOptions(productOptions)

    return {
        fields: [
            buildProductField({
                id: "sale-product",
                productOptions,
                isDisabled
            }),
            {
                label: "Customer",
                placeholder: "Select a customer",
                id: "sale-customer",
                name: "user_id",
                options: [
                    { value: "", label: "Select a customer", disabled: true },
                    ...customerOptions
                ],
                required: true,
                defaultValue: "",
                disabled: createDisabledState(isDisabled)
            },
            buildQuantityField({
                id: "sale-quantity",
                isDisabled
            }),
            buildStateField({
                id: "sale-state",
                options: customerOptions,
                disabledLabel: "Cash sale must be paid",
                isDisabled
            })
        ],
        helperMessage: isDisabled
            ? "You need active products and customers before registering a sale."
            : ""
    }
}

export function buildOrderFields(bootstrapData: BootstrapData | null): MovementFieldsBuildResult {
    const supplierOptions = buildSupplierOptions(bootstrapData)
    const productOptions = buildProductOptions(bootstrapData)
    const isDisabled = !hasOptions(supplierOptions) || !hasOptions(productOptions)

    return {
        fields: [
            buildProductField({
                id: "order-product",
                productOptions,
                isDisabled
            }),
            {
                label: "Supplier",
                placeholder: "Select a supplier",
                id: "order-supplier",
                name: "user_id",
                options: [
                    { value: "", label: "Select a supplier", disabled: true },
                    ...supplierOptions
                ],
                required: true,
                defaultValue: "",
                disabled: createDisabledState(isDisabled)
            },
            buildQuantityField({
                id: "order-quantity",
                isDisabled
            }),
            buildStateField({
                id: "order-state",
                options: supplierOptions,
                disabledLabel: "Cash order must be paid",
                isDisabled
            })
        ],
        helperMessage: isDisabled
            ? "You need active products and suppliers before registering an order."
            : ""
    }
}

export function buildStaffFields(bootstrapData: BootstrapData | null): MovementFieldsBuildResult {
    const workerOptions = buildWorkerOptions(bootstrapData)
    const isDisabled = !hasOptions(workerOptions)

    return {
        fields: [
            {
                label: "Worker",
                placeholder: "Select a worker",
                id: "staff-worker",
                name: "user_id",
                options: [
                    { value: "", label: "Select a worker", disabled: true },
                    ...workerOptions
                ],
                required: true,
                defaultValue: "",
                disabled: createDisabledState(isDisabled)
            },
            {
                label: "Salary",
                placeholder: "Write the salary",
                id: "staff-salary",
                name: "salary",
                type: "number",
                required: true,
                min: 0.01,
                step: 0.01,
                inputMode: "decimal",
                disabled: createDisabledState(isDisabled)
            },
            buildStateField({
                id: "staff-state",
                options: workerOptions,
                disabledLabel: "Cash payment must be paid",
                isDisabled
            })
        ],
        helperMessage: isDisabled
            ? "You need active workers before registering a payment."
            : ""
    }
}

export type { BootstrapOption }

