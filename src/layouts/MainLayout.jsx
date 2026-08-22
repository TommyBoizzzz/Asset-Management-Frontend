import { useState } from "react";
import { Menu } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import "./MainLayout.css";

function MainLayout({
    children,
    activePage = "Dashboard",
    title = "Dashboard",
}) {
    const [mobileOpen, setMobileOpen] =
        useState(false);

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

                </header>

                {/* Content */}

                <main className="main-content">
                    {children}
                </main>

                {/* Footer */}

                <Footer />

            </div>

        </div>
    );
}

export default MainLayout;