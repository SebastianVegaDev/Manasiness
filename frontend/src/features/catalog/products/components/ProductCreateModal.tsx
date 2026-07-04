import {
    useMemo,
    useState
} from "react"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import FormModal from "@shared/ui/modals/FormModal"
import EntityEditForm from "@shared/ui/forms/EntityEditForm"
import {
    imageField,
    numberField,
    selectField,
    statusOptions,
    textField
} from "@shared/forms/entityField.helpers"

import type { ProductCreatePayload } from "@features/catalog/shared/types/catalog.types"
import type { BootstrapOption } from "@features/bootstrap/shared/types/bootstrap.types"
import type { CreateModalProps } from "@shared/types/createModal.types"
import type { FormField, FormValues, SelectOption } from "@shared/types/form.types"

function toNumber(value: unknown): number {
    const numberValue = Number(value ?? 0)
    return Number.isFinite(numberValue) ? numberValue : 0
}

function mapBootstrapOptionsToSelectOptions(options: BootstrapOption[] | undefined): SelectOption[] {
    const safeOptions = Array.isArray(options) ? options : []

    return safeOptions.map((option) => ({
        value: String(option.id),
        label: option.name,
        disabled: Boolean(option.disabled)
    }))
}

function mapProductCreatePayload(values: FormValues): ProductCreatePayload {
    return {
        name: String(values.name ?? ""),
        category_id: String(values.category_id ?? ""),
        cost_price: toNumber(values.cost_price),
        sale_price: toNumber(values.sale_price),
        stock: toNumber(values.stock),
        image: values.image ? String(values.image) : null,
        status: String(values.status ?? "active")
    }
}

function ProductCreateModal({
    onClose,
    onCreate
}: CreateModalProps<ProductCreatePayload>) {
    const bootstrap = useBootstrapData()
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    const categoryOptions = useMemo<SelectOption[]>(() => {
        return [
            {
                value: "",
                label: "Select category",
                disabled: true
            },
            ...mapBootstrapOptionsToSelectOptions(bootstrap.data?.options?.categories)
        ]
    }, [bootstrap.data])

    const fields = useMemo<FormField[]>(() => {
        return [
            textField({
                id: "product-create-name",
                name: "name",
                label: "Name",
                placeholder: "Product name"
            }),
            selectField({
                id: "product-create-category",
                name: "category_id",
                label: "Category",
                options: categoryOptions
            }),
            numberField({
                id: "product-create-cost-price",
                name: "cost_price",
                label: "Cost Price",
                placeholder: "Cost price",
                min: "0",
                step: "0.01",
                inputMode: "decimal"
            }),
            numberField({
                id: "product-create-sale-price",
                name: "sale_price",
                label: "Sale Price",
                placeholder: "Sale price",
                min: "0",
                step: "0.01",
                inputMode: "decimal"
            }),
            numberField({
                id: "product-create-stock",
                name: "stock",
                label: "Stock",
                placeholder: "Stock",
                min: "0",
                step: "1",
                inputMode: "numeric"
            }),
            imageField({
                id: "product-create-image",
                name: "image",
                label: "Image",
                placeholder: "Image URL"
            }),
            selectField({
                id: "product-create-status",
                name: "status",
                label: "Status",
                options: statusOptions()
            })
        ]
    }, [categoryOptions])

    async function handleSubmit(values: FormValues): Promise<void> {
        setIsSubmitting(true)

        try {
            await onCreate(mapProductCreatePayload(values))
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <FormModal
            title="Create Product"
            subtitle="Register a new product for your catalog."
            onClose={onClose}
        >
            <EntityEditForm
                fields={fields}
                title="Create Product"
                values={{
                    name: "",
                    category_id: "",
                    cost_price: "",
                    sale_price: "",
                    stock: "",
                    image: "",
                    status: "active"
                }}
                onSubmit={handleSubmit}
                onCancel={onClose}
                isSubmitting={isSubmitting}
                submitLabel="Create"
                submittingLabel="Creating..."
            />
        </FormModal>
    )
}

export default ProductCreateModal
