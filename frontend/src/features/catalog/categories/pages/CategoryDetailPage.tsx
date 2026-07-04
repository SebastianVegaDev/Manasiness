import {
    useEffect,
    useMemo,
    useState
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import {
    activateCategory,
    deactivateCategory,
    getCategoryById
} from "@features/catalog/categories/api/categories.api"
import type { Category } from "@features/catalog/shared/types/catalog.types"
import { getApiErrorMessage } from "@shared/api/httpError"
import EntityDetailScreen, { type EntityDetailData } from "@shared/ui/screens/entity-detail/EntityDetailScreen"

const FALLBACK_IMAGE = "https://i.postimg.cc/KYydTs9w/noimage.png"

function getCategoryStatus(category: Category): boolean {
    if (typeof category.is_active === "boolean") {
        return category.is_active
    }

    if (typeof category.isActive === "boolean") {
        return category.isActive
    }

    return category.status !== "inactive"
}

function getProductCount(category: Category): number {
    return Number(category.product_count ?? category.products_count ?? category.total_products ?? 0)
}

function CategoryDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [category, setCategory] = useState<Category | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    async function loadCategory() {
        if (!id) {
            setCategory(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        try {
            setCategory(await getCategoryById(id))
        } catch (caughtError) {
            console.error(caughtError)
            setCategory(null)
            toast.error(getApiErrorMessage(caughtError, "Could not load category"))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        void loadCategory()
    }, [id])

    const detail = useMemo<EntityDetailData | null>(() => {
        if (!category) {
            return null
        }

        return {
            id: category.id,
            entity: "Category",
            name: category.name,
            image: category.image || FALLBACK_IMAGE,
            isActive: getCategoryStatus(category),
            details: [
                { label: "Products", value: String(getProductCount(category)) },
                { label: "Created At", value: String(category.created_at ?? "No date") }
            ]
        }
    }, [category])

    async function handleStatusChange(nextAction: "activate" | "deactivate") {
        if (!id) {
            return
        }

        setIsSubmitting(true)

        try {
            const nextCategory = nextAction === "activate"
                ? await activateCategory(id)
                : await deactivateCategory(id)

            setCategory(nextCategory)
            toast.success(nextAction === "activate" ? "Category activated successfully" : "Category deactivated successfully")
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(caughtError, "Could not update category"))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!detail && !isLoading) {
        return (
            <div className="shared-entity-detail-screen">
                <div className="shared-entity-detail-title">
                    <h1>Could not load category</h1>
                </div>
                <div className="shared-entity-detail-actions">
                    <button id="edit" type="button" onClick={() => navigate("/dashboard/categories")}>
                        Back
                    </button>
                </div>
            </div>
        )
    }

    if (!detail) {
        return (
            <div className="shared-entity-detail-screen">
                <div className="shared-entity-detail-title">
                    <h1>Category</h1>
                </div>
            </div>
        )
    }

    return (
        <EntityDetailScreen
            detail={detail}
            isLoading={isLoading}
            isSubmitting={isSubmitting}
            onDeactivateClick={() => void handleStatusChange("deactivate")}
            onActivateClick={() => void handleStatusChange("activate")}
        />
    )
}

export default CategoryDetailPage
