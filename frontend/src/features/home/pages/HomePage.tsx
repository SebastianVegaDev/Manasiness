import "./HomePage.css"

import { Link } from "react-router-dom"

import { useAuth } from "@features/auth/hooks/useAuth"

const firstSteps = [
    {
        title: "Categories",
        description: "Create the groups that organize your products.",
        path: "/dashboard/categories",
        action: "Create categories"
    },
    {
        title: "Products",
        description: "Add your products with prices, stock and category.",
        path: "/dashboard/products",
        action: "Create products"
    },
    {
        title: "Users",
        description: "Register the main users connected to your business.",
        path: "/dashboard/users",
        action: "Create users"
    }
]

const dailyAreas = [
    "Sales",
    "Expenses",
    "Pending",
    "Activity"
]

function HomePage() {
    const { store } = useAuth()

    return (
        <div className="home">
            <section className="home-hero">
                <div className="home-hero-left">
                    <p className="home-hero-welcome">Welcome to dashboard!</p>
                    <h1 className="home-hero-title">Build your store step by step</h1>
                    <p className="home-hero-description">
                        Hi, {store?.name || ""}. Start with the base of your business. Create your categories, products and users to begin using Manasiness in a simpler and more organized way.
                    </p>

                    <div className="home-hero-actions">
                        <Link className="home-hero-button" to="/dashboard/categories">Start with categories</Link>
                        <p className="home-hero-note">Recommended first step before registering daily records.</p>
                    </div>

                    <div className="home-daily-strip" aria-label="Daily work areas">
                        {dailyAreas.map((area) => (
                            <span key={area}>{area}</span>
                        ))}
                    </div>
                </div>

                <div className="home-hero-right">
                    <div className="home-steps-header">
                        <p className="home-steps-label">Setup path</p>
                        <h2 className="home-steps-title">Create your main structure</h2>
                    </div>

                    <div className="home-steps-showcase">
                        {firstSteps.map((step, index) => (
                            <div className="home-step-card" key={step.title}>
                                <div className="home-step-card-top">
                                    <p className="home-step-number">0{index + 1}</p>
                                    <h3 className="home-step-title">{step.title}</h3>
                                </div>

                                <div className="home-step-card-bottom">
                                    <p className="home-step-description">{step.description}</p>
                                    <Link className="home-step-link" to={step.path}>{step.action}</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="home-mission">
                <div className="home-mission-left">
                    <p className="home-mission-label">Work rhythm</p>
                    <h2 className="home-mission-title">Simple management for everyday business</h2>
                </div>

                <div className="home-mission-right">
                    <p>Manasiness helps small businesses manage their information in a cleaner, simpler and more organized way. The goal is to give each part of the business its own clear space without making the system feel heavy.</p>
                    <p>Start with the basic setup, continue with your daily records, and keep everything easier to understand. Categories, products and users are the first steps that help organize the rest of the system.</p>
                </div>
            </section>
        </div>
    )
}

export default HomePage
