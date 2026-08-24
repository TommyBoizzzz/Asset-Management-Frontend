import { useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import {
    UserPlus,
    ShieldPlus,
    Search,
    Edit3,
    Trash2,
    X,
    Shield,
    Users,
    CheckCircle2,
    MoreHorizontal,
} from "lucide-react";
import "../css/UserHome.css";

const INITIAL_USERS = [
    {
        id: 1,
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+855 12 345 678",
        username: "john.doe",
        role: "Administrator",
        status: "Active",
    },
    {
        id: 2,
        firstName: "Dara",
        lastName: "Sok",
        email: "dara.sok@example.com",
        phone: "+855 96 456 789",
        username: "dara.sok",
        role: "Manager",
        status: "Active",
    },
    {
        id: 3,
        firstName: "Sela",
        lastName: "Chan",
        email: "sela.chan@example.com",
        phone: "+855 77 123 456",
        username: "sela.chan",
        role: "Staff",
        status: "Inactive",
    },
];

const INITIAL_ROLES = [
    {
        id: 1,
        name: "Administrator",
        description: "Full access to the asset management system.",
        permissions: [
            "View Dashboard",
            "View Assets",
            "Create Assets",
            "Edit Assets",
            "Delete Assets",
            "Assign Assets",
            "View Users",
            "Register Users",
            "Edit Users",
            "Delete Users",
            "View Roles",
            "Create Roles",
            "Edit Roles",
            "Delete Roles",
            "Manage Permissions",
            "View History",
        ],
    },
    {
        id: 2,
        name: "Manager",
        description: "Manage assets, users and daily operations.",
        permissions: [
            "View Dashboard",
            "View Assets",
            "Create Assets",
            "Edit Assets",
            "Assign Assets",
            "View Users",
            "Register Users",
            "Edit Users",
            "View History",
        ],
    },
    {
        id: 3,
        name: "Staff",
        description: "Basic access for asset operations.",
        permissions: [
            "View Dashboard",
            "View Assets",
            "Assign Assets",
            "View History",
        ],
    },
];

const PERMISSION_GROUPS = [
    {
        category: "Dashboard",
        items: ["View Dashboard"],
    },
    {
        category: "Assets",
        items: [
            "View Assets",
            "Create Assets",
            "Edit Assets",
            "Delete Assets",
            "Assign Assets",
        ],
    },
    {
        category: "Users",
        items: [
            "View Users",
            "Register Users",
            "Edit Users",
            "Delete Users",
        ],
    },
    {
        category: "Roles & Permissions",
        items: [
            "View Roles",
            "Create Roles",
            "Edit Roles",
            "Delete Roles",
            "Manage Permissions",
        ],
    },
    {
        category: "History",
        items: ["View History"],
    },
];

function UserHome() {
    const [activeTab, setActiveTab] = useState("users");

    const [users, setUsers] = useState(INITIAL_USERS);
    const [roles, setRoles] = useState(INITIAL_ROLES);

    const [userDialog, setUserDialog] = useState(null);
    const [roleDialog, setRoleDialog] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);

    const [searchUser, setSearchUser] = useState("");

    const filteredUsers = users.filter((user) => {
        const search = searchUser.toLowerCase();

        return (
            `${user.firstName} ${user.lastName}`
                .toLowerCase()
                .includes(search) ||
            user.email.toLowerCase().includes(search) ||
            user.username.toLowerCase().includes(search) ||
            user.role.toLowerCase().includes(search)
        );
    });

    const handleSaveUser = (formData) => {
        if (formData.id) {
            setUsers((current) =>
                current.map((user) =>
                    user.id === formData.id ? formData : user
                )
            );
        } else {
            setUsers((current) => [
                ...current,
                {
                    ...formData,
                    id: Date.now(),
                    status: "Active",
                },
            ]);
        }

        setUserDialog(null);
    };

    const handleSaveRole = (formData) => {
        if (formData.id) {
            setRoles((current) =>
                current.map((role) =>
                    role.id === formData.id ? formData : role
                )
            );
        } else {
            setRoles((current) => [
                ...current,
                {
                    ...formData,
                    id: Date.now(),
                },
            ]);
        }

        setRoleDialog(null);
    };

    const handleDelete = () => {
        if (deleteDialog.type === "user") {
            setUsers((current) =>
                current.filter((user) => user.id !== deleteDialog.item.id)
            );
        }

        if (deleteDialog.type === "role") {
            setRoles((current) =>
                current.filter((role) => role.id !== deleteDialog.item.id)
            );
        }

        setDeleteDialog(null);
    };

    return (
        <MainLayout
            activePage="User Home"
            title="User Management"
        >
            <div className="user-management-page">

                {/* HEADER */}
                <div className="user-management-header">
                    <div>
                        <div className="page-title-row">
                            <div className="page-title-icon">
                                <Users size={22} />
                            </div>

                            <div>
                                <h2>User Management</h2>
                                <p>
                                    Manage users, roles and permissions from one place.
                                </p>
                            </div>
                        </div>
                    </div>

                    {activeTab === "users" ? (
                        <button
                            className="primary-button"
                            onClick={() => setUserDialog({ mode: "create" })}
                        >
                            <UserPlus size={18} />
                            Add User
                        </button>
                    ) : (
                        <button
                            className="primary-button"
                            onClick={() => setRoleDialog({ mode: "create" })}
                        >
                            <ShieldPlus size={18} />
                            Create Role
                        </button>
                    )}
                </div>

                {/* TABS */}
                <div className="user-tabs">
                    <button
                        className={`user-tab ${
                            activeTab === "users" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("users")}
                    >
                        <div className="tab-icon">
                            <Users size={20} />
                        </div>

                        <div className="tab-content">
                            <strong>Users</strong>
                            <small>{users.length} registered users</small>
                        </div>
                    </button>

                    <button
                        className={`user-tab ${
                            activeTab === "roles" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("roles")}
                    >
                        <div className="tab-icon">
                            <Shield size={20} />
                        </div>

                        <div className="tab-content">
                            <strong>Roles & Permissions</strong>
                            <small>{roles.length} available roles</small>
                        </div>
                    </button>
                </div>

                {/* CONTENT */}
                <div className="user-tab-panel">

                    {activeTab === "users" && (
                        <UserList
                            users={filteredUsers}
                            searchUser={searchUser}
                            setSearchUser={setSearchUser}
                            onAdd={() =>
                                setUserDialog({ mode: "create" })
                            }
                            onEdit={(user) =>
                                setUserDialog({
                                    mode: "edit",
                                    user,
                                })
                            }
                            onDelete={(user) =>
                                setDeleteDialog({
                                    type: "user",
                                    item: user,
                                })
                            }
                        />
                    )}

                    {activeTab === "roles" && (
                        <RoleList
                            roles={roles}
                            onAdd={() =>
                                setRoleDialog({ mode: "create" })
                            }
                            onEdit={(role) =>
                                setRoleDialog({
                                    mode: "edit",
                                    role,
                                })
                            }
                            onDelete={(role) =>
                                setDeleteDialog({
                                    type: "role",
                                    item: role,
                                })
                            }
                        />
                    )}
                </div>
            </div>

            {/* USER DIALOG */}
            {userDialog && (
                <UserDialog
                    user={userDialog.user}
                    onClose={() => setUserDialog(null)}
                    onSave={handleSaveUser}
                />
            )}

            {/* ROLE DIALOG */}
            {roleDialog && (
                <RoleDialog
                    role={roleDialog.role}
                    onClose={() => setRoleDialog(null)}
                    onSave={handleSaveRole}
                />
            )}

            {/* DELETE DIALOG */}
            {deleteDialog && (
                <DeleteDialog
                    type={deleteDialog.type}
                    item={deleteDialog.item}
                    onClose={() => setDeleteDialog(null)}
                    onDelete={handleDelete}
                />
            )}
        </MainLayout>
    );
}


/* =========================================================
   USER LIST
========================================================= */

function UserList({
    users,
    searchUser,
    setSearchUser,
    onAdd,
    onEdit,
    onDelete,
}) {
    return (
        <div className="management-card">

            <div className="list-header">
                <div>
                    <h3>Registered Users</h3>
                    <p>
                        Add, update and remove users from your system.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={onAdd}
                >
                    <UserPlus size={17} />
                    New User
                </button>
            </div>

            <div className="list-toolbar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        placeholder="Search users..."
                    />
                </div>

                <div className="result-count">
                    {users.length} users
                </div>
            </div>

            <div className="users-table-wrapper">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Status</th>
                            <th>Contact</th>
                            <th className="action-column">Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-cell">
                                        <div className="user-avatar">
                                            {user.firstName.charAt(0)}
                                            {user.lastName.charAt(0)}
                                        </div>

                                        <div>
                                            <strong>
                                                {user.firstName} {user.lastName}
                                            </strong>

                                            <span>{user.email}</span>
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    <span className="username-text">
                                        @{user.username}
                                    </span>
                                </td>

                                <td>
                                    <span className="role-badge">
                                        <Shield size={14} />
                                        {user.role}
                                    </span>
                                </td>

                                <td>
                                    <span
                                        className={`status-badge ${
                                            user.status.toLowerCase()
                                        }`}
                                    >
                                        <span className="status-dot" />
                                        {user.status}
                                    </span>
                                </td>

                                <td>
                                    <span className="phone-text">
                                        {user.phone}
                                    </span>
                                </td>

                                <td>
                                    <div className="row-actions">
                                        <button
                                            className="icon-action edit"
                                            title="Edit user"
                                            onClick={() => onEdit(user)}
                                        >
                                            <Edit3 size={16} />
                                        </button>

                                        <button
                                            className="icon-action delete"
                                            title="Delete user"
                                            onClick={() => onDelete(user)}
                                        >
                                            <Trash2 size={16} />
                                        </button>

                                        <button className="icon-action more">
                                            <MoreHorizontal size={17} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {users.length === 0 && (
                    <div className="empty-state">
                        <Users size={40} />
                        <h4>No users found</h4>
                        <p>Try another search or create a new user.</p>

                        <button
                            className="primary-button"
                            onClick={onAdd}
                        >
                            <UserPlus size={17} />
                            Add User
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}


/* =========================================================
   ROLE LIST
========================================================= */

function RoleList({
    roles,
    onAdd,
    onEdit,
    onDelete,
}) {
    return (
        <div className="management-card">

            <div className="list-header">
                <div>
                    <h3>Roles & Permissions</h3>
                    <p>
                        Create roles and control what each role can access.
                    </p>
                </div>

                <button
                    className="secondary-button"
                    onClick={onAdd}
                >
                    <ShieldPlus size={17} />
                    New Role
                </button>
            </div>

            <div className="role-list">
                {roles.map((role) => (
                    <div className="role-card" key={role.id}>

                        <div className="role-card-main">
                            <div className="role-card-icon">
                                <Shield size={21} />
                            </div>

                            <div className="role-card-info">
                                <div className="role-name-row">
                                    <h4>{role.name}</h4>

                                    <span className="permission-count">
                                        {role.permissions.length} permissions
                                    </span>
                                </div>

                                <p>{role.description}</p>

                                <div className="permission-preview">
                                    {role.permissions
                                        .slice(0, 5)
                                        .map((permission) => (
                                            <span key={permission}>
                                                <CheckCircle2 size={13} />
                                                {permission}
                                            </span>
                                        ))}

                                    {role.permissions.length > 5 && (
                                        <span className="more-permissions">
                                            +{role.permissions.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="role-actions">
                            <button
                                className="secondary-icon-button"
                                onClick={() => onEdit(role)}
                            >
                                <Edit3 size={16} />
                                Edit
                            </button>

                            <button
                                className="danger-icon-button"
                                onClick={() => onDelete(role)}
                            >
                                <Trash2 size={16} />
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {roles.length === 0 && (
                <div className="empty-state">
                    <Shield size={40} />
                    <h4>No roles created</h4>
                    <p>Create your first role and assign permissions.</p>

                    <button
                        className="primary-button"
                        onClick={onAdd}
                    >
                        <ShieldPlus size={17} />
                        Create Role
                    </button>
                </div>
            )}
        </div>
    );
}


/* =========================================================
   USER DIALOG
========================================================= */

function UserDialog({
    user,
    onClose,
    onSave,
}) {
    const [form, setForm] = useState({
        id: user?.id || null,
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        email: user?.email || "",
        phone: user?.phone || "",
        username: user?.username || "",
        role: user?.role || "",
        status: user?.status || "Active",
        password: "",
        confirmPassword: "",
    });

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!form.firstName || !form.lastName || !form.email) {
            return;
        }

        onSave(form);
    };

    const isEdit = Boolean(user);

    return (
        <div className="dialog-overlay" onMouseDown={onClose}>
            <div
                className="dialog user-dialog"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="dialog-header">
                    <div className="dialog-title">
                        <div className="dialog-icon">
                            <UserPlus size={20} />
                        </div>

                        <div>
                            <h3>
                                {isEdit ? "Update User" : "Add New User"}
                            </h3>
                            <p>
                                {isEdit
                                    ? "Update this user's account information."
                                    : "Create a new user account and assign a role."}
                            </p>
                        </div>
                    </div>

                    <button
                        className="dialog-close"
                        onClick={onClose}
                    >
                        <X size={19} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="dialog-body">

                        <div className="dialog-section-title">
                            Personal Information
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name</label>
                                <input
                                    value={form.firstName}
                                    onChange={(e) =>
                                        updateField(
                                            "firstName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter first name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Last Name</label>
                                <input
                                    value={form.lastName}
                                    onChange={(e) =>
                                        updateField(
                                            "lastName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter last name"
                                />
                            </div>

                            <div className="form-group">
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        updateField(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className="form-group">
                                <label>Phone Number</label>
                                <input
                                    value={form.phone}
                                    onChange={(e) =>
                                        updateField(
                                            "phone",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>

                        <div className="dialog-section-title">
                            Account Information
                        </div>

                        <div className="form-grid">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    value={form.username}
                                    onChange={(e) =>
                                        updateField(
                                            "username",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter username"
                                />
                            </div>

                            <div className="form-group">
                                <label>Role</label>

                                <select
                                    value={form.role}
                                    onChange={(e) =>
                                        updateField(
                                            "role",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="">
                                        Select role
                                    </option>
                                    <option value="Administrator">
                                        Administrator
                                    </option>
                                    <option value="Manager">
                                        Manager
                                    </option>
                                    <option value="Staff">
                                        Staff
                                    </option>
                                    <option value="User">
                                        User
                                    </option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>
                                    Password
                                    {!isEdit && (
                                        <span className="required">*</span>
                                    )}
                                </label>

                                <input
                                    type="password"
                                    value={form.password}
                                    onChange={(e) =>
                                        updateField(
                                            "password",
                                            e.target.value
                                        )
                                    }
                                    placeholder={
                                        isEdit
                                            ? "Leave blank to keep current"
                                            : "Enter password"
                                    }
                                />
                            </div>

                            <div className="form-group">
                                <label>Confirm Password</label>

                                <input
                                    type="password"
                                    value={form.confirmPassword}
                                    onChange={(e) =>
                                        updateField(
                                            "confirmPassword",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Confirm password"
                                />
                            </div>
                        </div>

                        {isEdit && (
                            <div className="form-group status-field">
                                <label>Status</label>

                                <select
                                    value={form.status}
                                    onChange={(e) =>
                                        updateField(
                                            "status",
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="Active">Active</option>
                                    <option value="Inactive">
                                        Inactive
                                    </option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="dialog-footer">
                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                        >
                            {isEdit ? (
                                <>
                                    <Edit3 size={17} />
                                    Update User
                                </>
                            ) : (
                                <>
                                    <UserPlus size={17} />
                                    Create User
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


/* =========================================================
   ROLE DIALOG
========================================================= */

function RoleDialog({
    role,
    onClose,
    onSave,
}) {
    const [name, setName] = useState(role?.name || "");

    const [description, setDescription] = useState(
        role?.description || ""
    );

    const [selectedPermissions, setSelectedPermissions] =
        useState(role?.permissions || []);

    const isEdit = Boolean(role);

    const togglePermission = (permission) => {
        setSelectedPermissions((current) => {
            if (current.includes(permission)) {
                return current.filter(
                    (item) => item !== permission
                );
            }

            return [...current, permission];
        });
    };

    const selectAll = () => {
        const allPermissions =
            PERMISSION_GROUPS.flatMap(
                (group) => group.items
            );

        setSelectedPermissions(allPermissions);
    };

    const clearAll = () => {
        setSelectedPermissions([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!name.trim()) {
            return;
        }

        onSave({
            id: role?.id || null,
            name: name.trim(),
            description: description.trim(),
            permissions: selectedPermissions,
        });
    };

    return (
        <div
            className="dialog-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose();
                }
            }}
        >
            <div
                className="dialog role-dialog"
                onClick={(e) => e.stopPropagation()}
            >

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="dialog-header">
                    <div className="dialog-title">
                        <div className="dialog-icon role">
                            <ShieldPlus size={20} />
                        </div>

                        <div>
                            <h3>
                                {isEdit
                                    ? "Update Role"
                                    : "Create New Role"}
                            </h3>

                            <p>
                                Create a role and select its
                                permissions.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="dialog-close"
                        onClick={onClose}
                    >
                        <X size={19} />
                    </button>
                </div>

                {/* =================================================
                    FORM
                ================================================= */}

                <form
                    className="role-dialog-form"
                    onSubmit={handleSubmit}
                >

                    {/* =================================================
                        SCROLLABLE BODY
                    ================================================= */}

                    <div className="dialog-body role-dialog-body">

                        {/* ROLE INFORMATION */}

                        <div className="dialog-section-title">
                            Role Information
                        </div>

                        <div className="role-form-top">

                            <div className="form-group">
                                <label>
                                    Role Name
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Asset Manager"
                                />
                            </div>

                            <div className="form-group">
                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(
                                            e.target.value
                                        )
                                    }
                                    rows={3}
                                    placeholder="Describe this role..."
                                />
                            </div>

                        </div>

                        {/* =================================================
                            PERMISSIONS HEADER
                        ================================================= */}

                        <div className="permissions-dialog-header">

                            <div>
                                <h4>
                                    Permissions
                                </h4>

                                <p>
                                    Choose what this role is
                                    allowed to access.
                                </p>
                            </div>

                            <div className="permission-actions">

                                <button
                                    type="button"
                                    onClick={selectAll}
                                >
                                    Select All
                                </button>

                                <button
                                    type="button"
                                    onClick={clearAll}
                                >
                                    Clear
                                </button>

                            </div>

                        </div>

                        {/* =================================================
                            PERMISSIONS
                        ================================================= */}

                        <div className="permissions-dialog-list">

                            {PERMISSION_GROUPS.map(
                                (group) => (
                                    <div
                                        className="permission-dialog-group"
                                        key={group.category}
                                    >

                                        <div className="permission-dialog-category">
                                            {group.category}
                                        </div>

                                        <div className="permission-dialog-items">

                                            {group.items.map(
                                                (
                                                    permission
                                                ) => {
                                                    const checked =
                                                        selectedPermissions.includes(
                                                            permission
                                                        );

                                                    return (
                                                        <label
                                                            className={`permission-checkbox ${
                                                                checked
                                                                    ? "checked"
                                                                    : ""
                                                            }`}
                                                            key={
                                                                permission
                                                            }
                                                        >

                                                            <input
                                                                type="checkbox"
                                                                checked={
                                                                    checked
                                                                }
                                                                onChange={() =>
                                                                    togglePermission(
                                                                        permission
                                                                    )
                                                                }
                                                            />

                                                            <span className="checkbox-ui">
                                                                {checked &&
                                                                    "✓"}
                                                            </span>

                                                            <span>
                                                                {
                                                                    permission
                                                                }
                                                            </span>

                                                        </label>
                                                    );
                                                }
                                            )}

                                        </div>
                                    </div>
                                )
                            )}

                        </div>

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="dialog-footer">

                        <span className="selected-permissions">
                            {selectedPermissions.length}{" "}
                            permissions selected
                        </span>

                        <div className="dialog-footer-actions">

                            <button
                                type="button"
                                className="secondary-button"
                                onClick={onClose}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-button"
                            >
                                {isEdit ? (
                                    <>
                                        <Edit3 size={17} />
                                        Update Role
                                    </>
                                ) : (
                                    <>
                                        <ShieldPlus size={17} />
                                        Create Role
                                    </>
                                )}
                            </button>

                        </div>

                    </div>

                </form>
            </div>
        </div>
    );
}


/* =========================================================
   DELETE DIALOG
========================================================= */

function DeleteDialog({
    type,
    item,
    onClose,
    onDelete,
}) {
    const isUser = type === "user";

    const title = isUser
        ? "Delete User?"
        : "Delete Role?";

    const name = isUser
        ? `${item.firstName} ${item.lastName}`
        : item.name;

    return (
        <div
            className="dialog-overlay"
            onMouseDown={onClose}
        >
            <div
                className="dialog delete-dialog"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="delete-icon">
                    <Trash2 size={23} />
                </div>

                <h3>{title}</h3>

                <p>
                    Are you sure you want to delete{" "}
                    <strong>{name}</strong>?
                    <br />
                    This action cannot be undone.
                </p>

                <div className="delete-actions">
                    <button
                        className="secondary-button"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="delete-confirm-button"
                        onClick={onDelete}
                    >
                        <Trash2 size={17} />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserHome;