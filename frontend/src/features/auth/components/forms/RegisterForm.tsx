import "./RegisterForm.css"

import {
    useState
} from "react"
import { Link } from "react-router-dom"

import PhoneInput from "@shared/ui/forms/PhoneInput"

import type {
    ChangeEvent,
    ClipboardEvent,
    FormEvent,
    KeyboardEvent
} from "react"
import type {
    EmailCodePayload,
    RegisterPayload,
    VerifyCodePayload
} from "@features/auth/shared/types/auth.types"

const STEPS = {
    EMAIL: 1,
    CODE: 2,
    DETAILS: 3
} as const

const codeIndexes = [0, 1, 2, 3, 4, 5]
const stepLabels = ["Email", "Code", "Store"]

type RegisterFormProps = {
    onRegister: (payload: RegisterPayload) => void | Promise<void>
    onVerifyEmail: (payload: EmailCodePayload) => void | Promise<void>
    onVerifyCode: (payload: VerifyCodePayload) => void | Promise<void>
}

function getErrorMessage(error: unknown, fallback: string): string {
    return error instanceof Error ? error.message : fallback
}

function normalizeEmail(value: string): string {
    return value.trim().toLowerCase()
}

function RegisterForm({
    onRegister,
    onVerifyEmail,
    onVerifyCode
}: RegisterFormProps) {
    const [step, setStep] = useState<number>(STEPS.EMAIL)
    const [email, setEmail] = useState<string>("")
    const [code, setCode] = useState<string[]>(["", "", "", "", "", ""])
    const [emailLoading, setEmailLoading] = useState<boolean>(false)
    const [codeLoading, setCodeLoading] = useState<boolean>(false)
    const [registerLoading, setRegisterLoading] = useState<boolean>(false)
    const [codeError, setCodeError] = useState<boolean>(false)
    const [emailError, setEmailError] = useState<string>("")
    const [registerError, setRegisterError] = useState<string>("")

    async function handleSendEmail(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        const normalizedEmail = normalizeEmail(email)

        if (!normalizedEmail || emailLoading) {
            return
        }

        try {
            setEmailLoading(true)
            setEmailError("")
            await onVerifyEmail({ email: normalizedEmail })
            setEmail(normalizedEmail)
            setStep(STEPS.CODE)
        } catch (error) {
            setEmailError(getErrorMessage(error, "Email could not be verified"))
        } finally {
            setEmailLoading(false)
        }
    }

    async function handleVerifyCode(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()
        const fullCode = code.join("")

        if (fullCode.length < 6 || codeLoading) {
            return
        }

        try {
            setCodeLoading(true)
            setCodeError(false)
            await onVerifyCode({ email: normalizeEmail(email), code: fullCode })
            setStep(STEPS.DETAILS)
        } catch {
            setCodeError(true)
        } finally {
            setCodeLoading(false)
        }
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>): Promise<void> {
        event.preventDefault()

        if (registerLoading) {
            return
        }

        const fullCode = code.join("")

        if (fullCode.length < 6) {
            setRegisterError("Verification code is incomplete")
            return
        }

        const formData = new FormData(event.currentTarget)
        const password = String(formData.get("password") ?? "")
        const repassword = String(formData.get("repassword") ?? "")

        if (password !== repassword) {
            setRegisterError("Passwords do not match")
            return
        }

        const payload: RegisterPayload = {
            name: String(formData.get("name") ?? ""),
            email: normalizeEmail(email),
            phone: String(formData.get("phone") ?? ""),
            image: String(formData.get("image") ?? ""),
            password,
            repassword,
            confirmPassword: repassword,
            code: fullCode
        }

        try {
            setRegisterLoading(true)
            setRegisterError("")
            await onRegister(payload)
        } catch (error) {
            setRegisterError(getErrorMessage(error, "Could not register"))
        } finally {
            setRegisterLoading(false)
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
            document.getElementById(`code-box-${index + 1}`)?.focus()
        }
    }

    function handleCodeInputChange(event: ChangeEvent<HTMLInputElement>, index: number): void {
        handleCodeChange(event.target.value, index)
    }

    function handleCodeKeyDown(event: KeyboardEvent<HTMLInputElement>, index: number): void {
        if (event.key === "Backspace" && !code[index] && index > 0) {
            document.getElementById(`code-box-${index - 1}`)?.focus()
        }
    }

    function handleCodePaste(event: ClipboardEvent<HTMLDivElement>): void {
        event.preventDefault()

        const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6)

        if (pasted.length !== 6) {
            return
        }

        setCode(pasted.split(""))
        setCodeError(false)
        document.getElementById("code-box-5")?.focus()
    }

    return (
        <div className="shared-register-form-panel">
            <div className="shared-register-form-header">
                <p>Store setup</p>
                <h1>Register Now</h1>
                <span>Create your workspace in three clear steps.</span>
            </div>

            <div className="shared-register-form-steps">
                {stepLabels.map((label, index) => {
                    const number = index + 1
                    const isActive = step === number
                    const isDone = step > number

                    return (
                        <div key={label} className="shared-register-form-step-item">
                            <div className={`shared-register-form-step-circle ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>{isDone ? "✓" : number}</div>
                            <span className={`shared-register-form-step-label ${isActive ? "active" : ""} ${isDone ? "done" : ""}`}>{label}</span>
                            {index < stepLabels.length - 1 ? <div className={`shared-register-form-step-line ${isDone ? "done" : ""}`} /> : null}
                        </div>
                    )
                })}
            </div>

            {step === STEPS.EMAIL && (
                <form className="shared-register-form-section" onSubmit={handleSendEmail}>
                    <div className="shared-register-form-copy">
                        <h2>Enter email</h2>
                        <p>Use the email that will own this store account.</p>
                    </div>
                    <div className="shared-register-form-field full">
                        <label htmlFor="register-email">Email</label>
                        <input id="register-email" type="email" placeholder="store@email.com" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required autoFocus />
                    </div>
                    {emailError ? <p className="shared-register-form-error">{emailError}</p> : null}
                    <button type="submit" className="shared-register-form-primary-button" disabled={emailLoading}>{emailLoading ? <span className="shared-register-form-spinner" /> : "Send code"}</button>
                    <div className="shared-register-form-footer"><span>Already have an account?</span><Link to="/login">Login</Link></div>
                </form>
            )}

            {step === STEPS.CODE && (
                <form className="shared-register-form-section" onSubmit={handleVerifyCode}>
                    <div className="shared-register-form-copy">
                        <h2>Enter the code</h2>
                        <p>We sent a 6-digit code to <strong>{email}</strong>.</p>
                    </div>
                    <div className="shared-register-form-code-boxes" onPaste={handleCodePaste}>
                        {codeIndexes.map((index) => <input key={index} id={`code-box-${index}`} className={`shared-register-form-code-box ${codeError ? "error" : ""}`} type="text" inputMode="numeric" maxLength={1} value={code[index]} onChange={(event) => handleCodeInputChange(event, index)} onKeyDown={(event) => handleCodeKeyDown(event, index)} autoFocus={index === 0} />)}
                    </div>
                    {codeError ? <p className="shared-register-form-error">Invalid code</p> : null}
                    <button type="submit" className="shared-register-form-primary-button" disabled={codeLoading || code.join("").length < 6}>{codeLoading ? <span className="shared-register-form-spinner" /> : "Verify code"}</button>
                    <button type="button" className="shared-register-form-secondary-button" onClick={() => setStep(STEPS.EMAIL)}>Use another email</button>
                </form>
            )}

            {step === STEPS.DETAILS && (
                <form id="shared-register-form" className="shared-register-form-section" onSubmit={handleSubmit}>
                    <div className="shared-register-form-copy">
                        <h2>Store details</h2>
                        <p>Finish the main information for your workspace.</p>
                    </div>
                    <div className="shared-register-form-grid">
                        <div className="shared-register-form-field full"><label htmlFor="register-name">Store name</label><input id="register-name" name="name" placeholder="My store" autoComplete="organization" required /></div>
                        <div className="shared-register-form-field full"><label htmlFor="register-email-readonly">Email</label><input id="register-email-readonly" type="email" value={email} disabled /></div>
                        <div className="shared-register-form-field full"><label htmlFor="register-phone">Phone</label><PhoneInput id="register-phone" name="phone" /></div>
                        <div className="shared-register-form-field"><label htmlFor="register-image">Image URL</label><input id="register-image" name="image" type="url" placeholder="https://..." /></div>
                        <div className="shared-register-form-field"><label htmlFor="register-password">Password</label><input id="register-password" name="password" type="password" placeholder="Your password" autoComplete="new-password" minLength={8} required /></div>
                        <div className="shared-register-form-field"><label htmlFor="register-repassword">Repeat password</label><input id="register-repassword" name="repassword" type="password" placeholder="Repeat password" autoComplete="new-password" minLength={8} required /></div>
                    </div>
                    {registerError ? <p className="shared-register-form-error">{registerError}</p> : null}
                    <label className="shared-register-form-check"><input id="tyc" name="terms" type="checkbox" value="accepted" required /><span>I agree to the <a href="/terms">Terms</a> and <a href="/privacy">Privacy Policy</a></span></label>
                    <button type="submit" className="shared-register-form-primary-button" disabled={registerLoading}>{registerLoading ? <span className="shared-register-form-spinner" /> : "Create account"}</button>
                    <button type="button" className="shared-register-form-secondary-button" onClick={() => setStep(STEPS.CODE)}>Back to code</button>
                </form>
            )}
        </div>
    )
}

export default RegisterForm
