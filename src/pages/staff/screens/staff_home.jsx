import { useMemo, useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import {
    Check,
    Clock3,
    Edit3,
    Filter,
    LockKeyhole,
    Plus,
    Search,
    Users,
    X
} from "lucide-react";
import "../css/staff_home.css";

const initialStaffData = [
    {
        id: 1,
        firstName: "John",
        lastName: "Smith",
        email: "john@company.com",
        phone: "012 345 678",
        department: "IT Department",
        position: "Software Developer",
        role: "Manager",
        status: "Active"
    },
    {
        id: 2,
        firstName: "Sarah",
        lastName: "Miller",
        email: "sarah@company.com",
        phone: "023 456 789",
        department: "Human Resources",
        position: "HR Specialist",
        role: "Staff",
        status: "Active"
    },
    {
        id: 3,
        firstName: "David",
        lastName: "Wilson",
        email: "david@company.com",
        phone: "034 567 890",
        department: "Finance",
        position: "Accountant",
        role: "Viewer",
        status: "Pending"
    },
    {
        id: 4,
        firstName: "Lisa",
        lastName: "Kim",
        email: "lisa@company.com",
        phone: "045 678 901",
        department: "Operations",
        position: "Operations Manager",
        role: "Admin",
        status: "Active"
    }
];

const emptyStaffForm = {
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    department: "",
    position: "",
    role: "Staff",
    status: "Active"
};

const roleOptions = ["Admin", "Manager", "Staff", "Viewer"];
const statusOptions = ["Active", "Pending", "Inactive", "Suspended"];

const avatarThemes = [
    "avatar-blue",
    "avatar-purple",
    "avatar-orange",
    "avatar-green"
];

function StaffHome() {
    const [staffList, setStaffList] = useState(initialStaffData);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [showFilter, setShowFilter] = useState(false);

    const [dialogMode, setDialogMode] = useState(null);
    const [selectedStaffId, setSelectedStaffId] = useState(null);
    const [formData, setFormData] = useState(emptyStaffForm);
    const [formErrors, setFormErrors] = useState({});

    const filteredStaff = useMemo(() => {
        const query = searchTerm.trim().toLowerCase();

        return staffList.filter((staff) => {
            const matchesSearch =
                !query ||
                `${staff.firstName} ${staff.lastName}`
                    .toLowerCase()
                    .includes(query) ||
                staff.email.toLowerCase().includes(query) ||
                staff.department.toLowerCase().includes(query) ||
                staff.position.toLowerCase().includes(query) ||
                staff.role.toLowerCase().includes(query);

            const matchesStatus =
                statusFilter === "All" || staff.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [staffList, searchTerm, statusFilter]);

    const stats = {
        total: staffList.length,
        active: staffList.filter((staff) => staff.status === "Active").length,
        pending: staffList.filter((staff) => staff.status === "Pending").length,
        administrators: staffList.filter((staff) => staff.role === "Admin").length
    };

    const openCreateDialog = () => {
        setDialogMode("create");
        setSelectedStaffId(null);
        setFormData(emptyStaffForm);
        setFormErrors({});
    };

    const openUpdateDialog = (staff) => {
        setDialogMode("update");
        setSelectedStaffId(staff.id);

        setFormData({
            firstName: staff.firstName,
            lastName: staff.lastName,
            email: staff.email,
            phone: staff.phone || "",
            department: staff.department,
            position: staff.position,
            role: staff.role,
            status: staff.status
        });

        setFormErrors({});
    };

    const closeDialog = () => {
        setDialogMode(null);
        setSelectedStaffId(null);
        setFormData(emptyStaffForm);
        setFormErrors({});
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
    };

    const validateForm = () => {
        const errors = {};

        if (!formData.firstName.trim()) {
            errors.firstName = "First name is required.";
        }

        if (!formData.lastName.trim()) {
            errors.lastName = "Last name is required.";
        }

        if (!formData.email.trim()) {
            errors.email = "Email address is required.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            errors.email = "Enter a valid email address.";
        } else {
            const emailExists = staffList.some(
                (staff) =>
                    staff.email.toLowerCase() ===
                        formData.email.trim().toLowerCase() &&
                    staff.id !== selectedStaffId
            );

            if (emailExists) {
                errors.email = "This email address is already in use.";
            }
        }

        if (!formData.department.trim()) {
            errors.department = "Department is required.";
        }

        if (!formData.position.trim()) {
            errors.position = "Position is required.";
        }

        setFormErrors(errors);

        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const cleanStaff = {
            ...formData,
            firstName: formData.firstName.trim(),
            lastName: formData.lastName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            department: formData.department.trim(),
            position: formData.position.trim()
        };

        if (dialogMode === "create") {
            const newStaff = {
                id: Date.now(),
                ...cleanStaff
            };

            setStaffList((current) => [newStaff, ...current]);
        }

        if (dialogMode === "update") {
            setStaffList((current) =>
                current.map((staff) =>
                    staff.id === selectedStaffId
                        ? { ...staff, ...cleanStaff }
                        : staff
                )
            );
        }

        closeDialog();
    };

    return (
        <MainLayout activePage="Staff" title="Staff">
            <div className="staff-page">
                {/* Header */}
                <header className="staff-header">
                    <div>
                        <h2>Staff</h2>
                        <p>
                            Manage your company staff members and their access.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="add-staff-btn"
                        onClick={openCreateDialog}
                    >
                        <Plus size={16} />
                        <span className="add-staff-label">Add Staff</span>
                    </button>
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
                        icon={<Check size={20} />}
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
                        label="Administrators"
                        value={stats.administrators}
                        description="System administrators"
                        icon={<LockKeyhole size={20} />}
                        theme="purple"
                    />
                </section>

                {/* Main card */}
                <section className="staff-main-card">
                    <div className="staff-card-header">
                        <div>
                            <h3>Staff Members</h3>
                            <p>View and manage your company&apos;s staff.</p>
                        </div>

                        <div className="staff-actions">
                            <div className="staff-search">
                                <Search size={16} />

                                <input
                                    type="text"
                                    placeholder="Search staff..."
                                    value={searchTerm}
                                    onChange={(event) =>
                                        setSearchTerm(event.target.value)
                                    }
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

                                        {["All", ...statusOptions].map(
                                            (status) => (
                                                <button
                                                    key={status}
                                                    type="button"
                                                    className={
                                                        statusFilter === status
                                                            ? "active"
                                                            : ""
                                                    }
                                                    onClick={() => {
                                                        setStatusFilter(status);
                                                        setShowFilter(false);
                                                    }}
                                                >
                                                    {status}
                                                </button>
                                            )
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="staff-table-wrapper">
                        <table className="staff-table">
                            <thead>
                                <tr>
                                    <th>Staff</th>
                                    <th>Department</th>
                                    <th>Position</th>
                                    <th>Role</th>
                                    <th>Status</th>
                                    <th className="staff-action-column">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {filteredStaff.length > 0 ? (
                                    filteredStaff.map((staff, index) => (
                                        <tr key={staff.id}>
                                            <td>
                                                <div className="staff-user">
                                                    <div
                                                        className={`avatar ${
                                                            avatarThemes[
                                                                index %
                                                                    avatarThemes.length
                                                            ]
                                                        }`}
                                                    >
                                                        {getInitials(staff)}
                                                    </div>

                                                    <div>
                                                        <strong>
                                                            {staff.firstName}{" "}
                                                            {staff.lastName}
                                                        </strong>
                                                        <span>{staff.email}</span>
                                                    </div>
                                                </div>
                                            </td>

                                            <td>{staff.department}</td>
                                            <td>{staff.position}</td>

                                            <td>
                                                <span
                                                    className={`role-badge ${staff.role.toLowerCase()}`}
                                                >
                                                    {staff.role}
                                                </span>
                                            </td>

                                            <td>
                                                <span
                                                    className={`status-badge ${staff.status.toLowerCase()}`}
                                                >
                                                    <i />
                                                    {staff.status}
                                                </span>
                                            </td>

                                            <td className="staff-action-column">
                                                <button
                                                    type="button"
                                                    className="staff-edit-btn"
                                                    title="Update staff"
                                                    aria-label={`Update ${staff.firstName} ${staff.lastName}`}
                                                    onClick={() =>
                                                        openUpdateDialog(staff)
                                                    }
                                                >
                                                    <Edit3 size={15} />
                                                </button>
                                            </td>
                                        </tr>
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

                    {/* Footer */}
                    <div className="staff-table-footer">
                        <span>
                            Showing{" "}
                            <strong>
                                {filteredStaff.length === 0
                                    ? "0"
                                    : `1–${filteredStaff.length}`}
                            </strong>{" "}
                            of <strong>{staffList.length}</strong> staff
                        </span>

                        <div className="pagination">
                            <button type="button" disabled>
                                ‹
                            </button>
                            <button type="button" className="current">
                                1
                            </button>
                            <button type="button" disabled>
                                ›
                            </button>
                        </div>
                    </div>
                </section>

                {/* Create/update dialog */}
                {dialogMode && (
                    <StaffDialog
                        mode={dialogMode}
                        formData={formData}
                        errors={formErrors}
                        onChange={handleInputChange}
                        onSubmit={handleSubmit}
                        onClose={closeDialog}
                    />
                )}
            </div>
        </MainLayout>
    );
}

function StatCard({ label, value, description, icon, theme }) {
    return (
        <div className="staff-stat-card">
            <div className="stat-content">
                <span>{label}</span>
                <strong>{value}</strong>
                <small>{description}</small>
            </div>

            <div className={`stat-icon ${theme}`}>{icon}</div>
        </div>
    );
}

function StaffDialog({
    mode,
    formData,
    errors,
    onChange,
    onSubmit,
    onClose
}) {
    const isUpdate = mode === "update";

    return (
        <div
            className="staff-modal-overlay"
            role="presentation"
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
                            {isUpdate ? "Update Staff" : "Add Staff"}
                        </h3>

                        <p>
                            {isUpdate
                                ? "Update the staff member's information and access."
                                : "Enter the new staff member's information and access."}
                        </p>
                    </div>

                    <button
                        type="button"
                        className="staff-close-btn"
                        aria-label="Close dialog"
                        onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                <form className="staff-form" onSubmit={onSubmit}>
                    <div className="staff-form-grid">
                        <FormField
                            label="First name"
                            name="firstName"
                            value={formData.firstName}
                            error={errors.firstName}
                            placeholder="Enter first name"
                            onChange={onChange}
                        />

                        <FormField
                            label="Last name"
                            name="lastName"
                            value={formData.lastName}
                            error={errors.lastName}
                            placeholder="Enter last name"
                            onChange={onChange}
                        />

                        <FormField
                            label="Email address"
                            name="email"
                            type="email"
                            value={formData.email}
                            error={errors.email}
                            placeholder="name@company.com"
                            onChange={onChange}
                        />

                        <FormField
                            label="Phone number"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            placeholder="Enter phone number"
                            onChange={onChange}
                        />

                        <FormField
                            label="Department"
                            name="department"
                            value={formData.department}
                            error={errors.department}
                            placeholder="Example: IT Department"
                            onChange={onChange}
                        />

                        <FormField
                            label="Position"
                            name="position"
                            value={formData.position}
                            error={errors.position}
                            placeholder="Example: Software Developer"
                            onChange={onChange}
                        />

                        <SelectField
                            label="Role"
                            name="role"
                            value={formData.role}
                            options={roleOptions}
                            onChange={onChange}
                        />

                        <SelectField
                            label="Status"
                            name="status"
                            value={formData.status}
                            options={statusOptions}
                            onChange={onChange}
                        />
                    </div>

                    <div className="staff-modal-footer">
                        <button
                            type="button"
                            className="staff-cancel-btn"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="staff-submit-btn"
                        >
                            {isUpdate ? "Save Changes" : "Add Staff"}
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
    placeholder,
    error,
    onChange
}) {
    return (
        <div className="staff-form-group">
            <label htmlFor={`staff-${name}`}>{label}</label>

            <input
                id={`staff-${name}`}
                name={name}
                type={type}
                value={value}
                placeholder={placeholder}
                className={error ? "input-error" : ""}
                onChange={onChange}
            />

            {error && <span className="staff-form-error">{error}</span>}
        </div>
    );
}

function SelectField({ label, name, value, options, onChange }) {
    return (
        <div className="staff-form-group">
            <label htmlFor={`staff-${name}`}>{label}</label>

            <select
                id={`staff-${name}`}
                name={name}
                value={value}
                onChange={onChange}
            >
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
        </div>
    );
}

function getInitials(staff) {
    return `${staff.firstName.charAt(0)}${staff.lastName.charAt(0)}`.toUpperCase();
}

export default StaffHome;