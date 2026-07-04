import { Resend } from "resend"

import { env } from "../../config/env.js"

export const resend = env.email.resendApiKey
    ? new Resend(env.email.resendApiKey)
    : null
