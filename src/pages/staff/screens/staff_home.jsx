import MainLayout from "../../../layouts/MainLayout";

function StaffHome() {
    return (
        <MainLayout
            activePage="Staff"
            title="Staff"
        >
            <div className="staff-page">

                <div className="staff-header">
                    <div>
                        <h2>Staff</h2>
                        <p>
                            Manage your company staff members.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-staff-btn"
                    >
                        + Add Staff
                    </button>
                </div>

                <div className="staff-card">
                    <h3>Hello 👋</h3>

                    <p>
                        This is your Staff home.
                    </p>
                </div>

            </div>
        </MainLayout>
    );
}

export default StaffHome;