import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../../layouts/MainLayout";
import AssetService from "../../asset/services/AssetService";
import AssetAssignmentService from "../../assign_asset/services/Assetassignmentservice";
import MaintenanceService from "../../matainance/services/MaintenanceService";
import {
    isActiveAssignment,
    normalizeAssetStatus,
} from "../../../utils/assetLifecycle";
import "../css/Dashboard.css";

const isStatus = (value, status) =>
    String(value ?? "").toLowerCase() === status.toLowerCase();

const getAssetStatus = (asset, activeAssetIds) => {
    const assetStatus = normalizeAssetStatus(asset.status);

    if (assetStatus === "Damaged" || assetStatus === "Retired") {
        return {
            label: assetStatus,
            className: assetStatus.toLowerCase(),
        };
    }

    if (assetStatus === "Under Maintenance") {
        return { label: "Under Maintenance", className: "maintenance" };
    }

    if (
        assetStatus === "Assigned" ||
        activeAssetIds.has(String(asset.id))
    ) {
        return { label: "Assigned", className: "assigned" };
    }

    if (assetStatus === "Available") {
        return { label: "Available", className: "available" };
    }

    return {
        label: asset.status || "Unknown",
        className: isStatus(asset.status, "inactive") ? "inactive" : "",
    };
};

const formatCurrency = (value) =>
    new Intl.NumberFormat(undefined, {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    }).format(value);

