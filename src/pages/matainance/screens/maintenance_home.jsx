import MainLayout from "../../../layouts/MainLayout";

function MaintenanceHome() {
    return (
        <MainLayout
            activePage="Maintenance"
            title="Maintenance"
        >
            <div className="maintenance-page">

                <div className="maintenance-header">
                    <div>
                        <h2>Maintenance</h2>
                        <p>
                            Manage your company maintenance tasks.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-maintenance-btn"
                    >
                        + Add Maintenance Task      
                    </button>
                </div>

                <div className="maintenance-card">
                    <h3>Hello 👋</h3>

                    <p>
                        This is your Maintenance home.
                    </p>
                </div>

            </div>
        </MainLayout>
    );
}

export default MaintenanceHome;