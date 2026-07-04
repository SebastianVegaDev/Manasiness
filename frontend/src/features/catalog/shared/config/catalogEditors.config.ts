import {
    getCategoryById,
    updateCategory
} from "@features/catalog/categories/api/categories.api"
import {
    mapCategoryToFormValues,
    mapCategoryUpdatePayload
} from "@features/catalog/categories/mappers/categories.mapper"
import {
    getProductById,
    updateProduct
} from "@features/catalog/products/api/products.api"
import {
    mapProductToFormValues,
    mapProductUpdatePayload
} from "@features/catalog/products/mappers/products.mapper"
import {
    imageField,
    numberField,
    selectField,
    statusOptions,
    textField
} from "@shared/forms/entityField.helpers"

import type {
    Category,
    Product
} from "../types/catalog.types"
import type { EntityId } from "@shared/types/common.types"
import type { FormField, FormValues } from "@shared/types/form.types"

type CatalogEditorConfig<TEntity> = {
    title: string
    subtitle: string
    emptyMessage: string
    getEntity: (id: EntityId) => Promise<TEntity>
    updateEntity: (id: EntityId, payload: unknown) => Promise<TEntity>
    fields?: FormField[]
    buildFields?: (entity: TEntity | null) => FormField[]
    mapValues: (entity: TEntity | null | undefined) => FormValues
    mapPayload: (formData: FormValues, entity?: TEntity | null) => unknown
    cancelPath: string
    navigateAfterSave: () => string
    loadErrorMessage: string
    updateSuccessMessage: string
    updateErrorMessage: string
}

function buildCategoryFields(): FormField[] {
    return [
        textField({
            id: "category-name",
            name: "name",
            label: "Name",
            placeholder: "Category name"
        }),
        imageField({
            id: "category-image",
            name: "image",
            label: "Image",
            placeholder: "Image URL"
        }),
        selectField({
            id: "category-status",
            name: "status",
            label: "Status",
            options: statusOptions()
        })
    ]
}

function buildProductFields(product: Product | null): FormField[] {
    const categoryOptions = Array.isArray(product?.categoryOptions)
        ? product.categoryOptions as FormField["options"]
        : []

    return [
        textField({
            id: "product-name",
            name: "name",
            label: "Name",
            placeholder: "Product name"
        }),
        selectField({
            id: "product-category",
            name: "category_id",
            label: "Category",
            options: categoryOptions ?? []
        }),
        numberField({
            id: "product-cost-price",
            name: "cost_price",
            label: "Cost Price",
            placeholder: "Cost price",
            min: "0",
            step: "0.01",
            inputMode: "decimal"
        }),
        numberField({
            id: "product-sale-price",
            name: "sale_price",
            label: "Sale Price",
            placeholder: "Sale price",
            min: "0",
            step: "0.01",
            inputMode: "decimal"
        }),
        numberField({
            id: "product-stock",
            name: "stock",
            label: "Stock",
            placeholder: "Stock",
            min: "0",
            step: "1",
            inputMode: "numeric"
        }),
        imageField({
            id: "product-image",
            name: "image",
            label: "Image",
            placeholder: "Image URL"
        }),
        selectField({
            id: "product-status",
            name: "status",
            label: "Status",
            options: statusOptions()
        })
    ]
}

export const CATALOG_EDITOR_CONFIG: {
    category: CatalogEditorConfig<Category>
    product: CatalogEditorConfig<Product>
} = {
    category: {
        title: "Edit Category",
        subtitle: "Update category information.",
        emptyMessage: "Category not found.",

        getEntity: getCategoryById,
        updateEntity: (id, payload) => updateCategory(id, payload as Parameters<typeof updateCategory>[1]),

        fields: buildCategoryFields(),

        mapValues: mapCategoryToFormValues,
        mapPayload: mapCategoryUpdatePayload,

        cancelPath: "/dashboard/categories",
        navigateAfterSave: () => "/dashboard/categories",

        loadErrorMessage: "Could not load category",
        updateSuccessMessage: "Category updated successfully",
        updateErrorMessage: "Could not update category"
    },

    product: {
        title: "Edit Product",
        subtitle: "Update product information.",
        emptyMessage: "Product not found.",

        getEntity: getProductById,
        updateEntity: (id, payload) => updateProduct(id, payload as Parameters<typeof updateProduct>[1]),

        buildFields: buildProductFields,

        mapValues: mapProductToFormValues,
        mapPayload: mapProductUpdatePayload,

        cancelPath: "/dashboard/products",
        navigateAfterSave: () => "/dashboard/products",

        loadErrorMessage: "Could not load product",
        updateSuccessMessage: "Product updated successfully",
        updateErrorMessage: "Could not update product"
    }
}




