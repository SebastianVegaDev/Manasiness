import { getBootstrapRequest } from "../api/bootstrap.api"

import type {
    BootstrapData,
    BootstrapResponse
} from "../shared/types/bootstrap.types"

function isBootstrapWrapper(response: BootstrapResponse): response is {
    data?: BootstrapData
    bootstrap?: BootstrapData
    payload?: BootstrapData
} {
    return Boolean(
        response &&
        typeof response === "object" &&
        (
            "data" in response ||
            "bootstrap" in response ||
            "payload" in response
        )
    )
}

function unwrapBootstrapResponse(response: BootstrapResponse): BootstrapData {
    if (isBootstrapWrapper(response)) {
        return (
            response.bootstrap ??
            response.data ??
            response.payload ??
            response
        )
    }

    return response
}

export async function loadBootstrapData(): Promise<BootstrapData> {
    const response = await getBootstrapRequest()
    return unwrapBootstrapResponse(response)
}





