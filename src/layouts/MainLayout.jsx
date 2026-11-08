import { useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import LoadingOverlay from "../components/LoadingOverlay";
import { useTheme } from "../context/useTheme";

import "./MainLayout.css";

function MainLayout({
    children,
    activePage = "Dashboard",
    title = "Dashboard",
}) {
    const [mobileOpen, setMobileOpen] =
        useState(false);
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="main-layout">

            <Navbar
                activePage={activePage}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            <div className="main-layout-content">

                {/* Header */}

                <header className="main-header">

                    <div className="main-header-left">

                        <button
                            type="button"
                            className="mobile-menu-button"
                            onClick={() =>
                                setMobileOpen(true)
                            }
                        >
                            <Menu size={19} />
                        </button>

                        <h1>
                            {title}
                        </h1>

                    </div>

                    <button
                        type="button"
                        className="theme-toggle"
                        onClick={toggleTheme}
                        aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
                    >
                        {theme === "light" ? <Moon size={17} /> : <Sun size={17} />}
                        <span>{theme === "light" ? "Dark mode" : "Light mode"}</span>
                    </button>

                </header>

                {/* Content */}

                <main className="main-content">
                    <LoadingOverlay />
                    {children}
                </main>

                {/* Footer */}

                <Footer />

            </div>

        </div>
    );
}

export default MainLayout;