import { safeBootstrapData } from "./shared/bootstrapUpdater.utils"

import type {
    BootstrapData,
    BootstrapStore
} from "../shared/types/bootstrap.types"

export function updateBootstrapStore(
    currentData: BootstrapData | null,
    store: BootstrapStore | null | undefined
): BootstrapData {
    const data = safeBootstrapData(currentData)

    if (!store) {
        return data
    }

    return {
        ...data,
        session: {
            ...data.session,
            store: {
                ...data.session?.store,
                ...store
            }
        }
    }
}





