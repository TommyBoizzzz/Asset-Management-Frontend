import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";

function Assets() {
    const navigate = useNavigate();

    return (
        <MainLayout
            activePage="Assets"
            title="Assets"
        >
            <div className="assets-page">

                <div className="assets-header">
                    <div>
                        <h2>Assets</h2>
                        <p>
                            Manage your company assets.
                        </p>
                    </div>

                    <button
                        className="add-asset-btn"
                        onClick={() =>
                            navigate("/assets/create")
                        }
                    >
                        + Add Asset
                    </button>
                </div>

                <div className="assets-card">
                    <h3>Hello 👋</h3>

                    <p>
                        This is your Assets home.
                    </p>
                </div>

            </div>
        </MainLayout>
    );
}

export default Assets;