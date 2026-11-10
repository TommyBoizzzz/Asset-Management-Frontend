import { useMemo, useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import {
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Edit3,
    Eye,
    Filter,
    Plus,
    Search,
    Trash2,
    UserX,
    Users,
    X
} from "lucide-react";
import StaffService from "../services/staff_home";
import AssetAssignmentService from "../../assign_asset/services/Assetassignmentservice";
import { isActiveAssignment } from "../../../utils/assetLifecycle";
import { getStoredUser, hasPermission } from "../../../utils/permissions";
import useIntervalRefresh from "../../../hooks/useIntervalRefresh";
import "../css/staff_home.css";

const emptyStaffForm = {
    staffCode: "",
    fullName: "",
    phone: "",
    email: "",
    position: "",
    status: "ACTIVE"
};

const statusOptions = [
    { value: "ACTIVE", label: "Active" },
    { value: "PENDING", label: "Pending" },
    { value: "INACTIVE", label: "Inactive" }
];

function StaffHome() {
    const user = getStoredUser();
    const canView = hasPermission(user, "staff", "view");
    const canCreate = hasPermission(user, "staff", "create");
    const canEdit = hasPermission(user, "staff", "edit");
    const canDelete = hasPermission(user, "staff", "delete");

    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState(null);
    const [staffToDelete, setStaffToDelete] = useState(null);
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("ALL");
    const [currentPage, setCurrentPage] = useState(1);
    const [showFilter, setShowFilter] = useState(false);
    const pageSize = 5;

    const [dialogMode, setDialogMode] = useState(null);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [formData, setFormData] = useState(emptyStaffForm);
    const [formErrors, setFormErrors] = useState({});

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [pageError, setPageError] = useState("");
    const [submitError, setSubmitError] = useState("");

    const loadStaff = async (background = false) => {
        if (!background) {
            setLoading(true);
            setPageError("");
        }

        try {
            const response = await StaffService.getAll();
            const data = response.data;

            /*
             * Supports either:
             * 1. A normal array response
             * 2. A Spring Page response containing `content`
             */
            const records = Array.isArray(data)
                ? data
                : Array.isArray(data.content)
                    ? data.content
                    : [];

            setStaffList(records);
            if (background) setPageError("");
        } catch (error) {
            console.error("Load staff error:", error);
            if (!background) {
                setPageError(
                    error.response?.data?.message ||
                    error.response?.data?.detail ||
                    error.message ||
                    "Unable to load staff. Check your backend connection."
                );
            }
        } finally {
            if (!background) setLoading(false);
        }
    };

    useIntervalRefresh(
        (background) => loadStaff(background),
        60_000,
        true
    );

    const filteredStaff = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return staffList.filter((staff) => {
            const status = staff.status?.toUpperCase() || "INACTIVE";

            const matchesStatus =
                statusFilter === "ALL" || status === statusFilter;

            const searchableContent = [
                staff.staffCode,
                staff.fullName,
                staff.phone,
                staff.email,
                staff.position,
                staff.status
            ]
                .filter(Boolean)
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                query === "" || searchableContent.includes(query);

            return matchesStatus && matchesSearch;
        }).sort((first, second) =>
            String(first.staffCode || "").localeCompare(
                String(second.staffCode || ""),
                undefined,
                { numeric: true, sensitivity: "base" }
            )
        );
    }, [staffList, searchTerm, statusFilter]);

    const totalPages = Math.max(1, Math.ceil(filteredStaff.length / pageSize));
    const activePage = Math.min(currentPage, totalPages);
    const firstStaffIndex = (activePage - 1) * pageSize;
    const displayedStaff = filteredStaff.slice(
        firstStaffIndex,
        firstStaffIndex + pageSize
    );
    const firstDisplayedStaff = filteredStaff.length === 0 ? 0 : firstStaffIndex + 1;
    const lastDisplayedStaff = Math.min(firstStaffIndex + pageSize, filteredStaff.length);

    const stats = useMemo(() => {
        return {
            total: staffList.length,

            active: staffList.filter(
                (staff) => staff.status?.toUpperCase() === "ACTIVE"
            ).length,

            pending: staffList.filter(
                (staff) => staff.status?.toUpperCase() === "PENDING"
            ).length,

            inactive: staffList.filter(
                (staff) => staff.status?.toUpperCase() === "INACTIVE"
            ).length
        };
    }, [staffList]);

    const openCreateDialog = () => {
        if (!canCreate) return;
        setDialogMode("create");
        setSelectedStaffId(null);
        setFormData(emptyStaffForm);
        setFormErrors({});
        setSubmitError("");
    };

    const openUpdateDialog = (staff) => {
        if (!canEdit) return;
        setDialogMode("update");
        setSelectedStaffId(staff.id);

        setFormData({
            staffCode: staff.staffCode || "",
            fullName: staff.fullName || "",
            phone: staff.phone || "",
            email: staff.email || "",
            position: staff.position || "",
            status: staff.status?.toUpperCase() || "ACTIVE"
        });

        setFormErrors({});
        setSubmitError("");
    };

    const closeDialog = () => {
        if (saving) {
            return;
        }

        setDialogMode(null);
        setSelectedStaffId(null);
        setFormData(emptyStaffForm);
        setFormErrors({});
        setSubmitError("");
    };

    const openDeleteDialog = (staff) => {
        if (!canDelete) return;
        setStaffToDelete(staff);
        setDeleteError("");
    };

    const closeDeleteDialog = () => {
        if (deleting) return;
        setStaffToDelete(null);
        setDeleteError("");
    };

    const handleDeleteStaff = async () => {
        if (!canDelete || !staffToDelete || deleting) return;

        setDeleting(true);
        setDeleteError("");

        try {
            const assignmentResponse = await AssetAssignmentService.getByStaff(
                staffToDelete.id
            );
            const assignments = Array.isArray(assignmentResponse.data)
                ? assignmentResponse.data
                : assignmentResponse.data?.content;

            if (!Array.isArray(assignments)) {
                throw new Error("The server returned invalid staff assignment data.");
            }

            if (assignments.some(isActiveAssignment)) {
                setDeleteError(
                    "Return or transfer this staff member's assigned assets before deleting them."
                );
                return;
            }

            await StaffService.delete(staffToDelete.id);
            setStaffList((current) =>
                current.filter(
                    (staff) => String(staff.id) !== String(staffToDelete.id)
                )
            );
            setStaffToDelete(null);
        } catch (error) {
            console.error("Delete staff error:", error);
            setDeleteError(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                error.message ||
                "Unable to delete staff."
            );
        } finally {
            setDeleting(false);
        }
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]: value
        }));

        if (formErrors[name]) {
            setFormErrors((current) => ({
                ...current,
                [name]: ""
            }));
        }

        if (submitError) {
            setSubmitError("");
        }
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.staffCode.trim()) {
            errors.staffCode = "Staff code is required.";
        } else if (formData.staffCode.trim().length > 50) {
            errors.staffCode =
                "Staff code cannot be longer than 50 characters.";
        }

        if (!formData.fullName.trim()) {
            errors.fullName = "Full name is required.";
        } else if (formData.fullName.trim().length > 150) {
            errors.fullName =
                "Full name cannot be longer than 150 characters.";
        }

        if (formData.phone.trim().length > 30) {
            errors.phone =
                "Phone number cannot be longer than 30 characters.";
        }

        if (
            formData.email.trim() &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
        ) {
            errors.email = "Enter a valid email address.";
        } else if (formData.email.trim().length > 150) {
            errors.email =
                "Email cannot be longer than 150 characters.";
        }

        if (formData.position.trim().length > 100) {
            errors.position =
                "Position cannot be longer than 100 characters.";
        }

        if (!formData.status) {
            errors.status = "Status is required.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (dialogMode === "update" ? !canEdit : !canCreate) return;

        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setSubmitError("");

        const payload = {
            staffCode: formData.staffCode.trim(),
            fullName: formData.fullName.trim(),
            phone: formData.phone.trim() || null,
            email: formData.email.trim() || null,
            position: formData.position.trim() || null,
            status: formData.status
        };

        try {
            if (dialogMode === "update") {
                const currentStaff = staffList.find(
                    (staff) => String(staff.id) === String(selectedStaffId)
                );

                if (
                    currentStaff?.status?.toUpperCase() === "ACTIVE" &&
                    payload.status !== "ACTIVE"
                ) {
                    const assignmentResponse =
                        await AssetAssignmentService.getByStaff(selectedStaffId);
                    const assignments = Array.isArray(assignmentResponse.data)
                        ? assignmentResponse.data
                        : assignmentResponse.data?.content;

                    if (!Array.isArray(assignments)) {
                        throw new Error("The server returned invalid staff assignment data.");
                    }

                    if (assignments.some(isActiveAssignment)) {
                        setSubmitError(
                            "Return or transfer this staff member's assigned assets before deactivating them."
                        );
                        return;
                    }
                }

                await StaffService.update(selectedStaffId, payload);
            } else {
                await StaffService.create(payload);
            }

            /*
             * Some APIs return the saved object, while others return
             * an empty response. Reloading guarantees fresh data.
             */
            await loadStaff();
            closeDialogAfterSave();
        } catch (error) {
            console.error("Save staff error:", error);
            setSubmitError(
                error.response?.data?.message ||
                error.response?.data?.detail ||
                error.message ||
                "Unable to save staff."
            );
        } finally {
            setSaving(false);
        }
    };

    const closeDialogAfterSave = () => {
        setDialogMode(null);
        setSelectedStaffId(null);
        setFormData(emptyStaffForm);
        setFormErrors({});
        setSubmitError("");
    };

    return (
        <MainLayout activePage="Staff" title="Staff">
            <div className="staff-page">
                {/* Header */}
                <header className="staff-header">
                    <div>
                        <h2>Staff</h2>
                        <p>
                            Manage company staff members and their information.
                        </p>
                    </div>

                    {canCreate && <button
                        type="button"
                        className="add-staff-btn"
                        onClick={openCreateDialog}
                    >
                        <Plus size={16} />
                        <span className="add-staff-label">
                            Add Staff
                        </span>
                    </button>}
                </header>

                {/* Statistics */}
                <section className="staff-stats">
                    <StatCard
                        label="Total Staff"
                        value={stats.total}
                        description="All staff members"
                        icon={<Users size={20} />}
                        theme="blue"
                    />

                    <StatCard
                        label="Active Staff"
                        value={stats.active}
                        description="Currently active"
                        icon={<CheckCircle2 size={20} />}
                        theme="green"
                    />

                    <StatCard
                        label="Pending"
                        value={stats.pending}
                        description="Waiting for activation"
                        icon={<Clock3 size={20} />}
                        theme="orange"
                    />

                    <StatCard
                        label="Inactive"
                        value={stats.inactive}
                        description="Inactive accounts"
                        icon={<UserX size={20} />}
                        theme="purple"
                    />
                </section>

                {/* Main table card */}
                <section className="staff-main-card">
                    <div className="staff-card-header">
                        <div>
                            <h3>Staff Members</h3>
                            <p>
                                View, create, and update company staff.
                            </p>
                        </div>

                        <div className="staff-actions">
                            <div className="staff-search">
                                <Search size={16} />

                                <input
                                    type="text"
                                    placeholder="Search staff..."
                                    value={searchTerm}
                                    onChange={(event) => {
                                        setSearchTerm(event.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>

                            <div className="staff-filter-wrapper">
                                <button
                                    type="button"
                                    className={`filter-btn ${
                                        showFilter ? "active" : ""
                                    }`}
                                    onClick={() =>
                                        setShowFilter((current) => !current)
                                    }
                                >
                                    <Filter size={15} />
                                    <span>Filter</span>
                                </button>

                                {showFilter && (
                                    <div className="staff-filter-menu">
                                        <span className="staff-filter-title">
                                            Status
                                        </span>

                                        <FilterOption
                                            label="All"
                                            active={
                                                statusFilter === "ALL"
                                            }
                                            onClick={() => {
                                                setStatusFilter("ALL");
                                                setCurrentPage(1);
                                                setShowFilter(false);
                                            }}
                                        />

                                        {statusOptions.map((option) => (
                                            <FilterOption
                                                key={option.value}
                                                label={option.label}
                                                active={
                                                    statusFilter ===
                                                    option.value
                                                }
                                                onClick={() => {
                                                    setStatusFilter(
                                                        option.value
                                                    );
                                                    setCurrentPage(1);
                                                    setShowFilter(false);
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {pageError && (
                        <div className="staff-page-error">
                            <span>{pageError}</span>

                            <button
                                type="button"
                                onClick={loadStaff}
                            >
                                Try again
                            </button>
                        </div>
                    )}

                    <div className="staff-table-wrapper">
                        <table className="staff-table">
                            <thead>
                                <tr>
                                    <th>Staff</th>
                                    <th>Staff Code</th>
                                    <th>Phone</th>
                                    <th>Position</th>
                                    <th>Status</th>
                                    <th className="staff-action-column">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {loading ? (
                                    <TableLoading />
                                ) : filteredStaff.length > 0 ? (
                                    displayedStaff.map((staff, index) => (
                                        <StaffRow
                                            key={staff.id}
                                            staff={staff}
                                            index={firstStaffIndex + index}
                                            onEdit={canEdit
                                                ? () => openUpdateDialog(staff)
                                                : undefined}
                                            onView={canView
                                                ? () => setSelectedStaff(staff)
                                                : undefined}
                                            onDelete={canDelete
                                                ? openDeleteDialog
                                                : undefined}
                                        />
                                    ))
                                ) : (
                                    <tr>
                                        <td
                                            colSpan="6"
                                            className="staff-no-data"
                                        >
                                            No staff members found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="staff-table-footer">
                        <span>
                            Showing <strong>{firstDisplayedStaff}–{lastDisplayedStaff}</strong>
                            {" "}of <strong>{filteredStaff.length}</strong> staff
                        </span>

                        <nav className="staff-pagination" aria-label="Staff pages">
                            <button
                                type="button"
                                className="staff-page-nav-button"
                                aria-label="Previous page"
                                disabled={activePage <= 1}
                                onClick={() => setCurrentPage(activePage - 1)}
                            >
                                <ChevronLeft size={16} aria-hidden="true" />
                            </button>

                            <button
                                type="button"
                                className="staff-page-number is-current"
                                aria-current="page"
                                aria-label={`Page ${activePage} of ${totalPages}`}
                            >
                                {activePage}
                            </button>

                            <span className="staff-pagination-total">
                                <span>of</span> {totalPages}
                            </span>

                            <button
                                type="button"
                                className="staff-page-nav-button"
                                aria-label="Next page"
                                disabled={activePage >= totalPages}
                                onClick={() => setCurrentPage(activePage + 1)}
                            >
                                <ChevronRight size={16} aria-hidden="true" />
                            </button>
                        </nav>
                    </div>
                </section>

                {selectedStaff && (
                    <StaffDetailsDialog
                        staff={selectedStaff}
                        onClose={() => setSelectedStaff(null)}
                    />
                )}

                {staffToDelete && (
                    <StaffDeleteDialog
                        staff={staffToDelete}
                        error={deleteError}
                        deleting={deleting}
                        onClose={closeDeleteDialog}
                        onConfirm={handleDeleteStaff}
                    />
                )}

                {dialogMode && (
                    <StaffDialog
                        mode={dialogMode}
                        formData={formData}
                        errors={formErrors}
                        submitError={submitError}
                        saving={saving}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        onClose={closeDialog}
                    />
                )}
            </div>
        </MainLayout>
    );
}

function StaffRow({ staff, index, onEdit, onView, onDelete }) {
    const avatarThemes = [
        "avatar-blue",
        "avatar-purple",
        "avatar-orange",
        "avatar-green"
    ];

    const normalizedStatus =
        staff.status?.toLowerCase() || "inactive";

    return (
        <tr>
            <td>
                <div className="staff-user">
                    <div
                        className={`avatar ${
                            avatarThemes[index % avatarThemes.length]
                        }`}
                    >
                        {getInitials(staff.fullName)}
                    </div>

                    <div>
                        <strong>{staff.fullName}</strong>
                        <span>{staff.email || "No email address"}</span>
                    </div>
                </div>
            </td>

            <td>
                <span className="staff-code">
                    {staff.staffCode}
                </span>
            </td>

            <td>
                {staff.phone || (
                    <span className="staff-empty-value">—</span>
                )}
            </td>

            <td>
                {staff.position || (
                    <span className="staff-empty-value">Unassigned</span>
                )}
            </td>

            <td>
                <span
                    className={`status-badge ${normalizedStatus}`}
                >
                    <i />
                    {formatStatus(staff.status)}
                </span>
            </td>

            <td className="staff-action-column">
                <div className="staff-row-actions">
                    {onView && (
                        <button
                            type="button"
                            className="staff-view-btn"
                            title="View staff details"
                            aria-label={`View ${staff.fullName}`}
                            onClick={onView}
                        >
                            <Eye size={15} />
                        </button>
                    )}
                    {onEdit && (
                        <button
                            type="button"
                            className="staff-edit-btn"
                            title="Update staff"
                            aria-label={`Update ${staff.fullName}`}
                            onClick={onEdit}
                        >
                            <Edit3 size={15} />
                        </button>
                    )}
                    {onDelete && (
                        <button
                            type="button"
                            className="staff-delete-btn"
                            title="Delete staff"
                            aria-label={`Delete ${staff.fullName}`}
                            onClick={() => onDelete(staff)}
                        >
                            <Trash2 size={15} />
                        </button>
                    )}
                </div>
            </td>
        </tr>
    );
}

function StaffDetailsDialog({ staff, onClose }) {
    const details = [
        ["Staff code", staff.staffCode],
        ["Full name", staff.fullName],
        ["Email", staff.email],
        ["Phone", staff.phone],
        ["Position", staff.position],
        ["Status", formatStatus(staff.status || "INACTIVE")]
    ];

    return (
        <div className="staff-modal-overlay" onMouseDown={onClose}>
            <section
                className="staff-modal-content staff-details-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="staff-details-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="staff-modal-header">
                    <div>
                        <h3 id="staff-details-title">Staff Details</h3>
                        <p>Information for {staff.fullName || "this staff member"}.</p>
                    </div>
                    <button
                        type="button"
                        className="staff-close-btn"
                        aria-label="Close staff details"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>
                <dl className="staff-details-grid">
                    {details.map(([label, value]) => (
                        <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value || "—"}</dd>
                        </div>
                    ))}
                </dl>
                <div className="staff-modal-footer staff-details-footer">
                    <button type="button" className="staff-cancel-btn" onClick={onClose}>
                        Close
                    </button>
                </div>
            </section>
        </div>
    );
}

function StaffDeleteDialog({ staff, error, deleting, onClose, onConfirm }) {
    return (
        <div className="staff-modal-overlay" onMouseDown={onClose}>
            <section
                className="staff-modal-content staff-delete-modal"
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="staff-delete-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="staff-modal-header">
                    <div>
                        <h3 id="staff-delete-title">Delete Staff Member?</h3>
                        <p>This action cannot be undone.</p>
                    </div>
                    <button
                        type="button"
                        className="staff-close-btn"
                        aria-label="Close delete confirmation"
                        disabled={deleting}
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>
                <div className="staff-delete-content">
                    <p>
                        Delete <strong>{staff.fullName}</strong>
                        {staff.staffCode ? ` (${staff.staffCode})` : ""}?
                    </p>
                    {error && (
                        <div className="staff-submit-error" role="alert">
                            {error}
                        </div>
                    )}
                </div>
                <div className="staff-modal-footer staff-delete-footer">
                    <button
                        type="button"
                        className="staff-cancel-btn"
                        disabled={deleting}
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        className="staff-confirm-delete-btn"
                        disabled={deleting}
                        onClick={onConfirm}
                    >
                        {deleting ? "Deleting..." : "Delete Staff"}
                    </button>
                </div>
            </section>
        </div>
    );
}

function StaffDialog({
    mode,
    formData,
    errors,
    submitError,
    saving,
    onChange,
    onSubmit,
    onClose
}) {
    const isUpdate = mode === "update";

    return (
        <div
            className="staff-modal-overlay"
            onMouseDown={onClose}
        >
            <div
                className="staff-modal-content"
                role="dialog"
                aria-modal="true"
                aria-labelledby="staff-dialog-title"
                onMouseDown={(event) => event.stopPropagation()}
            >
                <div className="staff-modal-header">
                    <div>
                        <h3 id="staff-dialog-title">
                            {isUpdate
                                ? "Update Staff"
                                : "Add New Staff"}
                        </h3>

                        <p>
                            {isUpdate
                                ? "Update this staff member's information."
                                : "Enter information for the new staff member."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="staff-close-btn"
                        aria-label="Close"
                        disabled={saving}
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form
                    className="staff-form"
                    onSubmit={onSubmit}
                >
                    <div className="staff-form-grid">
                        <FormField
                            label="Staff code"
                            name="staffCode"
                            value={formData.staffCode}
                            error={errors.staffCode}
                            placeholder="Example: STF-001"
                            maxLength={50}
                            required
                            onChange={onChange}
                        />

                        <FormField
                            label="Full name"
                            name="fullName"
                            value={formData.fullName}
                            error={errors.fullName}
                            placeholder="Enter full name"
                            maxLength={150}
                            required
                            onChange={onChange}
                        />

                        <FormField
                            label="Phone number"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            error={errors.phone}
                            placeholder="Enter phone number"
                            maxLength={30}
                            onChange={onChange}
                        />

                        <FormField
                            label="Email address"
                            name="email"
                            type="email"
                            value={formData.email}
                            error={errors.email}
                            placeholder="name@company.com"
                            maxLength={150}
                            onChange={onChange}
                        />

                        <FormField
                            label="Position"
                            name="position"
                            value={formData.position}
                            error={errors.position}
                            placeholder="Example: Software Developer"
                            maxLength={100}
                            onChange={onChange}
                        />

                        <div className="staff-form-group">
                            <label htmlFor="staff-status">
                                Status
                                <span className="required-mark">*</span>
                            </label>

                            <select
                                id="staff-status"
                                name="status"
                                value={formData.status}
                                className={
                                    errors.status
                                        ? "input-error"
                                        : ""
                                }
                                onChange={onChange}
                            >
                                {statusOptions.map((option) => (
                                    <option
                                        key={option.value}
                                        value={option.value}
                                    >
                                        {option.label}
                                    </option>
                                ))}
                            </select>

                            {errors.status && (
                                <span className="staff-form-error">
                                    {errors.status}
                                </span>
                            )}
                        </div>
                    </div>

                    {submitError && (
                        <div className="staff-submit-error">
                            {submitError}
                        </div>
                    )}

                    <div className="staff-modal-footer">
                        <button
                            type="button"
                            className="staff-cancel-btn"
                            disabled={saving}
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="staff-submit-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : isUpdate
                                    ? "Save Changes"
                                    : "Add Staff"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function FormField({
    label,
    name,
    type = "text",
    value,
    error,
    placeholder,
    maxLength,
    required = false,
    onChange
}) {
    return (
        <div className="staff-form-group">
            <label htmlFor={`staff-${name}`}>
                {label}

                {required && (
                    <span className="required-mark">*</span>
                )}
            </label>

            <input
                id={`staff-${name}`}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                maxLength={maxLength}
                className={error ? "input-error" : ""}
                onChange={onChange}
            />

            {error && (
                <span className="staff-form-error">
                    {error}
                </span>
            )}
        </div>
    );
}

function StatCard({
    label,
    value,
    description,
    icon,
    theme
}) {
    return (
        <div className="staff-stat-card">
            <div className="stat-content">
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{description}</small>
            </div>

            <div className={`stat-icon ${theme}`}>
                {icon}
            </div>
        </div>
    );
}

function FilterOption({ label, active, onClick }) {
    return (
        <button
            type="button"
            className={active ? "active" : ""}
            onClick={onClick}
        >
            {label}
        </button>
    );
}

function TableLoading() {
    return (
        <tr>
            <td colSpan="6" className="staff-no-data">
                Loading staff...
            </td>
        </tr>
    );
}

function getInitials(fullName = "") {
    const words = fullName
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (words.length === 0) {
        return "ST";
    }

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return `${words[0][0]}${words[words.length - 1][0]}`.toUpperCase();
}

function formatStatus(status = "") {
    return status
        .toLowerCase()
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase());
}

export default StaffHome;