import {
    useEffect,
    useMemo,
    useState
} from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-toastify"

import {
    activateUser,
    deactivateUser,
    getUserById
} from "@features/people/users/api/users.api"
import type { User } from "@features/people/shared/types/people.types"
import { getApiErrorMessage } from "@shared/api/httpError"
import EntityDetailScreen, { type EntityDetailData } from "@shared/ui/screens/entity-detail/EntityDetailScreen"

const FALLBACK_IMAGE = "https://i.postimg.cc/DzKtGYCx/nouserphoto.png"

function getUserStatus(user: User): boolean {
    if (typeof user.is_active === "boolean") {
        return user.is_active
    }

    if (typeof user.isActive === "boolean") {
        return user.isActive
    }

    return user.status !== "inactive"
}

function formatRole(role: unknown): string {
    if (typeof role !== "string") {
        return "No role"
    }

    return role.charAt(0).toUpperCase() + role.slice(1)
}

function UserDetailPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)

    async function loadUser() {
        if (!id) {
            setUser(null)
            setIsLoading(false)
            return
        }

        setIsLoading(true)

        try {
            setUser(await getUserById(id))
        } catch (caughtError) {
            console.error(caughtError)
            setUser(null)
            toast.error(getApiErrorMessage(caughtError, "Could not load user"))
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        void loadUser()
    }, [id])

    const detail = useMemo<EntityDetailData | null>(() => {
        if (!user) {
            return null
        }

        return {
            id: user.id,
            entity: "User",
            name: user.name,
            image: user.image || FALLBACK_IMAGE,
            isActive: getUserStatus(user),
            details: [
                { label: "Phone", value: user.phone ?? "No phone" },
                { label: "Role", value: formatRole(user.role) },
                { label: "Created At", value: String(user.created_at ?? "No date") }
            ]
        }
    }, [user])

    async function handleStatusChange(nextAction: "activate" | "deactivate") {
        if (!id) {
            return
        }

        setIsSubmitting(true)

        try {
            const nextUser = nextAction === "activate"
                ? await activateUser(id)
                : await deactivateUser(id)

            setUser(nextUser)
            toast.success(nextAction === "activate" ? "User activated successfully" : "User deactivated successfully")
        } catch (caughtError) {
            console.error(caughtError)
            toast.error(getApiErrorMessage(caughtError, "Could not update user"))
        } finally {
            setIsSubmitting(false)
        }
    }

    if (!detail && !isLoading) {
        return (
            <div className="shared-entity-detail-screen">
                <div className="shared-entity-detail-title">
                    <h1>Could not load user</h1>
                </div>
                <div className="shared-entity-detail-actions">
                    <button id="edit" type="button" onClick={() => navigate("/dashboard/users")}>
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
                    <h1>User</h1>
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

export default UserDetailPage
