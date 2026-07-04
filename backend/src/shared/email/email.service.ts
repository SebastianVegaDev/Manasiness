import { resend } from "./resendClient.js"
import { env } from "../../config/env.js"

type SendCodeEmailData = {
    to: string
    code: string
    subject: string
    title: string
    description: string
}

type SendVerificationEmailData = {
    to: string
    code: string
}

function buildDigitBoxes(code: string): string {
    return code.toString().split("").map((digit) => `
        <td style="width: 44px; height: 54px; background: #ffffff; border: 1px solid #c6d4e1; border-radius: 10px; text-align: center; vertical-align: middle; font-size: 28px; font-weight: 700; color: #44749d; font-family: Arial, sans-serif;">${digit}</td>
        <td style="width: 8px;"></td>
    `).join("")
}

async function sendCodeEmail(data: SendCodeEmailData) {
    const { to, code, subject, title, description } = data
    const digitBoxes = buildDigitBoxes(code)

    if (!resend) {
        console.info(`[email:local] ${subject} for ${to}: ${code}`)

        return {
            id: "local-email-disabled"
        }
    }

    const result = await resend.emails.send({
        from: env.email.from,
        to: [to],
        subject,
        html: `
            <!doctype html>
            <html lang="en">
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </head>
            <body style="margin: 0; padding: 0; background-color: #ebe7e0;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #ebe7e0; padding: 40px 16px;">
                    <tr>
                        <td align="center">
                            <table width="480" cellpadding="0" cellspacing="0" style="width: 100%; max-width: 480px; background-color: #ffffff; border: 2px solid #111111; border-radius: 20px; overflow: hidden;">
                                <tr>
                                    <td style="background-color: #44749d; padding: 34px 32px; text-align: center;">
                                        <h1 style="margin: 0; color: #ffffff; font-size: 32px; line-height: 1; font-family: Georgia, serif;">Manasiness</h1>
                                        <p style="margin: 10px 0 0; color: #eaf1f7; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; font-family: Arial, sans-serif;">Security code</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 38px 36px 34px; text-align: center;">
                                        <h2 style="margin: 0 0 10px; color: #44749d; font-size: 26px; line-height: 1.1; font-family: Georgia, serif;">${title}</h2>
                                        <p style="margin: 0 0 28px; color: #222222; font-size: 15px; line-height: 1.6; font-family: Arial, sans-serif;">${description}</p>
                                        <table align="center" cellpadding="0" cellspacing="0" style="margin: 0 auto 26px;">
                                            <tr>${digitBoxes}</tr>
                                        </table>
                                        <p style="margin: 0 0 6px; color: #222222; font-size: 13px; font-family: Arial, sans-serif;">This code expires in 10 minutes.</p>
                                        <p style="margin: 0; color: #777777; font-size: 12px; font-family: Arial, sans-serif;">Never share this code with anyone.</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="background-color: #f6f3ec; border-top: 2px solid #111111; padding: 18px 32px; text-align: center;">
                                        <p style="margin: 0; color: #555555; font-size: 12px; line-height: 1.5; font-family: Arial, sans-serif;">If you did not request this, you can ignore this email.<br />&copy; ${new Date().getFullYear()} Manasiness</p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
            </html>
        `
    })

    if (result.error) {
        throw new Error("Email could not be sent")
    }

    return result.data
}

export function sendVerificationEmail(data: SendVerificationEmailData) {
    return sendCodeEmail({
        to: data.to,
        code: data.code,
        subject: "Your Manasiness verification code",
        title: "Verify your email",
        description: "Use this code to finish creating your store account."
    })
}

export function sendPasswordResetEmail(data: SendVerificationEmailData) {
    return sendCodeEmail({
        to: data.to,
        code: data.code,
        subject: "Your Manasiness password reset code",
        title: "Reset your password",
        description: "Use this code to create a new password for your store account."
    })
}
