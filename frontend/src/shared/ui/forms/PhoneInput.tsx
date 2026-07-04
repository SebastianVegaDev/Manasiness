import {
    useEffect,
    useState
} from "react"

import {
    PHONE_COUNTRY_OPTIONS,
    buildPhoneValue,
    formatPhoneDigits,
    getOnlyDigits,
    getPhoneCountry,
    getPhoneDigits
} from "@shared/utils/phone"

import "./PhoneInput.css"

import type { ChangeEvent } from "react"

type PhoneInputProps = {
    id: string
    name: string
    defaultValue?: string | undefined
    required?: boolean | undefined
    disabled?: boolean | undefined
    placeholder?: string | undefined
}

function PhoneInput({
    id,
    name,
    defaultValue = "",
    required = false,
    disabled = false,
    placeholder = ""
}: PhoneInputProps) {
    const initialCountry = getPhoneCountry(defaultValue)

    const [countryValue, setCountryValue] = useState<string>(initialCountry.value)
    const [phoneNumber, setPhoneNumber] = useState<string>(() => {
        return formatPhoneDigits(
            getPhoneDigits(defaultValue, initialCountry.value),
            initialCountry
        )
    })

    const country = getPhoneCountry(countryValue)
    const phoneValue = buildPhoneValue(country.value, phoneNumber)

    useEffect(() => {
        const nextCountry = getPhoneCountry(defaultValue)

        setCountryValue(nextCountry.value)
        setPhoneNumber(
            formatPhoneDigits(
                getPhoneDigits(defaultValue, nextCountry.value),
                nextCountry
            )
        )
    }, [defaultValue])

    function handleCountryChange(event: ChangeEvent<HTMLSelectElement>): void {
        const nextCountry = getPhoneCountry(event.target.value)
        const cleanDigits = getOnlyDigits(phoneNumber).slice(0, nextCountry.digits)

        setCountryValue(nextCountry.value)
        setPhoneNumber(formatPhoneDigits(cleanDigits, nextCountry))
    }

    function handlePhoneChange(event: ChangeEvent<HTMLInputElement>): void {
        const cleanDigits = getOnlyDigits(event.target.value).slice(0, country.digits)
        setPhoneNumber(formatPhoneDigits(cleanDigits, country))
    }

    return (
        <div className="shared-phone-input">
            <select
                value={countryValue}
                onChange={handleCountryChange}
                disabled={disabled}
                aria-label="Phone country code"
            >
                {PHONE_COUNTRY_OPTIONS.map((item) => (
                    <option key={item.value} value={item.value}>
                        {item.label} {item.value}
                    </option>
                ))}
            </select>

            <input
                id={id}
                type="tel"
                value={phoneNumber}
                onChange={handlePhoneChange}
                placeholder={placeholder || country.placeholder}
                inputMode="numeric"
                autoComplete="tel"
                required={required}
                disabled={disabled}
            />

            <input
                type="hidden"
                name={name}
                value={phoneValue}
                readOnly
            />
        </div>
    )
}

export default PhoneInput
