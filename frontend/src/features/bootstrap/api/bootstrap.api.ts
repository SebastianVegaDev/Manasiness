import { apiGet } from "@shared/api/client"

import type { BootstrapResponse } from "../shared/types/bootstrap.types"

export async function getBootstrapRequest(): Promise<BootstrapResponse> {
    return apiGet<BootstrapResponse>("/bootstrap")
}







