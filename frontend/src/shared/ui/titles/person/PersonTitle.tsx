import "./PersonTitle.css"

type PersonTitleProps = {
    name: string
    title: string
    sectionTitle: string
}

function PersonTitle({ name, title, sectionTitle }: PersonTitleProps) {
    return (
        <div className="shared-person-title">
            <h2>{sectionTitle}</h2>
            <h1>{title}: {name}</h1>
        </div>
    )
}

export default PersonTitle
