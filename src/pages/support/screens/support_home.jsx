import MainLayout from "../../../layouts/MainLayout";
import { Headphones, Clock3, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import "../css/support_home.css";

function SupportHome() {
    const navigate = useNavigate();

    return (
        <MainLayout
            activePage="Support"
            title="Support"
        >
            <div className="support-page">

                {/* Coming Soon Card */}
                <div className="support-coming-card">

                    <div className="support-icon">
                        <Headphones size={42} strokeWidth={1.6} />
                    </div>

                    <div className="support-content">

                        <span className="support-badge">
                            <Clock3 size={14} />
                            Coming Soon
                        </span>

                        <h1>
                            Support Center
                        </h1>

                        <p>
                            Our support center is currently under
                            development. Soon you'll be able to get
                            help, contact our team, and find useful
                            resources here.
                        </p>

                        <button
                            type="button"
                            className="support-back-btn"
                            onClick={() => navigate("/dashboard")}
                        >
                            <ArrowLeft size={17} />
                            Back to Dashboard
                        </button>

                    </div>

                </div>

            </div>
        </MainLayout>
    );
}

export default SupportHome;