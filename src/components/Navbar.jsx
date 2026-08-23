import { useNavigate } from "react-router-dom";
import {
    LayoutDashboard,
    Package,
    Users,
    UserPlus,
    PackageCheck,
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
            label: "Assign Users",
            icon: UserPlus,
            path: "/user-home",
        },
        {
            label: "Assign Assets",
            icon: PackageCheck,
            path: "/assign-assets",
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
            {/* =========================
                MOBILE OVERLAY
            ========================= */}
            {mobileOpen && (
                <div
                    className="navbar-overlay"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* =========================
                SIDEBAR
            ========================= */}
            <aside
                className={`navbar-sidebar ${
                    mobileOpen
                        ? "navbar-sidebar-open"
                        : ""
                }`}
            >

                {/* =========================
                    LOGO / BRAND
                ========================= */}
                <div className="navbar-brand">

                    <div className="navbar-brand-logo">
                        ◈
                    </div>

                    <div className="navbar-brand-info">
                        <h1>BAMS</h1>
                        <p>STAFF PORTAL</p>
                    </div>

                    {/* Mobile Close */}
                    <button
                        type="button"
                        className="navbar-mobile-close"
                        onClick={() =>
                            setMobileOpen(false)
                        }
                        aria-label="Close menu"
                    >
                        <X size={19} />
                    </button>

                </div>

                {/* =========================
                    MAIN MENU
                ========================= */}
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

                                {/* Active indicator */}
                                {isActive && (
                                    <span className="navbar-active-line" />
                                )}

                                {/* Tab Icon */}
                                <Icon
                                    size={17}
                                    strokeWidth={1.8}
                                />

                                {/* Tab Label */}
                                <span>
                                    {item.label}
                                </span>

                            </button>
                        );
                    })}

                </nav>

                {/* =========================
                    BOTTOM MENU
                ========================= */}
                <div className="navbar-bottom">

                    {/* Support */}
                    <button
                        type="button"
                        className="navbar-bottom-item"
                        onClick={() =>
                            handleNavigation("/support")
                        }
                    >
                        <Headphones
                            size={17}
                            strokeWidth={1.8}
                        />

                        <span>
                            Support
                        </span>
                    </button>

                    {/* Logout */}
                    <button
                        type="button"
                        className="navbar-bottom-item navbar-logout"
                        onClick={handleLogout}
                    >
                        <LogOut
                            size={17}
                            strokeWidth={1.8}
                        />

                        <span>
                            Logout
                        </span>
                    </button>

                </div>

            </aside>
        </>
    );
}

export default Navbar;