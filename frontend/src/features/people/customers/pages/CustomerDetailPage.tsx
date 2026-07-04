import {
    useEffect,
    useState
} from "react"
import {
    useNavigate,
    useParams
} from "react-router-dom"

import { useBootstrapData } from "@features/bootstrap/hooks/useBootstrapData"
import PersonHistoryScreen from "@shared/ui/screens/person-history/PersonHistoryScreen"

import { getCustomerById } from "../api/customers.api"
import {
    mapCustomerToDetail,
    mapCustomersTotalPage
} from "../mappers/customers.mapper"

import type { HistorySort } from "@shared/types/common.types"
import type {
    PersonHistoryApiResponse,
    PersonHistoryDetail,
    PersonHistorySortChangeEvent
} from "@shared/types/personHistory.types"

function getCurrencyCode(data: unknown): string {
    const bootstrapData = data as {
        session?: {
            store?: {
                currency_code?: string
                currencyCode?: string
            }
        }
    } | null

    return (
        bootstrapData?.session?.store?.currency_code ||
        bootstrapData?.session?.store?.currencyCode ||
        "PEN"
    )
}

function CustomerDetailPage() {
    const bootstrap = useBootstrapData()
    const currencyCode = getCurrencyCode(bootstrap.data)

    const { id } = useParams()
    const navigate = useNavigate()

    const [detail, setDetail] = useState<PersonHistoryDetail | null>(null)
    const [hasError, setHasError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [sortOrder, setSortOrder] = useState<HistorySort>("recent")
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [totalPage, setTotalPage] = useState<number>(1)
    const [dayOffset, setDayOffset] = useState<number>(0)

    useEffect(() => {
        async function fetchCustomerDetail(): Promise<void> {
            if (!id) {
                setHasError(true)
                setIsLoading(false)
                return
            }

            try {
                setHasError(false)
                setIsLoading(true)

                const response: PersonHistoryApiResponse = await getCustomerById(id, {
                    sort: sortOrder,
                    page: currentPage,
                    offset: dayOffset,
                    period: "day"
                })

                setDetail(mapCustomerToDetail(response, currencyCode))
                setTotalPage(mapCustomersTotalPage(response))
            } catch (caughtError) {
                console.error(caughtError)
                setDetail(null)
                setTotalPage(1)
                setHasError(true)
            } finally {
                setIsLoading(false)
            }
        }

        void fetchCustomerDetail()
    }, [
        id,
        sortOrder,
        currentPage,
        dayOffset,
        currencyCode
    ])

    function handleSortChange(event: PersonHistorySortChangeEvent): void {
        const nextSort = event.target.value === "oldest" ? "oldest" : "recent"

        setSortOrder(nextSort)
        setCurrentPage(1)
    }

    function handleNextPage(): void {
        setCurrentPage((currentValue) => {
            if (currentValue >= totalPage) {
                return currentValue
            }

            return currentValue + 1
        })
    }

    function handlePrevPage(): void {
        setCurrentPage((currentValue) => Math.max(currentValue - 1, 1))
    }

    function handleOlder(): void {
        if (!detail?.hasOlder) {
            return
        }

        setDayOffset((currentValue) => currentValue + 1)
        setCurrentPage(1)
    }

    function handleNewer(): void {
        if (!detail?.hasNewer) {
            return
        }

        setDayOffset((currentValue) => Math.max(currentValue - 1, 0))
        setCurrentPage(1)
    }

    if (hasError || (!detail && !isLoading)) {
        return (
            <div>
                <h2>Could not load customer</h2>
                <button type="button" onClick={() => navigate("/dashboard/customers")}>
                    Back
                </button>
            </div>
        )
    }

    return (
        <PersonHistoryScreen
            title="Customer"
            name={detail?.name ?? ""}
            rows={detail?.details ?? []}
            columns={["Date", "Product", "Price", "Quantity", "State"]}
            sectionTitle="Sales"
            sortValue={sortOrder}
            onSortChange={handleSortChange}
            windowLabel={detail?.windowLabel ?? ""}
            hasOlder={detail?.hasOlder ?? false}
            hasNewer={detail?.hasNewer ?? false}
            onOlder={handleOlder}
            onNewer={handleNewer}
            currentPage={currentPage}
            totalPage={totalPage}
            onNextPage={handleNextPage}
            onPrevPage={handlePrevPage}
            isLoading={isLoading}
            emptyMessage="No sales found in this date."
        />
    )
}

export default CustomerDetailPage
