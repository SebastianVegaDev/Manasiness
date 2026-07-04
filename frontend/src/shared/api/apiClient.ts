const API_BASE_URL = "http://localhost:4000/api";

async function apiRequest<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...options,
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        throw new Error(data?.message || "Request failed");
    }

    return data as T
}

export function apiGet<T>(path: string): Promise<T> {
    return apiRequest<T>(path, {
        method: "GET",
    });
}

export function apiPost<T, B=unknown>(path: string, body?: B): Promise<T> {
    return apiRequest<T>(path, {
        method: "POST",
        body: body ? JSON.stringify(body) : undefined,
    });
}

export function apiPut<T, B = unknown>(path: string, body?: B): Promise<T> {
    return apiRequest<T>(path, {
        method: "PUT",
        body: body ? JSON.stringify(body) : undefined,
    });
}

export function apiDelete<T>(path: string): Promise<T> {
    return apiRequest<T>(path, {
        method: "DELETE",
    });
}