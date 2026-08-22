import "./Footer.css";

function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="app-footer">

            <div className="app-footer-left">
                <span>
                    © {year} BAMS Staff Portal
                </span>

                <span className="app-footer-dot">
                    •
                </span>

                <span>
                    Business Asset Management System
                </span>
            </div>

            <div className="app-footer-links">

                <button type="button">
                    Privacy Policy
                </button>

                <button type="button">
                    Terms
                </button>

                <button type="button">
                    Help & Support
                </button>

            </div>

        </footer>
    );
}

export default Footer;