import MainLayout from "../../../layouts/MainLayout";
import "../css/Dashboard.css";

function Dashboard() {
    return (
        <MainLayout
            activePage="Dashboard"
            title="Dashboard"
        >
            <div className="dashboard-page">

                {/* Welcome */}
                <div className="dashboard-welcome">
                    <h2>Welcome back 👋</h2>
                    <p>
                        Here's what's happening with your assets today.
                    </p>
                </div>

                {/* Statistics */}
                <div className="dashboard-stats">

                    <div className="stat-card">
                        <div className="stat-content">
                            <span className="stat-label">
                                Total Assets
                            </span>

                            <h3>1,248</h3>

                            <span className="stat-change positive">
                                ↑ 12.5% from last month
                            </span>
                        </div>

                        <div className="stat-icon blue">
                            📦
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <span className="stat-label">
                                Available
                            </span>

                            <h3>856</h3>

                            <span className="stat-description">
                                Ready for assignment
                            </span>
                        </div>

                        <div className="stat-icon green">
                            ✓
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <span className="stat-label">
                                Assigned
                            </span>

                            <h3>342</h3>

                            <span className="stat-description">
                                Currently in use
                            </span>
                        </div>

                        <div className="stat-icon purple">
                            👤
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-content">
                            <span className="stat-label">
                                Maintenance
                            </span>

                            <h3>50</h3>

                            <span className="stat-change warning">
                                Requires attention
                            </span>
                        </div>

                        <div className="stat-icon orange">
                            🔧
                        </div>
                    </div>

                </div>

                {/* Main Content */}
                <div className="dashboard-content">

                    {/* Recent Assets */}
                    <section className="dashboard-card assets-card">

                        <div className="card-header">
                            <div>
                                <h3>Recent Assets</h3>
                                <p>
                                    Recently added or updated assets
                                </p>
                            </div>

                            <button className="view-all-btn">
                                View All
                            </button>
                        </div>

                        <div className="table-container">
                            <table className="assets-table">
                                <thead>
                                    <tr>
                                        <th>Asset</th>
                                        <th>Category</th>
                                        <th>Status</th>
                                        <th>Location</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    <tr>
                                        <td>
                                            <div className="asset-details">
                                                <strong>
                                                    MacBook Pro 14"
                                                </strong>

                                                <span>
                                                    AST-00124
                                                </span>
                                            </div>
                                        </td>

                                        <td>Laptop</td>

                                        <td>
                                            <span className="status available">
                                                Available
                                            </span>
                                        </td>

                                        <td>Phnom Penh</td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className="asset-details">
                                                <strong>
                                                    Dell Monitor 27"
                                                </strong>

                                                <span>
                                                    AST-00123
                                                </span>
                                            </div>
                                        </td>

                                        <td>Monitor</td>

                                        <td>
                                            <span className="status assigned">
                                                Assigned
                                            </span>
                                        </td>

                                        <td>Office A</td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className="asset-details">
                                                <strong>
                                                    iPhone 15 Pro
                                                </strong>

                                                <span>
                                                    AST-00122
                                                </span>
                                            </div>
                                        </td>

                                        <td>Mobile</td>

                                        <td>
                                            <span className="status maintenance">
                                                Maintenance
                                            </span>
                                        </td>

                                        <td>Service Center</td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <div className="asset-details">
                                                <strong>
                                                    HP LaserJet
                                                </strong>

                                                <span>
                                                    AST-00121
                                                </span>
                                            </div>
                                        </td>

                                        <td>Printer</td>

                                        <td>
                                            <span className="status available">
                                                Available
                                            </span>
                                        </td>

                                        <td>Office B</td>
                                    </tr>

                                </tbody>
                            </table>
                        </div>

                    </section>

                    {/* Quick Actions */}
                    <section className="dashboard-card actions-card">

                        <div className="card-header">
                            <div>
                                <h3>Quick Actions</h3>
                                <p>
                                    Manage your assets quickly
                                </p>
                            </div>
                        </div>

                        <div className="quick-actions">

                            <button className="quick-action blue">
                                <span className="action-icon">
                                    +
                                </span>

                                <span className="action-text">
                                    <strong>
                                        Add Asset
                                    </strong>

                                    <small>
                                        Register a new asset
                                    </small>
                                </span>
                            </button>

                            <button className="quick-action green">
                                <span className="action-icon">
                                    ↗
                                </span>

                                <span className="action-text">
                                    <strong>
                                        Assign Asset
                                    </strong>

                                    <small>
                                        Assign asset to employee
                                    </small>
                                </span>
                            </button>

                            <button className="quick-action purple">
                                <span className="action-icon">
                                    📊
                                </span>

                                <span className="action-text">
                                    <strong>
                                        View Reports
                                    </strong>

                                    <small>
                                        Check asset reports
                                    </small>
                                </span>
                            </button>

                        </div>

                    </section>

                </div>

                {/* Bottom Summary */}
                <div className="summary-grid">

                    <div className="summary-card">
                        <span className="summary-label">
                            Asset Value
                        </span>

                        <strong>
                            $428,560
                        </strong>

                        <small className="positive">
                            ↑ 8.2% this month
                        </small>
                    </div>

                    <div className="summary-card">
                        <span className="summary-label">
                            Pending Requests
                        </span>

                        <strong>
                            18
                        </strong>

                        <small className="warning">
                            Need review
                        </small>
                    </div>

                    <div className="summary-card">
                        <span className="summary-label">
                            Retired Assets
                        </span>

                        <strong>
                            32
                        </strong>

                        <small>
                            This year
                        </small>
                    </div>

                </div>

            </div>
        </MainLayout>
    );
}

export default Dashboard;