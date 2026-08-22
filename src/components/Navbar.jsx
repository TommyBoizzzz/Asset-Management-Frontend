import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Users,
    Wrench,
    History,
    Settings,
    Headphones,
    LogOut,
    X,
} from "lucide-react";

import "./Navbar.css";

function Navbar({
    activePage = "Dashboard",
    mobileOpen,
    setMobileOpen,
}) {
    const navigate = useNavigate();

    const menuItems = [
        {
            label: "Dashboard",
            icon: LayoutDashboard,
            path: "/dashboard",
        },
        {
            label: "Assets",
            icon: Package,
            path: "/assets",
        },
        {
            label: "Staff",
            icon: Users,
            path: "/staff",
        },
        {
            label: "Maintenance",
            icon: Wrench,
            path: "/maintenance",
        },
        {
            label: "History",
            icon: History,
            path: "/history",
        },
        {
            label: "Settings",
            icon: Settings,
            path: "/settings",
        },
    ];

    const handleNavigation = (path) => {
        navigate(path);

        if (setMobileOpen) {
            setMobileOpen(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");

        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isLoggedIn");

        navigate("/login", {
            replace: true,
        });

        if (setMobileOpen) {
            setMobileOpen(false);
        }
    };

    return (
        <>
            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="navbar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            <aside
                className={`navbar-sidebar ${
                    mobileOpen ? "navbar-sidebar-open" : ""
                }`}
            >
                {/* Logo */}
                <div className="navbar-brand">

                    <div className="navbar-brand-logo">
                        ◈
                    </div>

                    <div className="navbar-brand-info">
                        <h1>BAMS</h1>
                        <p>STAFF PORTAL</p>
                    </div>

                    <button
                        className="navbar-mobile-close"
                        onClick={() => setMobileOpen(false)}
                    >
                        <X size={19} />
                    </button>

                </div>

                {/* Menu */}
                <nav className="navbar-menu">

                    <div className="navbar-section-title">
                        MAIN MENU
                    </div>

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        const isActive =
                            activePage === item.label;

                        return (
                            <button
                                key={item.label}
                                type="button"
                                className={`navbar-menu-item ${
                                    isActive
                                        ? "navbar-menu-item-active"
                                        : ""
                                }`}
                                onClick={() =>
                                    handleNavigation(
                                        item.path
                                    )
                                }
                            >
                                {isActive && (
                                    <span className="navbar-active-line" />
                                )}

                                <Icon
                                    size={16}
                                    strokeWidth={1.8}
                                />

                                <span>
                                    {item.label}
                                </span>
                            </button>
                        );
                    })}

                </nav>

                {/* Bottom */}
                <div className="navbar-bottom">

                    <button
                        type="button"
                        className="navbar-bottom-item"
                        onClick={() =>
                            handleNavigation("/support")
                        }
                    >
                        <Headphones size={16} />
                        <span>Support</span>
                    </button>

                    <button
                        type="button"
                        className="navbar-bottom-item navbar-logout"
                        onClick={handleLogout}
                    >
                        <LogOut size={16} />
                        <span>Logout</span>
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Navbar;