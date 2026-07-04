import "./NotFoundPage.css"

import { useNavigate } from "react-router-dom"

import image404 from "../../../assets/images/404-error.png"

function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <main className="manasiness-notfound-page">
            <h1>Ooops!</h1>

            <img src={image404} alt="404 error" />

            <h2>Page not Found</h2>

            <button
                type="button"
                onClick={() => navigate("/")}
            >
                Back to Home
            </button>
        </main>
    )
}

export default NotFoundPage
