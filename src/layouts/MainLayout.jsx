import { useState } from "react";
import { Menu } from "lucide-react";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MainLayout({
    children,
    activePage,
    title,
}) {
    const [mobileOpen, setMobileOpen] =
        useState(false);

    return (
        <div className="min-h-screen bg-[#eef2f5]">

            {/* ==================================
                Navigation
            ================================== */}

            <Navbar
                activePage={activePage}
                mobileOpen={mobileOpen}
                setMobileOpen={setMobileOpen}
            />

            {/* ==================================
                Main Area
            ================================== */}

            <div className="min-h-screen lg:ml-[250px]">

                {/* Header */}

                <header className="sticky top-0 z-30 flex h-[62px] items-center justify-between border-b border-[#d9e0e7] bg-[#f7f9fb] px-4 sm:px-6">

                    <div className="flex items-center gap-3">

                        <button
                            type="button"
                            onClick={() =>
                                setMobileOpen(true)
                            }
                            className="rounded-md p-2 text-[#526274] hover:bg-[#e8edf2] lg:hidden"
                        >
                            <Menu size={20} />
                        </button>

                        <h1 className="text-[16px] font-semibold text-[#263445]">
                            {title}
                        </h1>

                    </div>

                </header>

                {/* Page */}

                <main className="min-h-[calc(100vh-62px)]">
                    {children}
                </main>

                {/* Footer */}

                <Footer />

            </div>

        </div>
    );
}

export default MainLayout;