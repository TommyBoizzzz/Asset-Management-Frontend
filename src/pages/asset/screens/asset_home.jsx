import { useEffect, useState } from "react";
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
    X,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import "../css/asset_home.css";

function Assets() {
    const navigate = useNavigate();

    const defaultAssets = [
        {
            id: 1,
            code: "AST-001",
            name: "Dell Latitude 5420",
            category: "Laptop",
            location: "IT Department",
            status: "Active",
            value: "1200",
        },
        {
            id: 2,
            code: "AST-002",
            name: "HP LaserJet Pro",
            category: "Printer",
            location: "Finance Department",
            status: "Active",
            value: "450",
        },
        {
            id: 3,
            code: "AST-003",
            name: "Office Desk",
            category: "Furniture",
            location: "HR Department",
            status: "Maintenance",
            value: "280",
        },
        {
            id: 4,
            code: "AST-004",
            name: "MacBook Pro 14",
            category: "Laptop",
            location: "Management",
            status: "Active",
            value: "2100",
        },
        {
            id: 5,
            code: "AST-005",
            name: "Samsung Monitor",
            category: "Monitor",
            location: "IT Department",
            status: "Inactive",
            value: "350",
        },
    ];

    const [assets, setAssets] = useState(() => {
        const savedAssets = localStorage.getItem("assets");

        return savedAssets
            ? JSON.parse(savedAssets)
            : defaultAssets;
    });

    const [search, setSearch] = useState("");

    const [showModal, setShowModal] = useState(false);

    const [showViewModal, setShowViewModal] = useState(false);

    const [editingAsset, setEditingAsset] = useState(null);

    const [selectedAsset, setSelectedAsset] = useState(null);

    const [formData, setFormData] = useState({
        code: "",
        name: "",
        category: "",
        location: "",
        status: "Active",
        value: "",
    });

    /* ===============================
       Save Assets
    ================================ */

    useEffect(() => {
        localStorage.setItem(
            "assets",
            JSON.stringify(assets)
        );
    }, [assets]);


    /* ===============================
       Open Add Modal
    ================================ */

    const handleAdd = () => {
        setEditingAsset(null);

        setFormData({
            code: "",
            name: "",
            category: "",
            location: "",
            status: "Active",
            value: "",
        });

        setShowModal(true);
    };


    /* ===============================
       Open Edit Modal
    ================================ */

    const handleEdit = (asset) => {
        setEditingAsset(asset);

        setFormData({
            code: asset.code,
            name: asset.name,
            category: asset.category,
            location: asset.location,
            status: asset.status,
            value: asset.value,
        });

        setShowModal(true);
    };


    /* ===============================
       Add / Update Asset
    ================================ */

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.code ||
            !formData.name ||
            !formData.category ||
            !formData.location ||
            !formData.value
        ) {
            alert("Please fill in all fields.");
            return;
        }

        if (editingAsset) {

            // UPDATE
            setAssets((prevAssets) =>
                prevAssets.map((asset) =>
                    asset.id === editingAsset.id
                        ? {
                            ...asset,
                            ...formData,
                        }
                        : asset
                )
            );

            alert("Asset updated successfully!");

        } else {

            // ADD
            const newAsset = {
                id: Date.now(),
                ...formData,
            };

            setAssets((prevAssets) => [
                ...prevAssets,
                newAsset,
            ]);

            alert("Asset added successfully!");
        }

        setShowModal(false);
    };


    /* ===============================
       Delete Asset
    ================================ */

    const handleDelete = (id) => {
        const asset = assets.find(
            (item) => item.id === id
        );

        const confirmDelete = window.confirm(
            `Are you sure you want to delete "${asset.name}"?`
        );

        if (!confirmDelete) {
            return;
        }

        setAssets((prevAssets) =>
            prevAssets.filter(
                (asset) => asset.id !== id
            )
        );

        alert("Asset deleted successfully!");
    };


    /* ===============================
       View Asset
    ================================ */

    const handleView = (asset) => {
        setSelectedAsset(asset);

        setShowViewModal(true);
    };


    /* ===============================
       Form Change
    ================================ */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    /* ===============================
       Search
    ================================ */

    const filteredAssets = assets.filter((asset) => {

        const searchText =
            search.toLowerCase();

        return (
            asset.name
                .toLowerCase()
                .includes(searchText) ||

            asset.code
                .toLowerCase()
                .includes(searchText) ||

            asset.category
                .toLowerCase()
                .includes(searchText) ||

            asset.location
                .toLowerCase()
                .includes(searchText)
        );
    });


    /* ===============================
       Statistics
    ================================ */

    const totalAssets = assets.length;

    const activeAssets = assets.filter(
        (asset) => asset.status === "Active"
    ).length;

    const maintenanceAssets = assets.filter(
        (asset) => asset.status === "Maintenance"
    ).length;

    const inactiveAssets = assets.filter(
        (asset) => asset.status === "Inactive"
    ).length;


    return (
        <MainLayout
            activePage="Assets"
            title="Assets"
        >
            <div className="assets-page">

                {/* ================= HEADER ================= */}

                <div className="assets-header">

                    <div>
                        <h2>Assets</h2>

                        <p>
                            Manage and track all company assets.
                        </p>
                    </div>

                    <button
                        className="add-asset-btn"
                        onClick={handleAdd}
                    >
                        <Plus size={19} />

                        Add Asset
                    </button>

                </div>


                {/* ================= STATISTICS ================= */}

                <div className="asset-stat-grid">

                    <div className="asset-stat-card">

                        <div className="stat-icon blue">
                            <Package size={24} />
                        </div>

                        <div>
                            <span>Total Assets</span>

                            <h3>
                                {totalAssets}
                            </h3>
                        </div>

                    </div>


                    <div className="asset-stat-card">

                        <div className="stat-icon green">
                            <CheckCircle size={24} />
                        </div>

                        <div>
                            <span>Active Assets</span>

                            <h3>
                                {activeAssets}
                            </h3>
                        </div>

                    </div>


                    <div className="asset-stat-card">

                        <div className="stat-icon orange">
                            <Wrench size={24} />
                        </div>

                        <div>
                            <span>Maintenance</span>

                            <h3>
                                {maintenanceAssets}
                            </h3>
                        </div>

                    </div>


                    <div className="asset-stat-card">

                        <div className="stat-icon red">
                            <AlertTriangle size={24} />
                        </div>

                        <div>
                            <span>Inactive</span>

                            <h3>
                                {inactiveAssets}
                            </h3>
                        </div>

                    </div>

                </div>


                {/* ================= TABLE ================= */}

                <div className="assets-table-card">

                    <div className="table-top">

                        <div>
                            <h3>All Assets</h3>

                            <p>
                                View and manage your company assets.
                            </p>
                        </div>


                        <div className="table-actions">

                            <div className="search-box">

                                <Search size={18} />

                                <input
                                    type="text"
                                    placeholder="Search assets..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
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

                                {filteredAssets.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="6"
                                            className="empty-table"
                                        >
                                            No assets found.
                                        </td>

                                    </tr>

                                ) : (

                                    filteredAssets.map((asset) => (

                                        <tr key={asset.id}>

                                            {/* Asset */}

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


                                            {/* Category */}

                                            <td>
                                                {asset.category}
                                            </td>


                                            {/* Location */}

                                            <td>
                                                {asset.location}
                                            </td>


                                            {/* Status */}

                                            <td>

                                                <span
                                                    className={`status-badge ${asset.status
                                                        .toLowerCase()
                                                        .replace(
                                                            " ",
                                                            "-"
                                                        )}`}
                                                >
                                                    {asset.status}
                                                </span>

                                            </td>


                                            {/* Value */}

                                            <td>

                                                <strong className="asset-value">
                                                    $
                                                    {Number(
                                                        asset.value
                                                    ).toLocaleString()}
                                                </strong>

                                            </td>


                                            {/* Actions */}

                                            <td>

                                                <div className="action-buttons">

                                                    {/* VIEW */}

                                                    <button
                                                        className="action-btn view"
                                                        title="View"
                                                        onClick={() =>
                                                            handleView(
                                                                asset
                                                            )
                                                        }
                                                    >
                                                        <Eye size={17} />
                                                    </button>


                                                    {/* EDIT */}

                                                    <button
                                                        className="action-btn edit"
                                                        title="Edit"
                                                        onClick={() =>
                                                            handleEdit(
                                                                asset
                                                            )
                                                        }
                                                    >
                                                        <Pencil size={17} />
                                                    </button>


                                                    {/* DELETE */}

                                                    <button
                                                        className="action-btn delete"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDelete(
                                                                asset.id
                                                            )
                                                        }
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>


                    {/* Footer */}

                    <div className="table-footer">

                        <span>
                            Showing{" "}
                            <strong>
                                {filteredAssets.length}
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {assets.length}
                            </strong>{" "}
                            assets
                        </span>

                    </div>

                </div>


                {/* =================================================
                    ADD / UPDATE MODAL
                ================================================= */}

                {showModal && (

                    <div className="modal-overlay">

                        <div className="asset-modal">

                            <div className="modal-header">

                                <div>

                                    <h3>
                                        {editingAsset
                                            ? "Update Asset"
                                            : "Add New Asset"}
                                    </h3>

                                    <p>
                                        {editingAsset
                                            ? "Update asset information."
                                            : "Enter information for the new asset."}
                                    </p>

                                </div>

                                <button
                                    className="modal-close"
                                    onClick={() =>
                                        setShowModal(false)
                                    }
                                >
                                    <X size={20} />
                                </button>

                            </div>


                            <form
                                onSubmit={handleSubmit}
                                className="asset-form"
                            >

                                <div className="form-grid">

                                    {/* Asset Code */}

                                    <div className="form-group">

                                        <label>
                                            Asset Code
                                        </label>

                                        <input
                                            type="text"
                                            name="code"
                                            placeholder="AST-006"
                                            value={formData.code}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    {/* Asset Name */}

                                    <div className="form-group">

                                        <label>
                                            Asset Name
                                        </label>

                                        <input
                                            type="text"
                                            name="name"
                                            placeholder="Dell Laptop"
                                            value={formData.name}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    {/* Category */}

                                    <div className="form-group">

                                        <label>
                                            Category
                                        </label>

                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                        >

                                            <option value="">
                                                Select Category
                                            </option>

                                            <option value="Laptop">
                                                Laptop
                                            </option>

                                            <option value="Desktop">
                                                Desktop
                                            </option>

                                            <option value="Monitor">
                                                Monitor
                                            </option>

                                            <option value="Printer">
                                                Printer
                                            </option>

                                            <option value="Furniture">
                                                Furniture
                                            </option>

                                            <option value="Other">
                                                Other
                                            </option>

                                        </select>

                                    </div>


                                    {/* Location */}

                                    <div className="form-group">

                                        <label>
                                            Location
                                        </label>

                                        <input
                                            type="text"
                                            name="location"
                                            placeholder="IT Department"
                                            value={formData.location}
                                            onChange={handleChange}
                                        />

                                    </div>


                                    {/* Status */}

                                    <div className="form-group">

                                        <label>
                                            Status
                                        </label>

                                        <select
                                            name="status"
                                            value={formData.status}
                                            onChange={handleChange}
                                        >

                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="Maintenance">
                                                Maintenance
                                            </option>

                                            <option value="Inactive">
                                                Inactive
                                            </option>

                                        </select>

                                    </div>


                                    {/* Value */}

                                    <div className="form-group">

                                        <label>
                                            Value ($)
                                        </label>

                                        <input
                                            type="number"
                                            name="value"
                                            placeholder="1200"
                                            min="0"
                                            value={formData.value}
                                            onChange={handleChange}
                                        />

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() =>
                                            setShowModal(false)
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="save-btn"
                                    >
                                        {editingAsset
                                            ? "Update Asset"
                                            : "Add Asset"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* =================================================
                    VIEW MODAL
                ================================================= */}

                {showViewModal && selectedAsset && (

                    <div className="modal-overlay">

                        <div className="asset-modal view-modal">

                            <div className="modal-header">

                                <div>

                                    <h3>
                                        Asset Details
                                    </h3>

                                    <p>
                                        View asset information.
                                    </p>

                                </div>

                                <button
                                    className="modal-close"
                                    onClick={() =>
                                        setShowViewModal(false)
                                    }
                                >
                                    <X size={20} />
                                </button>

                            </div>


                            <div className="asset-details">

                                <div className="detail-icon">
                                    <Package size={30} />
                                </div>


                                <h2>
                                    {selectedAsset.name}
                                </h2>

                                <span className="detail-code">
                                    {selectedAsset.code}
                                </span>


                                <div className="detail-grid">

                                    <div>
                                        <span>
                                            Category
                                        </span>

                                        <strong>
                                            {selectedAsset.category}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Location
                                        </span>

                                        <strong>
                                            {selectedAsset.location}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Status
                                        </span>

                                        <strong>
                                            {selectedAsset.status}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>
                                            Value
                                        </span>

                                        <strong>
                                            $
                                            {Number(
                                                selectedAsset.value
                                            ).toLocaleString()}
                                        </strong>
                                    </div>

                                </div>

                            </div>


                            <div className="modal-footer">

                                <button
                                    className="cancel-btn"
                                    onClick={() =>
                                        setShowViewModal(false)
                                    }
                                >
                                    Close
                                </button>

                                <button
                                    className="save-btn"
                                    onClick={() => {
                                        setShowViewModal(false);
                                        handleEdit(
                                            selectedAsset
                                        );
                                    }}
                                >
                                    <Pencil size={16} />
                                    Edit Asset
                                </button>

                            </div>

                        </div>

                    </div>

                )}

            </div>
        </MainLayout>
    );
}

export default Assets;