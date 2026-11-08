import { useMemo, useState } from "react";

import {
    ClipboardList,
    CheckCircle,
    RotateCcw,
    AlertTriangle,
    Search,
    Eye,
    Undo2,
    Plus,
    X,
    ChevronDown,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import "../css/assign_home.css";

import AssetAssignmentService from "../services/Assetassignmentservice";
import AssetService from "../../asset/services/AssetService";
import StaffService from "../../staff/services/staff_home";
import {
    getStatusAfterInspection,
    isActiveAssignment,
    isAssetAvailable,
} from "../../../utils/assetLifecycle";
import { getStoredUser, hasPermission } from "../../../utils/permissions";
import useIntervalRefresh from "../../../hooks/useIntervalRefresh";

function AssignAssets() {
    const user = getStoredUser();
    const canCreate = hasPermission(user, "assign-assets", "create");
    const canEdit = hasPermission(user, "assign-assets", "edit");


    /* =========================================================
       STATE
    ========================================================= */

    const [assignments, setAssignments] = useState([]);
    const [assets, setAssets] = useState([]);
    const [staffList, setStaffList] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");


    /* =========================================================
       MODALS
    ========================================================= */

    const [showAssignModal, setShowAssignModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showReturnModal, setShowReturnModal] = useState(false);

    const [selectedAssignment, setSelectedAssignment] = useState(null);


    /* =========================================================
       FORM STATE
    ========================================================= */

    const emptyForm = {
        assetId: "",
        staffId: "",
        expectedReturnDate: "",
        conditionBefore: "GOOD",
        notes: "",
    };

    const [form, setForm] = useState(emptyForm);

    const emptyReturnForm = {
        conditionAfter: "GOOD",
        notes: "",
    };

    const [returnForm, setReturnForm] = useState(emptyReturnForm);


    /* =========================================================
       LOAD DATA
    ========================================================= */

    const loadAll = async (background = false) => {

        try {

            if (!background) setLoading(true);

            const [assignmentRes, assetRes, staffRes] =
                await Promise.all([
                    AssetAssignmentService.getAll(),
                    AssetService.getAll(),
                    StaffService.getAll(),
                ]);

            setAssignments(assignmentRes.data || []);
            setAssets(assetRes.data || []);
            setStaffList(staffRes.data || []);

        } catch (error) {

            console.error("Failed to load assignments:", error);

            if (!background) {
                alert(
                    error.response?.data?.message ||
                    "Failed to load asset assignments."
                );
            }

        } finally {

            if (!background) setLoading(false);
        }
    };


    useIntervalRefresh(
        (background) => loadAll(background),
        60_000,
        true
    );


    /* =========================================================
       HELPERS
    ========================================================= */

    const getAssetLabel = (asset) => {

        if (!asset) return "-";

        return `${asset.name || "Unknown"} (${asset.assetCode || "-"})`;
    };

    const getStaffLabel = (staff) => {

        if (!staff) return "-";

        return `${staff.fullName || "Unknown"} (${staff.staffCode || "-"})`;
    };

    const assignableAssets = useMemo(() => {
        const currentlyAssignedIds = new Set(
            assignments
                .filter(isActiveAssignment)
                .map((assignment) => String(assignment.asset?.id))
        );

        return assets.filter(
            (asset) =>
                isAssetAvailable(asset) &&
                !currentlyAssignedIds.has(String(asset.id))
        );

    }, [assets, assignments]);

    const isOverdue = (assignment) => {

        if (!isActiveAssignment(assignment)) return false;

        if (!assignment.expectedReturnDate) return false;

        const today = new Date().toISOString().slice(0, 10);

        return assignment.expectedReturnDate < today;
    };


    /* =========================================================
       STATISTICS
    ========================================================= */

    const totalAssignments = assignments.length;

    const activeAssignments = assignments.filter(
        isActiveAssignment
    ).length;

    const returnedAssignments = assignments.filter(
        (item) => String(item.status || "").toUpperCase() === "RETURNED"
    ).length;

    const overdueAssignments = assignments.filter(isOverdue).length;


    /* =========================================================
       FILTERED LIST
    ========================================================= */

    const filteredAssignments = useMemo(() => {

        const term = search.toLowerCase().trim();

        return assignments.filter((assignment) => {

            const assetLabel = getAssetLabel(
                assignment.asset
            ).toLowerCase();

            const staffLabel = getStaffLabel(
                assignment.staff
            ).toLowerCase();

            const matchesSearch =
                assetLabel.includes(term) ||
                staffLabel.includes(term);

            const matchesStatus =
                statusFilter === "All" ||
                assignment.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

    }, [assignments, search, statusFilter]);


    /* =========================================================
       ASSIGN (CREATE)
    ========================================================= */

    const handleOpenAssign = () => {
        if (!canCreate) return;

        setForm(emptyForm);
        setShowAssignModal(true);
    };

    const handleFormChange = (e) => {

        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAssignSubmit = async (e) => {
        e.preventDefault();

        if (!canCreate) return;

        if (!form.assetId) {
            alert("Please select an asset.");
            return;
        }

        const chosenAsset = assets.find(
            (asset) => String(asset.id) === String(form.assetId)
        );

        if (
            !chosenAsset ||
            !isAssetAvailable(chosenAsset) ||
            assignments.some(
                (assignment) =>
                    isActiveAssignment(assignment) &&
                    String(assignment.asset?.id) === String(chosenAsset.id)
            )
        ) {
            alert(
                "This asset is not available for assignment. It may already be assigned, under maintenance, damaged, or retired."
            );
            return;
        }

        if (!form.staffId) {
            alert("Please select a staff member.");
            return;
        }

        const chosenStaff = staffList.find(
            (staff) => String(staff.id) === String(form.staffId)
        );

        if (
            !chosenStaff ||
            String(chosenStaff.status || "ACTIVE").toUpperCase() !== "ACTIVE"
        ) {
            alert("Only active staff members can be assigned an asset.");
            return;
        }

        if (!user?.id) {
            alert(
                "Could not determine the current user. Please log in again."
            );
            return;
        }

        try {

            const payload = {
                asset: { id: Number(form.assetId) },
                staff: { id: Number(form.staffId) },
                assignedBy: { id: user.id },
                conditionBefore: form.conditionBefore,
            };

            if (form.expectedReturnDate) {
                payload.expectedReturnDate = form.expectedReturnDate;
            }

            if (form.notes && form.notes.trim()) {
                payload.notes = form.notes.trim();
            }

            await AssetAssignmentService.create(payload);

            try {
                await AssetService.update(chosenAsset.id, {
                    ...chosenAsset,
                    status: "Assigned",
                });
            } catch (statusError) {
                console.error("Assignment created but asset status update failed:", statusError);
                setShowAssignModal(false);
                setForm(emptyForm);
                await loadAll();
                alert(
                    "The assignment was created, but the asset status could not be updated. Refresh the asset record before making another assignment."
                );
                return;
            }

            alert("Asset assigned successfully!");

            setShowAssignModal(false);
            setForm(emptyForm);

            await loadAll();

        } catch (error) {

            console.error("Assign error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to assign asset."
            );
        }
    };


    /* =========================================================
       VIEW
    ========================================================= */

    const handleView = (assignment) => {

        setSelectedAssignment(assignment);
        setShowViewModal(true);
    };


    /* =========================================================
       RETURN
    ========================================================= */

    const handleOpenReturn = (assignment) => {
        if (!canEdit) return;

        setSelectedAssignment(assignment);
        setReturnForm(emptyReturnForm);
        setShowReturnModal(true);
    };

    const handleReturnChange = (e) => {

        const { name, value } = e.target;

        setReturnForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleReturnSubmit = async (e) => {
        e.preventDefault();

        if (!canEdit) return;

        if (!selectedAssignment) return;

        try {

            await AssetAssignmentService.returnAsset(
                selectedAssignment.id,
                returnForm.conditionAfter,
                returnForm.notes.trim() || undefined
            );

            const asset = assets.find(
                (item) =>
                    String(item.id) === String(selectedAssignment.asset?.id)
            );

            if (!asset) {
                throw new Error(
                    "The assignment was returned, but its asset record could not be found to update the status."
                );
            }

            try {
                await AssetService.update(asset.id, {
                    ...asset,
                    condition: returnForm.conditionAfter,
                    status: getStatusAfterInspection(returnForm.conditionAfter),
                });
            } catch (statusError) {
                console.error("Assignment returned but asset status update failed:", statusError);
                setShowReturnModal(false);
                setSelectedAssignment(null);
                await loadAll();
                alert(
                    "The asset return was recorded, but its status and condition could not be updated. Refresh the asset record and correct it before reassignment."
                );
                return;
            }

            alert("Asset marked as returned!");

            setShowReturnModal(false);
            setSelectedAssignment(null);

            await loadAll();

        } catch (error) {

            console.error("Return error:", error);

            alert(
                error.response?.data?.message ||
                "Failed to return asset."
            );
        }
    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (loading) {

        return (
            <MainLayout
                activePage="Assign Assets"
                title="Assign Assets"
            >

                <div className="assign-page">

                    <div className="page-loading">

                        <div className="loading-spinner" />

                        <h3>Loading Asset Assignments...</h3>

                        <p>
                            Please wait while we load assignments,
                            assets, and staff.
                        </p>

                    </div>

                </div>

            </MainLayout>
        );
    }


    /* =========================================================
       RENDER
    ========================================================= */

    return (

        <MainLayout
            activePage="Assign Assets"
            title="Assign Assets"
        >

            <div className="assign-page">


                {/* HEADER */}

                <div className="assign-header">

                    <div className="assign-heading">

                        <div className="page-icon">
                            <ClipboardList size={25} />
                        </div>

                        <div>

                            <h2>Asset Assignments</h2>

                            <p>
                                Assign company assets to staff and
                                track their return.
                            </p>

                        </div>

                    </div>


                    {canCreate && <button
                        className="primary-btn"
                        onClick={handleOpenAssign}
                    >
                        <Plus size={18} />
                        Assign Asset
                    </button>}

                </div>


                {/* STATS */}

                <div className="assign-stat-grid">

                    <div className="stat-card">

                        <div className="stat-icon blue">
                            <ClipboardList size={22} />
                        </div>

                        <div>
                            <span>Total Assignments</span>
                            <strong>{totalAssignments}</strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon green">
                            <CheckCircle size={22} />
                        </div>

                        <div>
                            <span>Active</span>
                            <strong>{activeAssignments}</strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon purple">
                            <RotateCcw size={22} />
                        </div>

                        <div>
                            <span>Returned</span>
                            <strong>{returnedAssignments}</strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon red">
                            <AlertTriangle size={22} />
                        </div>

                        <div>
                            <span>Overdue</span>
                            <strong>{overdueAssignments}</strong>
                        </div>

                    </div>

                </div>


                {/* TABLE CARD */}

                <section className="management-card">

                    <div className="card-header">

                        <div className="card-header-title">

                            <div className="small-header-icon blue">
                                <ClipboardList size={18} />
                            </div>

                            <div>
                                <h3>Assignments</h3>
                                <p>All current and past asset assignments.</p>
                            </div>

                        </div>

                    </div>


                    <div className="assign-toolbar">

                        <div className="search-field">

                            <Search size={17} />

                            <input
                                type="text"
                                placeholder="Search by asset or staff..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(e.target.value)
                                }
                            />

                            {search && (
                                <button onClick={() => setSearch("")}>
                                    <X size={14} />
                                </button>
                            )}

                        </div>


                        <div className="status-filter">

                            <select
                                value={statusFilter}
                                onChange={(e) =>
                                    setStatusFilter(e.target.value)
                                }
                            >
                                <option value="All">All Status</option>
                                <option value="ACTIVE">Active</option>
                                <option value="RETURNED">Returned</option>
                            </select>

                            <ChevronDown size={14} />

                        </div>

                    </div>


                    <div className="assign-table-wrapper">

                        <table className="management-table">

                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Staff</th>
                                    <th>Assigned Date</th>
                                    <th>Expected Return</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>

                            <tbody>

                                {filteredAssignments.length === 0 ? (

                                    <tr>
                                        <td colSpan="6" className="empty-cell">

                                            <div className="empty-content">

                                                <div>
                                                    <ClipboardList size={25} />
                                                </div>

                                                <strong>
                                                    No assignments found
                                                </strong>

                                                <span>
                                                    Try another search or
                                                    assign a new asset.
                                                </span>

                                            </div>

                                        </td>
                                    </tr>

                                ) : (

                                    filteredAssignments.map((assignment) => {

                                        const overdue =
                                            isOverdue(assignment);

                                        const statusLabel = overdue
                                            ? "Overdue"
                                            : String(assignment.status || "").toUpperCase() === "RETURNED"
                                                ? "Returned"
                                                : "Active";

                                        const statusClass = overdue
                                            ? "overdue"
                                            : String(assignment.status || "").toUpperCase() === "RETURNED"
                                                ? "returned"
                                                : "active";

                                        return (

                                            <tr key={assignment.id}>

                                                <td>
                                                    <strong>
                                                        {getAssetLabel(
                                                            assignment.asset
                                                        )}
                                                    </strong>
                                                </td>

                                                <td>
                                                    {getStaffLabel(
                                                        assignment.staff
                                                    )}
                                                </td>

                                                <td>
                                                    {assignment.assignedAt
                                                        ? assignment.assignedAt.slice(0, 10)
                                                        : "-"}
                                                </td>

                                                <td>
                                                    {assignment.expectedReturnDate || "-"}
                                                </td>

                                                <td>
                                                    <span className={`status ${statusClass}`}>
                                                        <i />
                                                        {statusLabel}
                                                    </span>
                                                </td>

                                                <td>

                                                    <div className="table-actions">

                                                        <button
                                                            className="table-btn view"
                                                            title="View"
                                                            onClick={() =>
                                                                handleView(assignment)
                                                            }
                                                        >
                                                            <Eye size={15} />
                                                        </button>

                                                        {canEdit && isActiveAssignment(assignment) && (
                                                            <button
                                                                className="table-btn return"
                                                                title="Return Asset"
                                                                onClick={() =>
                                                                    handleOpenReturn(assignment)
                                                                }
                                                            >
                                                                <Undo2 size={15} />
                                                            </button>
                                                        )}

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    })
                                )}

                            </tbody>

                        </table>

                    </div>


                    <div className="card-footer">
                        Showing <strong>{filteredAssignments.length}</strong>{" "}
                        of <strong>{assignments.length}</strong> assignments
                    </div>

                </section>


                {/* ===================================================
                    ASSIGN MODAL
                =================================================== */}

                {showAssignModal && (

                    <div
                        className="modal-overlay"
                        onClick={() => setShowAssignModal(false)}
                    >

                        <div
                            className="modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="modal-header">

                                <div className="modal-title">

                                    <div className="modal-icon blue">
                                        <ClipboardList size={20} />
                                    </div>

                                    <div>
                                        <h3>Assign Asset</h3>
                                        <p>Assign an asset to a staff member.</p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="close-modal"
                                    onClick={() => setShowAssignModal(false)}
                                >
                                    <X size={19} />
                                </button>

                            </div>


                            <form
                                className="modal-form"
                                onSubmit={handleAssignSubmit}
                            >

                                <div className="form-grid">

                                    <div className="form-group form-full">

                                        <label>
                                            Asset <span className="required">*</span>
                                        </label>

                                        <div className="select-container">

                                            <select
                                                name="assetId"
                                                value={form.assetId}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">
                                                    Select Asset
                                                </option>

                                                {assignableAssets.length === 0 ? (
                                                    <option value="" disabled>
                                                        No active assets available
                                                    </option>
                                                ) : (
                                                    assignableAssets.map((asset) => (
                                                        <option
                                                            key={asset.id}
                                                            value={asset.id}
                                                        >
                                                            {getAssetLabel(asset)}
                                                        </option>
                                                    ))
                                                )}
                                            </select>

                                            <ChevronDown size={16} />

                                        </div>

                                        <span className="field-hint">
                                            Only assets with an "Active" status
                                            can be assigned.
                                        </span>

                                    </div>


                                    <div className="form-group form-full">

                                        <label>
                                            Staff <span className="required">*</span>
                                        </label>

                                        <div className="select-container">

                                            <select
                                                name="staffId"
                                                value={form.staffId}
                                                onChange={handleFormChange}
                                                required
                                            >
                                                <option value="">
                                                    Select Staff
                                                </option>

                                                {staffList.map((staff) => (
                                                    <option
                                                        key={staff.id}
                                                        value={staff.id}
                                                    >
                                                        {getStaffLabel(staff)}
                                                    </option>
                                                ))}
                                            </select>

                                            <ChevronDown size={16} />

                                        </div>

                                    </div>


                                    <div className="form-group">

                                        <label>Expected Return Date</label>

                                        <input
                                            type="date"
                                            name="expectedReturnDate"
                                            value={form.expectedReturnDate}
                                            onChange={handleFormChange}
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>Condition Before</label>

                                        <div className="select-container">

                                            <select
                                                name="conditionBefore"
                                                value={form.conditionBefore}
                                                onChange={handleFormChange}
                                            >
                                                <option value="GOOD">Good</option>
                                                <option value="FAIR">Fair</option>
                                                <option value="POOR">Poor</option>
                                                <option value="DAMAGED">Damaged</option>
                                            </select>

                                            <ChevronDown size={16} />

                                        </div>

                                    </div>


                                    <div className="form-group form-full">

                                        <label>Notes</label>

                                        <textarea
                                            name="notes"
                                            value={form.notes}
                                            onChange={handleFormChange}
                                            placeholder="Any notes about this assignment..."
                                            rows="3"
                                        />

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() => setShowAssignModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="primary-modal-btn"
                                    >
                                        Assign Asset
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* ===================================================
                    VIEW MODAL
                =================================================== */}

                {showViewModal && selectedAssignment && (

                    <div
                        className="modal-overlay"
                        onClick={() => setShowViewModal(false)}
                    >

                        <div
                            className="modal view-modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="modal-header">

                                <div className="modal-title">

                                    <div className="modal-icon blue">
                                        <Eye size={20} />
                                    </div>

                                    <div>
                                        <h3>Assignment Details</h3>
                                        <p>View complete assignment information.</p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="close-modal"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    <X size={19} />
                                </button>

                            </div>


                            <div className="view-content">

                                <h2>
                                    {getAssetLabel(selectedAssignment.asset)}
                                </h2>

                                <span className="view-code">
                                    Assigned to{" "}
                                    {getStaffLabel(selectedAssignment.staff)}
                                </span>


                                <div className="view-status">
                                    <span
                                        className={`status ${
                                            String(selectedAssignment.status || "").toUpperCase() === "RETURNED"
                                                ? "returned"
                                                : "active"
                                        }`}
                                    >
                                        <i />
                                        {String(selectedAssignment.status || "").toUpperCase() === "RETURNED"
                                            ? "Returned"
                                            : "Active"}
                                    </span>
                                </div>


                                <div className="details-grid">

                                    <div>
                                        <span>Assigned By</span>
                                        <strong>
                                            {selectedAssignment.assignedBy
                                                ? selectedAssignment.assignedBy.fullName || "-"
                                                : "-"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Assigned Date</span>
                                        <strong>
                                            {selectedAssignment.assignedAt
                                                ? selectedAssignment.assignedAt.slice(0, 10)
                                                : "-"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Expected Return</span>
                                        <strong>
                                            {selectedAssignment.expectedReturnDate || "-"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Returned At</span>
                                        <strong>
                                            {selectedAssignment.returnedAt
                                                ? selectedAssignment.returnedAt.slice(0, 10)
                                                : "-"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Condition Before</span>
                                        <strong>
                                            {selectedAssignment.conditionBefore || "-"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Condition After</span>
                                        <strong>
                                            {selectedAssignment.conditionAfter || "-"}
                                        </strong>
                                    </div>

                                </div>


                                {selectedAssignment.notes && (
                                    <div className="category-view-description">
                                        <strong>Notes</strong>
                                        <p>{selectedAssignment.notes}</p>
                                    </div>
                                )}

                            </div>


                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="secondary-btn"
                                    onClick={() => setShowViewModal(false)}
                                >
                                    Close
                                </button>

                                {canEdit && isActiveAssignment(selectedAssignment) && (
                                    <button
                                        type="button"
                                        className="primary-modal-btn"
                                        onClick={() => {
                                            setShowViewModal(false);
                                            handleOpenReturn(selectedAssignment);
                                        }}
                                    >
                                        <Undo2 size={15} />
                                        Return Asset
                                    </button>
                                )}

                            </div>

                        </div>

                    </div>

                )}


                {/* ===================================================
                    RETURN MODAL
                =================================================== */}

                {showReturnModal && selectedAssignment && (

                    <div
                        className="modal-overlay"
                        onClick={() => setShowReturnModal(false)}
                    >

                        <div
                            className="modal"
                            onClick={(e) => e.stopPropagation()}
                        >

                            <div className="modal-header">

                                <div className="modal-title">

                                    <div className="modal-icon purple">
                                        <Undo2 size={20} />
                                    </div>

                                    <div>
                                        <h3>Return Asset</h3>
                                        <p>
                                            {getAssetLabel(selectedAssignment.asset)}
                                        </p>
                                    </div>

                                </div>

                                <button
                                    type="button"
                                    className="close-modal"
                                    onClick={() => setShowReturnModal(false)}
                                >
                                    <X size={19} />
                                </button>

                            </div>


                            <form
                                className="modal-form"
                                onSubmit={handleReturnSubmit}
                            >

                                <div className="form-group">

                                    <label>Condition After</label>

                                    <div className="select-container">

                                        <select
                                            name="conditionAfter"
                                            value={returnForm.conditionAfter}
                                            onChange={handleReturnChange}
                                        >
                                            <option value="GOOD">Good</option>
                                            <option value="FAIR">Fair</option>
                                            <option value="POOR">Poor</option>
                                            <option value="DAMAGED">Damaged</option>
                                        </select>

                                        <ChevronDown size={16} />

                                    </div>

                                </div>


                                <div className="form-group">

                                    <label>Notes</label>

                                    <textarea
                                        name="notes"
                                        value={returnForm.notes}
                                        onChange={handleReturnChange}
                                        placeholder="Any notes about the return..."
                                        rows="3"
                                    />

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() => setShowReturnModal(false)}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="primary-modal-btn purple-btn"
                                    >
                                        Confirm Return
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}

            </div>

        </MainLayout>
    );
}

export default AssignAssets;