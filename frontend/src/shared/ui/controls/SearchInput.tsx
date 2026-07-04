import "./SearchInput.css"

import { Search } from "lucide-react"

type SearchInputProps = {
    label: string
    placeholder?: string
    value: string
    onChange: (event: { target: { value: string } }) => void
    formClassName?: string
    labelClassName?: string
    barClassName?: string
    iconClassName?: string
    inputClassName?: string
    inputId?: string
    inputName?: string
}

function SearchInput({
    label,
    placeholder = "Search",
    value,
    onChange,
    formClassName = "shared-search-form",
    labelClassName = "shared-search-label",
    barClassName = "shared-searchbar",
    iconClassName = "shared-search-icon",
    inputClassName = "shared-search-input",
    inputId = "shared-search-input",
    inputName = "search"
}: SearchInputProps) {
    return (
        <form className={formClassName} onSubmit={(event) => event.preventDefault()}>
            <label className={labelClassName} htmlFor={inputId}>
                {label}
            </label>

            <div className={barClassName}>
                <Search className={iconClassName} size={20} />

                <input
                    id={inputId}
                    name={inputName}
                    className={inputClassName}
                    type="search"
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    autoComplete="off"
                />
            </div>
        </form>
    )
}

export default SearchInput
