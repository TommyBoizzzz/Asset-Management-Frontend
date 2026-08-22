import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";
import "../css/staff_home.css";

function StaffHome() {
    const navigate = useNavigate();

    return (
        <MainLayout
            activePage="Staff"
            title="Staff"
        >
            <div className="staff-page">

                {/* ================= HEADER ================= */}
                <div className="staff-header">
                    <div>
                        <h2>Staff</h2>
                        <p>
                            Manage your company staff members and their access.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-staff-btn"
                        onClick={() => navigate("/staff/create")}
                    >
                        <span>+</span>
                        Add Staff
                    </button>
                </div>

                {/* ================= STATS ================= */}
                <div className="staff-stats">

                    <div className="staff-stat-card">
                        <div className="stat-icon blue">
                            👥
                        </div>

                        <div className="stat-content">
                            <span>Total Staff</span>
                            <strong>128</strong>
                            <small>All staff members</small>
                        </div>
                    </div>

                    <div className="staff-stat-card">
                        <div className="stat-icon green">
                            ✓
                        </div>

                        <div className="stat-content">
                            <span>Active Staff</span>
                            <strong>116</strong>
                            <small>Currently active</small>
                        </div>
                    </div>

                    <div className="staff-stat-card">
                        <div className="stat-icon orange">
                            ◷
                        </div>

                        <div className="stat-content">
                            <span>Pending</span>
                            <strong>8</strong>
                            <small>Waiting for activation</small>
                        </div>
                    </div>

                    <div className="staff-stat-card">
                        <div className="stat-icon purple">
                            🔐
                        </div>

                        <div className="stat-content">
                            <span>Administrators</span>
                            <strong>4</strong>
                            <small>System administrators</small>
                        </div>
                    </div>

                </div>

                {/* ================= MAIN CARD ================= */}
                <div className="staff-main-card">

                    <div className="staff-card-header">

                        <div>
                            <h3>Staff Members</h3>
                            <p>
                                View and manage your company's staff.
                            </p>
                        </div>

                        <div className="staff-actions">

                            <div className="staff-search">
                                <span>⌕</span>

                                <input
                                    type="text"
                                    placeholder="Search staff..."
                                />
                            </div>

                            <button
                                type="button"
                                className="filter-btn"
                            >
                                ☰
                                <span>Filter</span>
                            </button>

                        </div>

                    </div>

                    {/* ================= TABLE ================= */}
                    <div className="staff-table-wrapper">

                        <table className="staff-table">

                            <thead>
                                <tr>
                                    <th>STAFF</th>
                                    <th>DEPARTMENT</th>
                                    <th>POSITION</th>
                                    <th>ROLE</th>
                                    <th>STATUS</th>
                                    <th></th>
                                </tr>
                            </thead>

                            <tbody>

                                <tr>
                                    <td>
                                        <div className="staff-user">
                                            <div className="avatar avatar-blue">
                                                JS
                                            </div>

                                            <div>
                                                <strong>John Smith</strong>
                                                <span>
                                                    john@company.com
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>IT Department</td>

                                    <td>Software Developer</td>

                                    <td>
                                        <span className="role-badge manager">
                                            Manager
                                        </span>
                                    </td>

                                    <td>
                                        <span className="status-badge active">
                                            <i></i>
                                            Active
                                        </span>
                                    </td>

                                    <td>
                                        <button className="more-btn">
                                            •••
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="staff-user">
                                            <div className="avatar avatar-purple">
                                                SM
                                            </div>

                                            <div>
                                                <strong>Sarah Miller</strong>
                                                <span>
                                                    sarah@company.com
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Human Resources</td>

                                    <td>HR Specialist</td>

                                    <td>
                                        <span className="role-badge staff">
                                            Staff
                                        </span>
                                    </td>

                                    <td>
                                        <span className="status-badge active">
                                            <i></i>
                                            Active
                                        </span>
                                    </td>

                                    <td>
                                        <button className="more-btn">
                                            •••
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="staff-user">
                                            <div className="avatar avatar-orange">
                                                DW
                                            </div>

                                            <div>
                                                <strong>David Wilson</strong>
                                                <span>
                                                    david@company.com
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Finance</td>

                                    <td>Accountant</td>

                                    <td>
                                        <span className="role-badge viewer">
                                            Viewer
                                        </span>
                                    </td>

                                    <td>
                                        <span className="status-badge pending">
                                            <i></i>
                                            Pending
                                        </span>
                                    </td>

                                    <td>
                                        <button className="more-btn">
                                            •••
                                        </button>
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <div className="staff-user">
                                            <div className="avatar avatar-green">
                                                LK
                                            </div>

                                            <div>
                                                <strong>Lisa Kim</strong>
                                                <span>
                                                    lisa@company.com
                                                </span>
                                            </div>
                                        </div>
                                    </td>

                                    <td>Operations</td>

                                    <td>Operations Manager</td>

                                    <td>
                                        <span className="role-badge admin">
                                            Admin
                                        </span>
                                    </td>

                                    <td>
                                        <span className="status-badge active">
                                            <i></i>
                                            Active
                                        </span>
                                    </td>

                                    <td>
                                        <button className="more-btn">
                                            •••
                                        </button>
                                    </td>
                                </tr>

                            </tbody>

                        </table>

                    </div>

                    {/* ================= FOOTER ================= */}
                    <div className="staff-table-footer">

                        <span>
                            Showing <strong>1–4</strong> of <strong>128</strong> staff
                        </span>

                        <div className="pagination">
                            <button disabled>‹</button>
                            <button className="current">1</button>
                            <button>2</button>
                            <button>3</button>
                            <span>...</span>
                            <button>32</button>
                            <button>›</button>
                        </div>

                    </div>

                </div>

            </div>
        </MainLayout>
    );
}

export default StaffHome;