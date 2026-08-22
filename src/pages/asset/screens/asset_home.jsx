import { useNavigate } from "react-router-dom";
import {
    Package,
    CheckCircle,
    Wrench,
    AlertTriangle,
    Search,
    Filter,
    Eye,
    Pencil,
    Trash2,
    Plus,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import "../css/asset_home.css";

function Assets() {
    const navigate = useNavigate();

    const assets = [
        {
            id: 1,
            code: "AST-001",
            name: "Dell Latitude 5420",
            category: "Laptop",
            location: "IT Department",
            status: "Active",
            value: "$1,200",
        },
        {
            id: 2,
            code: "AST-002",
            name: "HP LaserJet Pro",
            category: "Printer",
            location: "Finance Department",
            status: "Active",
            value: "$450",
        },
        {
            id: 3,
            code: "AST-003",
            name: "Office Desk",
            category: "Furniture",
            location: "HR Department",
            status: "Maintenance",
            value: "$280",
        },
        {
            id: 4,
            code: "AST-004",
            name: "MacBook Pro 14",
            category: "Laptop",
            location: "Management",
            status: "Active",
            value: "$2,100",
        },
        {
            id: 5,
            code: "AST-005",
            name: "Samsung Monitor",
            category: "Monitor",
            location: "IT Department",
            status: "Inactive",
            value: "$350",
        },
    ];

    return (
        <MainLayout
            activePage="Assets"
            title="Assets"
        >
            <div className="assets-page">

                {/* Header */}
                <div className="assets-header">
                    <div>
                        <h2>Assets</h2>
                        <p>
                            Manage and track all company assets.
                        </p>
                    </div>

                    <button
                        className="add-asset-btn"
                        onClick={() => navigate("/assets/create")}
                    >
                        <Plus size={19} />
                        Add Asset
                    </button>
                </div>

                {/* Statistics */}
                <div className="asset-stat-grid">

                    <div className="asset-stat-card">
                        <div className="stat-icon blue">
                            <Package size={24} />
                        </div>

                        <div>
                            <span>Total Assets</span>
                            <h3>248</h3>
                        </div>
                    </div>

                    <div className="asset-stat-card">
                        <div className="stat-icon green">
                            <CheckCircle size={24} />
                        </div>

                        <div>
                            <span>Active Assets</span>
                            <h3>216</h3>
                        </div>
                    </div>

                    <div className="asset-stat-card">
                        <div className="stat-icon orange">
                            <Wrench size={24} />
                        </div>

                        <div>
                            <span>Maintenance</span>
                            <h3>18</h3>
                        </div>
                    </div>

                    <div className="asset-stat-card">
                        <div className="stat-icon red">
                            <AlertTriangle size={24} />
                        </div>

                        <div>
                            <span>Inactive</span>
                            <h3>14</h3>
                        </div>
                    </div>

                </div>

                {/* Asset Table Card */}
                <div className="assets-table-card">

                    <div className="table-top">

                        <div>
                            <h3>All Assets</h3>
                            <p>View and manage your company assets.</p>
                        </div>

                        <div className="table-actions">

                            <div className="search-box">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Search assets..."
                                />
                            </div>

                            <button className="filter-btn">
                                <Filter size={17} />
                                Filter
                            </button>

                        </div>

                    </div>

                    <div className="table-wrapper">
                        <table className="assets-table">

                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Category</th>
                                    <th>Location</th>
                                    <th>Status</th>
                                    <th>Value</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {assets.map((asset) => (
                                    <tr key={asset.id}>

                                        <td>
                                            <div className="asset-name">

                                                <div className="asset-avatar">
                                                    <Package size={19} />
                                                </div>

                                                <div>
                                                    <strong>
                                                        {asset.name}
                                                    </strong>

                                                    <span>
                                                        {asset.code}
                                                    </span>
                                                </div>

                                            </div>
                                        </td>

                                        <td>
                                            <span className="category-text">
                                                {asset.category}
                                            </span>
                                        </td>

                                        <td>
                                            {asset.location}
                                        </td>

                                        <td>
                                            <span
                                                className={`status-badge ${asset.status
                                                    .toLowerCase()
                                                    .replace(" ", "-")}`}
                                            >
                                                {asset.status}
                                            </span>
                                        </td>

                                        <td>
                                            <strong className="asset-value">
                                                {asset.value}
                                            </strong>
                                        </td>

                                        <td>

                                            <div className="action-buttons">

                                                <button
                                                    className="action-btn view"
                                                    title="View"
                                                >
                                                    <Eye size={17} />
                                                </button>

                                                <button
                                                    className="action-btn edit"
                                                    title="Edit"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    className="action-btn delete"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={17} />
                                                </button>

                                            </div>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="table-footer">

                        <span>
                            Showing <strong>1–5</strong> of{" "}
                            <strong>248</strong> assets
                        </span>

                        <div className="pagination">
                            <button disabled>Previous</button>
                            <button className="active">1</button>
                            <button>2</button>
                            <button>3</button>
                            <button>4</button>
                            <button>Next</button>
                        </div>

                    </div>

                </div>

            </div>
        </MainLayout>
    );
}

export default Assets;