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

    // ========================================
    // Navigation
    // ========================================

    const handleNavigation = (path) => {
        navigate(path);

        if (setMobileOpen) {
            setMobileOpen(false);
        }
    };

    // ========================================
    // Logout
    // ========================================

    const handleLogout = () => {
        // Clear local storage
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");

        // Clear session storage
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("isLoggedIn");

        // Go login
        navigate("/login", {
            replace: true,
        });

        if (setMobileOpen) {
            setMobileOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Overlay */}

            {mobileOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() =>
                        setMobileOpen(false)
                    }
                />
            )}

            {/* Sidebar */}

            <aside
                className={`
                    fixed left-0 top-0 z-50
                    flex h-screen w-[250px]
                    flex-col
                    border-r border-[#0879b8]
                    bg-[#071326]
                    transition-transform duration-300
                    lg:translate-x-0
                    ${
                        mobileOpen
                            ? "translate-x-0"
                            : "-translate-x-full"
                    }
                `}
            >

                {/* ==================================
                    Logo
                ================================== */}

                <div className="relative flex h-[72px] items-center border-b border-[#0879b8] px-5">

                    <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#062642]">

                            <div className="text-xl text-[#00a8e8]">
                                ◈
                            </div>

                        </div>

                        <div>

                            <h1 className="text-[17px] font-bold tracking-wide text-white">
                                BAMS
                            </h1>

                            <p className="text-[8px] font-medium tracking-[2px] text-[#aeb9c8]">
                                STAFF PORTAL
                            </p>

                        </div>

                    </div>

                    {/* Mobile Close */}

                    <button
                        type="button"
                        onClick={() =>
                            setMobileOpen(false)
                        }
                        className="ml-auto rounded-md p-1.5 text-[#8c9aaa] hover:bg-[#10223a] hover:text-white lg:hidden"
                    >
                        <X size={19} />
                    </button>

                </div>

                {/* ==================================
                    Main Menu
                ================================== */}

                <nav className="flex-1 px-3 py-5">

                    <p className="mb-3 px-3 text-[9px] font-semibold uppercase tracking-[1.5px] text-[#657489]">
                        Main Menu
                    </p>

                    <div className="space-y-1">

                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            const active =
                                activePage ===
                                item.label;

                            return (
                                <button
                                    key={item.label}
                                    type="button"
                                    onClick={() =>
                                        handleNavigation(
                                            item.path
                                        )
                                    }
                                    className={`
                                        group relative flex w-full
                                        items-center gap-3
                                        rounded-md px-3 py-2.5
                                        text-left
                                        transition-all
                                        ${
                                            active
                                                ? "bg-[#0a3150] text-[#00a8e8]"
                                                : "text-[#9aa8b8] hover:bg-[#0d2037] hover:text-white"
                                        }
                                    `}
                                >

                                    {/* Active Indicator */}

                                    {active && (
                                        <span className="absolute left-0 top-1/2 h-6 w-[3px] -translate-y-1/2 rounded-r bg-[#00a8e8]" />
                                    )}

                                    <Icon
                                        size={15}
                                        strokeWidth={1.8}
                                        className={
                                            active
                                                ? "text-[#00a8e8]"
                                                : "text-[#7f8fa2] group-hover:text-white"
                                        }
                                    />

                                    <span className="text-[11px] font-medium">
                                        {item.label}
                                    </span>

                                </button>
                            );
                        })}

                    </div>

                </nav>

                {/* ==================================
                    Bottom Menu
                ================================== */}

                <div className="border-t border-[#0879b8] px-3 py-4">

                    {/* Support */}

                    <button
                        type="button"
                        onClick={() =>
                            handleNavigation(
                                "/support"
                            )
                        }
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[#8e9dad] transition hover:bg-[#0d2037] hover:text-white"
                    >

                        <Headphones size={15} />

                        <span className="text-[11px]">
                            Support
                        </span>

                    </button>

                    {/* Logout */}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className="mt-1 flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-[#8e9dad] transition hover:bg-[#0d2037] hover:text-red-400"
                    >

                        <LogOut size={15} />

                        <span className="text-[11px]">
                            Logout
                        </span>

                    </button>

                </div>

            </aside>
        </>
    );
}

export default Navbar;