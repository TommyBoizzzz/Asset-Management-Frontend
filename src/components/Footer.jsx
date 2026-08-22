function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-[#dce2e8] bg-white px-6 py-4">

            <div className="flex flex-col items-center justify-between gap-2 text-[10px] text-[#7b8794] sm:flex-row">

                <p>
                    © {year} BAMS Staff Portal.
                    All rights reserved.
                </p>

                <div className="flex items-center gap-5">

                    <button
                        type="button"
                        className="transition hover:text-[#008fd1]"
                    >
                        Privacy Policy
                    </button>

                    <button
                        type="button"
                        className="transition hover:text-[#008fd1]"
                    >
                        Terms
                    </button>

                    <button
                        type="button"
                        className="transition hover:text-[#008fd1]"
                    >
                        Help & Support
                    </button>

                </div>

            </div>

        </footer>
    );
}

export default Footer;