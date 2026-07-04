import "./PageTitle.css"

type PageTitleProps = {
    title: string
    subtitle?: string | undefined
}

function PageTitle({ title, subtitle }: PageTitleProps) {
    return (
        <div className="shared-page-title">
            <h1>{title}</h1>
            {subtitle ? <h2>{subtitle}</h2> : null}
        </div>
    )
}

export default PageTitle
