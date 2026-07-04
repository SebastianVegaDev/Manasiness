import type {
    PeopleCardItem,
    User,
    UserFormValues,
    UserUpdatePayload
} from "../../shared/types/people.types"
import type { FormValues } from "@shared/types/form.types"

const FALLBACK_IMAGE = "https://i.postimg.cc/KYydTs9w/noimage.png"

function getPersonStatus(person: User): string {
    if (typeof person.status === "string") {
        return person.status
    }

    if (typeof person.is_active === "boolean") {
        return person.is_active ? "active" : "inactive"
    }

    if (typeof person.isActive === "boolean") {
        return person.isActive ? "active" : "inactive"
    }

    return "active"
}

function getRoleLabel(role: unknown): string {
    if (typeof role !== "string") {
        return "No role"
    }

    return role.charAt(0).toUpperCase() + role.slice(1)
}

export function mapUsersToCards(users: User[] | null | undefined): PeopleCardItem[] {
    const safeUsers = Array.isArray(users) ? users : []

    return safeUsers.map((user) => ({
        id: user.id,
        name: user.name,
        image: user.image || FALLBACK_IMAGE,
        status: getPersonStatus(user),
        details: [
            `Email: ${user.email ?? "No email"}`,
            `Role: ${getRoleLabel(user.role)}`
        ]
    }))
}

export function mapUserToFormValues(user: User | null | undefined): UserFormValues {
    return {
        name: user?.name ?? "",
        email: user?.email ?? "",
        phone: user?.phone ?? "",
        role: String(user?.role ?? "customer"),
        image: user?.image ?? "",
        status: user ? getPersonStatus(user) : "active"
    }
}

export function mapUserUpdatePayload(formData: FormValues): UserUpdatePayload {
    return {
        name: String(formData.name ?? ""),
        email: String(formData.email ?? ""),
        phone: formData.phone ? String(formData.phone) : null,
        role: String(formData.role ?? "customer"),
        image: formData.image ? String(formData.image) : null,
        status: String(formData.status ?? "active")
    }
}