function Dashboard() {
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [maintenanceRecords, setMaintenanceRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        let isMounted = true;

        const loadDashboardData = async () => {
            try {
                const [assetResponse, assignmentResponse, maintenanceResponse] =
                    await Promise.all([
                        AssetService.getAll(),
                        AssetAssignmentService.getAll(),
                        MaintenanceService.getAll(),
                    ]);

                if (
                    !Array.isArray(assetResponse.data) ||
                    !Array.isArray(assignmentResponse.data) ||
                    !Array.isArray(maintenanceResponse.data)
                ) {
                    throw new Error("The server returned an invalid dashboard response.");
                }

                if (isMounted) {
                    setAssets(assetResponse.data);
                    setAssignments(assignmentResponse.data);
                    setMaintenanceRecords(maintenanceResponse.data);
                }
            } catch (error) {
                console.error("Failed to load dashboard data:", error);
                if (isMounted) {
                    setErrorMessage(
                        error.response?.data?.message ||
                        error.message ||
                        "Unable to load dashboard data. Please try again."
                    );
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        loadDashboardData();

        return () => {
            isMounted = false;
        };
    }, []);

    const activeAssignments = useMemo(
        () => assignments.filter(isActiveAssignment),
        [assignments]
    );

    const activeAssetIds = useMemo(
        () =>
            new Set(
                activeAssignments
                    .map((assignment) => assignment.asset?.id)
                    .filter((id) => id !== undefined && id !== null)
                    .map(String)
            ),
        [activeAssignments]
    );

    const sortedAssets = useMemo(
        () =>
            [...assets].sort((a, b) => {
                const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
                const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();

                if (Number.isFinite(dateA) && Number.isFinite(dateB) && dateA !== dateB) {
                    return dateB - dateA;
                }

                return Number(b.id || 0) - Number(a.id || 0);
            }),
        [assets]
    );

    const availableCount = assets.filter(
        (asset) =>
            normalizeAssetStatus(asset.status) === "Available" &&
            !activeAssetIds.has(String(asset.id))
    ).length;
    const assignedCount = new Set([
        ...activeAssetIds,
        ...assets
            .filter((asset) => normalizeAssetStatus(asset.status) === "Assigned")
            .map((asset) => String(asset.id)),
    ]).size;
    const maintenanceCount = assets.filter((asset) =>
        normalizeAssetStatus(asset.status) === "Under Maintenance"
    ).length;
    const damagedCount = assets.filter(
        (asset) => normalizeAssetStatus(asset.status) === "Damaged"
    ).length;
    const today = new Date().toISOString().slice(0, 10);
    const upcomingMaintenanceCount = maintenanceRecords.filter(
        (record) =>
            isStatus(record.status, "scheduled") &&
            record.scheduledDate &&
            record.scheduledDate >= today
    ).length;
    const activeMaintenanceCount = maintenanceRecords.filter(
        (record) =>
            !isStatus(record.status, "completed") &&
            !isStatus(record.status, "cancelled") &&
            !isStatus(record.status, "canceled")
    ).length;
    const totalAssetValue = assets.reduce(
        (total, asset) => total + (Number(asset.purchasePrice) || 0),
        0
    );

    const statCards = [
        {
            label: "Total Assets",
            value: assets.length,
            description: "Registered assets",
            icon: "📦",
            color: "blue",
        },
        {
            label: "Available",
            value: availableCount,
            description: "Ready for assignment",
            icon: "✓",
            color: "green",
        },
        {
            label: "Assigned",
            value: assignedCount,
            description: "Currently in use",
            icon: "👤",
            color: "purple",
        },
        {
            label: "Under Maintenance",
            value: maintenanceCount,
            description: "Assets requiring attention",
            icon: "🔧",
            color: "orange",
        },
        {
            label: "Damaged",
            value: damagedCount,
            description: "Assets marked unusable",
            icon: "⚠",
            color: "red",
        },
        {
            label: "Upcoming Maintenance",
            value: upcomingMaintenanceCount,
            description: "Scheduled from today onward",
            icon: "🗓",
            color: "blue",
        },
    ];

    return (
        <MainLayout activePage="Dashboard" title="Dashboard">
            <div className="dashboard-page">
                <div className="dashboard-welcome">
                    <h2>Welcome back 👋</h2>
                    <p>Here&apos;s what&apos;s happening with your assets today.</p>
                </div>

                {errorMessage && (
                    <div className="dashboard-error" role="alert">
                        {errorMessage}
                    </div>
                )}

                <div className="dashboard-stats">
                    {statCards.map((card) => (
                        <div className="stat-card" key={card.label}>
                            <div className="stat-content">
                                <span className="stat-label">{card.label}</span>
                                <h3>
                                    {loading || errorMessage ? "—" : card.value.toLocaleString()}
                                </h3>
                                <span className="stat-description">{card.description}</span>
                            </div>
                            <div className={`stat-icon ${card.color}`}>{card.icon}</div>
                        </div>
                    ))}
                </div>

                <div className="dashboard-content">
                    <section className="dashboard-card assets-card">
                        <div className="card-header">
                            <div>
                                <h3>Recent Assets</h3>
                                <p>Recently added or updated assets</p>
                            </div>
                            <button
                                type="button"
                                className="view-all-btn"
                                onClick={() => navigate("/assets")}
                            >
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
                                    {loading ? (
                                        <tr>
                                            <td className="dashboard-table-message" colSpan="4">
                                                Loading assets…
                                            </td>
                                        </tr>
                                    ) : sortedAssets.length === 0 ? (
                                        <tr>
                                            <td className="dashboard-table-message" colSpan="4">
                                                {errorMessage ? "Assets could not be loaded." : "No assets found."}
                                            </td>
                                        </tr>
                                    ) : (
                                        sortedAssets.slice(0, 5).map((asset) => {
                                            const status = getAssetStatus(asset, activeAssetIds);

                                            return (
                                                <tr key={asset.id}>
                                                    <td>
                                                        <div className="asset-details">
                                                            <strong>{asset.name || "Unnamed asset"}</strong>
                                                            <span>{asset.assetCode || "—"}</span>
                                                        </div>
                                                    </td>
                                                    <td>{asset.category?.name || "—"}</td>
                                                    <td>
                                                        <span className={`status ${status.className}`}>
                                                            {status.label}
                                                        </span>
                                                    </td>
                                                    <td>{asset.location || "—"}</td>
                                                </tr>
                                            );
                                        })
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section className="dashboard-card actions-card">
                        <div className="card-header">
                            <div>
                                <h3>Quick Actions</h3>
                                <p>Manage your assets quickly</p>
                            </div>
                        </div>

                        <div className="quick-actions">
                            <button
                                type="button"
                                className="quick-action blue"
                                onClick={() => navigate("/assets")}
                            >
                                <span className="action-icon">+</span>
                                <span className="action-text">
                                    <strong>Add Asset</strong>
                                    <small>Register a new asset</small>
                                </span>
                            </button>
                            <button
                                type="button"
                                className="quick-action green"
                                onClick={() => navigate("/assign-assets")}
                            >
                                <span className="action-icon">↗</span>
                                <span className="action-text">
                                    <strong>Assign Asset</strong>
                                    <small>Assign asset to employee</small>
                                </span>
                            </button>
                            <button
                                type="button"
                                className="quick-action purple"
                                onClick={() => navigate("/history")}
                            >
                                <span className="action-icon">📊</span>
                                <span className="action-text">
                                    <strong>View History</strong>
                                    <small>Review asset activity</small>
                                </span>
                            </button>
                        </div>
                    </section>
                </div>

                <div className="summary-grid">
                    <div className="summary-card">
                        <span className="summary-label">Total Asset Value</span>
                        <strong>
                            {loading || errorMessage ? "—" : formatCurrency(totalAssetValue)}
                        </strong>
                        <small>Based on recorded purchase prices</small>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Active Assignments</span>
                        <strong>
                            {loading || errorMessage
                                ? "—"
                                : activeAssignments.length.toLocaleString()}
                        </strong>
                        <small>Assets currently assigned to staff</small>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Open Maintenance</span>
                        <strong>
                            {loading || errorMessage
                                ? "—"
                                : activeMaintenanceCount.toLocaleString()}
                        </strong>
                        <small>Maintenance records not completed</small>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

export default Dashboard;
