import {
    createUser,
    getUsers
} from "@features/people/users/api/users.api"
import { mapUsersToCards } from "@features/people/users/mappers/users.mapper"

import { getCustomers } from "@features/people/customers/api/customers.api"
import { mapCustomersToCards } from "@features/people/customers/mappers/customers.mapper"

import { getSuppliers } from "@features/people/suppliers/api/suppliers.api"
import { mapSuppliersToCards } from "@features/people/suppliers/mappers/suppliers.mapper"

import { getWorkers } from "@features/people/workers/api/workers.api"
import { mapWorkersToCards } from "@features/people/workers/mappers/workers.mapper"

import type {
    PeopleCardItem,
    PeopleListParams,
    UserCreatePayload
} from "../types/people.types"
import type { SelectOption } from "@shared/types/form.types"

type FilterGroup = {
    key: string
    label: string
    value: string
    onChange: (event: { target: { value: string } }) => void
    options: SelectOption[]
}

type PeopleCollectionContext = {
    currencyCode?: string
    options?: Record<string, unknown>
}

type CollectionState = {
    filters: Record<string, string>
    createFilterChangeHandler: (key: string) => (event: { target: { value: string } }) => void
    context: PeopleCollectionContext
}

type PeopleCollectionConfig = {
    title: string
    subtitle: string
    searchLabel: string
    resourcePath: string
    emptyMessage: string
    initialFilters: Record<string, string>
    mapParams?: (params: {
        search: string
        filters: Record<string, string>
        context: PeopleCollectionContext
    }) => PeopleListParams
    getItems: (params: PeopleListParams, context: PeopleCollectionContext) => Promise<unknown>
    mapItems: (data: unknown, context: PeopleCollectionContext) => PeopleCardItem[]
    createItem?: (formData: unknown, context: PeopleCollectionContext) => Promise<unknown>
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

const ROLE_OPTIONS: SelectOption[] = [
    { value: "all", label: "All" },
    { value: "customer", label: "Customer" },
    { value: "supplier", label: "Supplier" },
    { value: "worker", label: "Worker" }
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

function createDefaultParams(search: string, filters: Record<string, string>): PeopleListParams {
    const params: PeopleListParams = {
        search
    }

    if (filters.status) {
        params.status = filters.status
    }

    return params
}

export const PEOPLE_COLLECTION_CONFIG: Record<
    "users" | "customers" | "suppliers" | "workers",
    PeopleCollectionConfig
> = {
    users: {
        title: "Welcome to Users",
        subtitle: "In this section you can create, edit and view the users you have",
        searchLabel: "Users",
        resourcePath: "users",
        emptyMessage: "No users match the current search",

        initialFilters: {
            status: "all",
            role: "all"
        },

        mapParams: ({ search, filters }) => {
            const params = createDefaultParams(search, filters)

            if (filters.role && filters.role !== "all") {
                params.role = filters.role
            }

            return params
        },

        getItems: (params) => {
            return getUsers(params)
        },

        mapItems: (data) => {
            return mapUsersToCards(data as Awaited<ReturnType<typeof getUsers>>)
        },

        createItem: (formData) => {
            return createUser(formData as UserCreatePayload)
        },

        createSuccessMessage: "User created successfully",
        createErrorMessage: "Could not create user",
        loadErrorMessage: "Could not load users",

        buildFilterGroups: (state) => {
            return [
                createStatusFilterGroup(state),
                {
                    key: "role",
                    label: "Role",
                    value: state.filters.role ?? "all",
                    onChange: state.createFilterChangeHandler("role"),
                    options: ROLE_OPTIONS
                }
            ]
        }
    },

    customers: {
        title: "Your Customers",
        subtitle: "In this section you can view your customers",
        searchLabel: "Customers",
        resourcePath: "customers",
        emptyMessage: "No customers match the current search",

        initialFilters: {
            status: "all"
        },

        getItems: (params) => {
            return getCustomers(params)
        },

        mapItems: (data) => {
            return mapCustomersToCards(data as Awaited<ReturnType<typeof getCustomers>>)
        },

        loadErrorMessage: "Could not load customers",

        buildFilterGroups: (state) => {
            return [
                createStatusFilterGroup(state)
            ]
        }
    },

    suppliers: {
        title: "Your Suppliers",
        subtitle: "In this section you can view your suppliers",
        searchLabel: "Suppliers",
        resourcePath: "suppliers",
        emptyMessage: "No suppliers match the current search",

        initialFilters: {
            status: "all"
        },

        getItems: (params) => {
            return getSuppliers(params)
        },

        mapItems: (data) => {
            return mapSuppliersToCards(data as Awaited<ReturnType<typeof getSuppliers>>)
        },

        loadErrorMessage: "Could not load suppliers",

        buildFilterGroups: (state) => {
            return [
                createStatusFilterGroup(state)
            ]
        }
    },

    workers: {
        title: "Your Workers",
        subtitle: "In this section you can view your workers",
        searchLabel: "Workers",
        resourcePath: "workers",
        emptyMessage: "No workers match the current search",

        initialFilters: {
            status: "all"
        },

        getItems: (params) => {
            return getWorkers(params)
        },

        mapItems: (data) => {
            return mapWorkersToCards(data as Awaited<ReturnType<typeof getWorkers>>)
        },

        loadErrorMessage: "Could not load workers",

        buildFilterGroups: (state) => {
            return [
                createStatusFilterGroup(state)
            ]
        }
    }
}



