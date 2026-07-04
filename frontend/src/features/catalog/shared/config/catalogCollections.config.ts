import {
    createCategory,
    getCategories
} from "@features/catalog/categories/api/categories.api"
import {
    mapCategoriesToCards,
    mapCategoryOptions
} from "@features/catalog/categories/mappers/categories.mapper"
import {
    createProduct,
    getProducts
} from "@features/catalog/products/api/products.api"
import { mapProductsToCards } from "@features/catalog/products/mappers/products.mapper"

import type {
    CatalogCardItem,
    CatalogListParams,
    CatalogOptions,
    CategoryCreatePayload,
    ProductCreatePayload
} from "../types/catalog.types"
import type { CurrencyCode } from "@shared/types/common.types"
import type { SelectOption } from "@shared/types/form.types"

type FilterGroup = {
    key: string
    label: string
    value: string
    onChange: (event: { target: { value: string } }) => void
    options: SelectOption[]
}

type CollectionContext = {
    currencyCode: CurrencyCode | string
    options: CatalogOptions
}

type CollectionState = {
    filters: Record<string, string>
    options: CatalogOptions
    createFilterChangeHandler: (key: string) => (event: { target: { value: string } }) => void
    context: CollectionContext
}

type CatalogCollectionConfig = {
    title: string
    subtitle: string
    searchLabel: string
    resourcePath: string
    emptyMessage: string
    initialFilters: Record<string, string>
    getOptions?: (context: CollectionContext) => Promise<CatalogOptions>
    mapParams?: (params: {
        search: string
        filters: Record<string, string>
        context: CollectionContext
    }) => CatalogListParams
    getItems: (params: CatalogListParams, context: CollectionContext) => Promise<unknown>
    mapItems: (data: unknown, context: CollectionContext) => CatalogCardItem[]
    createItem?: (formData: unknown, context: CollectionContext) => Promise<unknown>
    createSuccessMessage?: string
    createErrorMessage?: string
    loadErrorMessage?: string
    buildFilterGroups: (state: CollectionState) => FilterGroup[]
}

const STATUS_OPTIONS: SelectOption[] = [
    { value: "all", label: "All" },
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" }
]

function createStatusFilterGroup({ filters, createFilterChangeHandler }: CollectionState): FilterGroup {
    return {
        key: "status",
        label: "Status",
        value: filters.status ?? "all",
        onChange: createFilterChangeHandler("status"),
        options: STATUS_OPTIONS
    }
}

export const CATALOG_COLLECTION_CONFIG: Record<"categories" | "products", CatalogCollectionConfig> = {
    categories: {
        title: "Welcome to Categories",
        subtitle: "In this section you can create, edit and view the categories you have",
        searchLabel: "Categories",
        resourcePath: "categories",
        emptyMessage: "No categories match the current search",

        initialFilters: {
            status: "all"
        },

        getItems: (params) => {
            return getCategories(params)
        },

        mapItems: (data) => {
            return mapCategoriesToCards(data as Awaited<ReturnType<typeof getCategories>>)
        },

        createItem: (formData) => {
            return createCategory(formData as CategoryCreatePayload)
        },

        createSuccessMessage: "Category created successfully",
        createErrorMessage: "Could not create category",
        loadErrorMessage: "Could not load categories",

        buildFilterGroups: (state) => {
            return [
                createStatusFilterGroup(state)
            ]
        }
    },

    products: {
        title: "Welcome to Products",
        subtitle: "In this section you can create, edit and view the products you have",
        searchLabel: "Products",
        resourcePath: "products",
        emptyMessage: "No products match the current search",

        initialFilters: {
            status: "all",
            categoryId: "all"
        },

        getOptions: async () => {
            const categories = await getCategories({ status: "all" })

            return {
                categoryOptions: mapCategoryOptions(categories)
            }
        },

        mapParams: ({ search, filters }) => {
            const params: CatalogListParams = {
                search
            }

            if (filters.status) {
                params.status = filters.status
            }

            if (filters.categoryId && filters.categoryId !== "all") {
                params.categoryId = filters.categoryId
            }

            return params
        },

        getItems: (params) => {
            return getProducts(params)
        },

        mapItems: (data, context) => {
            return mapProductsToCards(
                data as Awaited<ReturnType<typeof getProducts>>,
                context.currencyCode
            )
        },

        createItem: (formData) => {
            return createProduct(formData as ProductCreatePayload)
        },

        createSuccessMessage: "Successfully created product",
        createErrorMessage: "Product could not be created",
        loadErrorMessage: "Could not load products",

        buildFilterGroups: (state) => {
            const categoryOptions = state.options.categoryOptions ?? []

            return [
                createStatusFilterGroup(state),
                {
                    key: "category",
                    label: "Category",
                    value: state.filters.categoryId ?? "all",
                    onChange: state.createFilterChangeHandler("categoryId"),
                    options: [
                        { value: "all", label: "All" },
                        ...categoryOptions
                    ]
                }
            ]
        }
    }
}




