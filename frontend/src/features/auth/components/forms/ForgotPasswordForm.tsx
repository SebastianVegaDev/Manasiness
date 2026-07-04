import "./ForgotPasswordForm.css"

import {
    useState
} from "react"
import { Link } from "react-router-dom"

import type {
    ChangeEvent,
    ClipboardEvent,
    FormEvent,
    KeyboardEvent
} from "react"
import type {
    EmailCodePayload,
    ResetPasswordPayload,
    VerifyCodePayload
} from "@features/auth/shared/types/auth.types"

const STEPS = {
    EMAIL: 1,
    CODE: 2,
    PASSWORD: 3
} as const

const codeIndexes = [0, 1, 2, 3, 4, 5]
const stepLabels = ["Email", "Code", "Password"]

type ForgotPasswordFormProps = {
    onSendCode: (payload: EmailCodePayload) => void | Promise<void>
    onVerifyCode: (payload: VerifyCodePayload) => void | Promise<void>
    onResetPassword: (payload: ResetPasswordPayload) => void | Promise<void>
}

function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback
}

function ForgotPasswordForm({
    onSendCode,
    onVerifyCode,
    onResetPassword
}: ForgotPasswordFormProps) {
    const [step, setStep] = useState<number>(STEPS.EMAIL)
    const [email, setEmail] = useState<string>("")
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""])
    const [isEmailLoading, setIsEmailLoading] = useState<boolean>(false)
    const [isCodeLoading, setIsCodeLoading] = useState<boolean>(false)
    const [isPasswordLoading, setIsPasswordLoading] = useState<boolean>(false)
    const [emailError, setEmailError] = useState<string>("")
    const [codeError, setCodeError] = useState<boolean>(false)
    const [passwordError, setPasswordError] = useState<string>("")

    async function handleSendCode(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        if (!email || isEmailLoading) {
            return
        }

        try {
            setIsEmailLoading(true)
            setEmailError("")
            await onSendCode({ email })
            setStep(STEPS.CODE)
        } catch (error) {
            setEmailError(getErrorMessage(error, "Email could not be verified"))
        } finally {
            setIsEmailLoading(false)
        }
    }

    async function handleVerifyCode(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()
        const fullCode = code.join("")

        if (fullCode.length < 6 || isCodeLoading) {
            return
        }

        try {
            setIsCodeLoading(true)
            setCodeError(false)
            await onVerifyCode({ email, code: fullCode })
            setStep(STEPS.PASSWORD)
        } catch {
            setCodeError(true)
        } finally {
            setIsCodeLoading(false)
        }
    }

    async function handleResetPassword(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()
        const formData = new FormData(event.currentTarget)
        const password = String(formData.get("password") ?? "")
        const repassword = String(formData.get("repassword") ?? "")

        if (password !== repassword) {
            setPasswordError("Passwords do not match")
            return
        }

        try {
            setIsPasswordLoading(true)
            setPasswordError("")
            await onResetPassword({
                email,
                code: code.join(""),
                password,
                repassword,
                confirmPassword: repassword
            })
        } catch (error) {
            setPasswordError(getErrorMessage(error, "Password could not be reset"))
        } finally {
            setIsPasswordLoading(false)
        }
    }

    function handleCodeChange(value: string, index: number): void {
        if (!/^\d*$/.test(value)) {
            return
        }

        const next = [...code]
        next[index] = value.slice(-1)

        setCode(next)
        setCodeError(false)

        if (value && index < 5) {
            document.getElementById(`forgot-code-box-${index + 1}`)?.focus()
        }
    }

    function handleCodeInputChange(event: ChangeEvent<HTMLInputElement>, index: number): void {
        handleCodeChange(event.target.value, index)
    }

    function handleCodeKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number): void {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            document.getElementById(`forgot-code-box-${index - 1}`)?.focus()
        }
    }

    function handleCodePaste(event: ClipboardEvent<HTMLDivElement>): void {
        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

        if (pasted.length !== 6) {
            return
        }

        setCode(pasted.split(""))
        setCodeError(false)
        document.getElementById("forgot-code-box-5")?.focus()
    }

    return (
        <div className="shared-forgot-password-form-panel">
            <div className="shared-forgot-password-form-header">
                <h1>Reset Password</h1>
                <span>Recover access to your store account.</span>
            </div>

            <div className="shared-forgot-password-form-steps">
                {stepLabels.map((label, index) => {
                    const number = index + 1
                    const isActive = step === number
                    const isDone = step > number

                    return (
                        <div key={label} className="shared-forgot-password-form-step-item">
                            <div className={`shared-forgot-password-form-step-circle ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>{isDone ? "✓" : number}</div>
                            <span className={`shared-forgot-password-form-step-label ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>{label}</span>
                            {index < stepLabels.length - 1 ? <div className={`shared-forgot-password-form-step-line ${isDone ? "done" : ""}`} /> : null}
                        </div>
                    )
                })}
            </div>

            {step === STEPS.EMAIL && (
                <form className="shared-forgot-password-form-section" onSubmit={handleSendCode}>
                    <div className="shared-forgot-password-form-copy">
                        <h2>Enter your email</h2>
                        <p>We will send a 6-digit code if the store account exists.</p>
                    </div>
                    <div className="shared-forgot-password-form-field full">
                        <label htmlFor="forgot-email">Email</label>
                        <input id="forgot-email" type="email" placeholder="store@email.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required autoFocus />
                    </div>
                    {emailError ? <p className="shared-forgot-password-form-error">{emailError}</p> : null}
                    <button type="submit" className="shared-forgot-password-form-primary-button" disabled={isEmailLoading}>{isEmailLoading ? <span className="shared-forgot-password-form-spinner" /> : "Send code"}</button>
                    <div className="shared-forgot-password-form-footer"><span>Remember your password?</span><Link to="/login">Login</Link></div>
                </form>
            )}

            {step === STEPS.CODE && (
                <form className="shared-forgot-password-form-section" onSubmit={handleVerifyCode}>
                    <div className="shared-forgot-password-form-copy">
                        <h2>Enter the code</h2>
                        <p>We sent a 6-digit code to <strong>{email}</strong>.</p>
                    </div>
                    <div className="shared-forgot-password-form-code-boxes" onPaste={handleCodePaste}>
                        {codeIndexes.map((index) => <input key={index} id={`forgot-code-box-${index}`} className={`shared-forgot-password-form-code-box ${codeError ? "error" : ""}`} type="text" inputMode="numeric" maxLength={1} value={code[index]} onChange={(event) => handleCodeInputChange(event, index)} onKeyDown={(event) => handleCodeKeyDown(event, index)} autoFocus={index === 0} />)}
                    </div>
                    {codeError ? <p className="shared-forgot-password-form-error">Invalid code</p> : null}
                    <button type="submit" className="shared-forgot-password-form-primary-button" disabled={isCodeLoading || code.join("").length < 6}>{isCodeLoading ? <span className="shared-forgot-password-form-spinner" /> : "Verify code"}</button>
                    <button type="button" className="shared-forgot-password-form-secondary-button" onClick={() => setStep(STEPS.EMAIL)}>Use another email</button>
                </form>
            )}

            {step === STEPS.PASSWORD && (
                <form className="shared-forgot-password-form-section" onSubmit={handleResetPassword}>
                    <div className="shared-forgot-password-form-copy">
                        <h2>New password</h2>
                        <p>Create a stronger password for this account.</p>
                    </div>
                    <div className="shared-forgot-password-form-grid">
                        <div className="shared-forgot-password-form-field full"><label htmlFor="forgot-password">Password</label><input id="forgot-password" name="password" type="password" placeholder="New password" autoComplete="new-password" minLength={8} required /></div>
                        <div className="shared-forgot-password-form-field full"><label htmlFor="forgot-repassword">Repeat password</label><input id="forgot-repassword" name="repassword" type="password" placeholder="Repeat password" autoComplete="new-password" minLength={8} required /></div>
                    </div>
                    {passwordError ? <p className="shared-forgot-password-form-error">{passwordError}</p> : null}
                    <button type="submit" className="shared-forgot-password-form-primary-button" disabled={isPasswordLoading}>{isPasswordLoading ? <span className="shared-forgot-password-form-spinner" /> : "Reset password"}</button>
                    <button type="button" className="shared-forgot-password-form-secondary-button" onClick={() => setStep(STEPS.CODE)}>Back to code</button>
                </form>
            )}
        </div>
    )
}

export default ForgotPasswordForm
