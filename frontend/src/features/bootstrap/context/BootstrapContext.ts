import { createContext } from "react"

import type { BootstrapContextValue } from "../shared/types/bootstrap.types"

export const BootstrapContext = createContext<BootstrapContextValue | null>(null)







