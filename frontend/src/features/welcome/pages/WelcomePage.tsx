import "./WelcomePage.css"

import { Link } from "react-router-dom"

import Logotipo from "../../../assets/images/Logotipo.png"

function WelcomePage() {
    return (
        <main className="welcome-page">
            <section className="welcome-page-card">
                <img
                    className="welcome-page-logo"
                    src={Logotipo}
                    alt="Manasiness"
                />

                <div className="welcome-page-content">
                    <h1>Manasiness</h1>
                    <p>
                        Manage your catalog, sales, purchases, staff payments,
                        pending records and financial reports from one dashboard.
                    </p>
                </div>

                <div className="welcome-page-actions">
                    <Link to="/login">Sign in</Link>
                    <Link to="/register">Create account</Link>
                </div>
            </section>
        </main>
    )
}

export default WelcomePage
