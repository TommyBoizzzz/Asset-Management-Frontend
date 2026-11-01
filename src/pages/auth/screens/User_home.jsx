import { useEffect, useMemo, useState } from "react";
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
    MoreHorizontal,
    RefreshCw,
    Mail,
    Phone,
    User,
} from "lucide-react";

import UserService from "../services/UserService";
import RoleService from "../services/RoleService";

import "../css/UserHome.css";


/* =========================================================
   HELPERS
========================================================= */

const getResponseData = (response) => {
    const data = response?.data;

    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) return data.data;

    return [];
};


const getErrorMessage = (error, fallback) => {
    const responseData = error?.response?.data;

    if (typeof responseData === "string") {
        return responseData;
    }

    return (
        responseData?.message ||
        responseData?.error ||
        error?.message ||
        fallback
    );
};


const getFullName = (user) => {
    return `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
};


const getInitials = (user) => {
    const first = user?.firstName?.charAt(0) || "";
    const last = user?.lastName?.charAt(0) || "";

    return `${first}${last}`.toUpperCase() || "U";
};


/* =========================================================
   USER MANAGEMENT PAGE
========================================================= */

function UserHome() {

    /* =====================================================
       TABS
    ===================================================== */

    const [activeTab, setActiveTab] = useState("users");


    /* =====================================================
       USERS
    ===================================================== */

    const [users, setUsers] = useState([]);
    const [loadingUsers, setLoadingUsers] = useState(false);
    const [userError, setUserError] = useState("");
    const [searchUser, setSearchUser] = useState("");


    /* =====================================================
       ROLES
    ===================================================== */

    const [roles, setRoles] = useState([]);
    const [loadingRoles, setLoadingRoles] = useState(false);
    const [roleError, setRoleError] = useState("");


    /* =====================================================
       DIALOGS
    ===================================================== */

    const [userDialog, setUserDialog] = useState(null);
    const [roleDialog, setRoleDialog] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState(null);


    /* =====================================================
       LOADING ACTIONS
    ===================================================== */

    const [savingUser, setSavingUser] = useState(false);
    const [savingRole, setSavingRole] = useState(false);
    const [deleting, setDeleting] = useState(false);


    /* =====================================================
       FETCH USERS
    ===================================================== */

    const fetchUsers = async () => {

        try {
            setLoadingUsers(true);
            setUserError("");

            const response = await UserService.getAll();

            const data = getResponseData(response);

            console.log("Users from API:", data);

            setUsers(data);

        } catch (error) {

            console.error("Failed to fetch users:", error);

            setUserError(
                getErrorMessage(error, "Failed to load users.")
            );

        } finally {
            setLoadingUsers(false);
        }
    };


    /* =====================================================
       FETCH ROLES
    ===================================================== */

    const fetchRoles = async () => {

        try {
            setLoadingRoles(true);
            setRoleError("");

            const response = await RoleService.getAll();

            const data = getResponseData(response);

            console.log("Roles from API:", data);

            setRoles(data);

        } catch (error) {

            console.error("Failed to fetch roles:", error);

            setRoleError(
                getErrorMessage(error, "Failed to load roles.")
            );

        } finally {
            setLoadingRoles(false);
        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);


    /* =====================================================
       FILTER USERS
    ===================================================== */

    const filteredUsers = useMemo(() => {

        const search = searchUser.toLowerCase().trim();

        if (!search) return users;

        return users.filter((user) => {

            const fullName = getFullName(user).toLowerCase();

            const email = (user.email || "").toLowerCase();

            const username = (user.username || "").toLowerCase();

            const role = (user.role?.name || "").toLowerCase();

            const phone = (user.phone || "").toLowerCase();

            return (
                fullName.includes(search) ||
                email.includes(search) ||
                username.includes(search) ||
                role.includes(search) ||
                phone.includes(search)
            );
        });

    }, [users, searchUser]);


    /* =====================================================
       SAVE USER
    ===================================================== */

    const handleSaveUser = async (formData) => {

        try {

            setSavingUser(true);
            setUserError("");

            const data = {

                username: formData.username.trim(),

                email: formData.email.trim(),

                firstName: formData.firstName.trim(),

                lastName: formData.lastName.trim(),

                phone: formData.phone.trim(),

                status: formData.status,

                role: {
                    id: Number(formData.roleId),
                },

            };


            // Password is only sent when provided.

            if (formData.password) {
                data.password = formData.password;
            }


            console.log("Sending user data:", data);


            /* =============================================
               UPDATE USER
            ============================================= */

            if (formData.id) {

                const response = await UserService.update(
                    formData.id,
                    data
                );

                const updatedUser =
                    response.data?.data || response.data;

                setUsers((current) =>
                    current.map((user) =>
                        user.id === formData.id
                            ? updatedUser
                            : user
                    )
                );

            }


            /* =============================================
               CREATE USER
            ============================================= */

            else {

                const response = await UserService.create(data);

                const newUser =
                    response.data?.data || response.data;

                setUsers((current) => [
                    ...current,
                    newUser,
                ]);

            }


            setUserDialog(null);

        } catch (error) {

            console.error("========== SAVE USER ERROR ==========");
            console.error(error);
            console.error("Status:", error.response?.status);
            console.error("Response:", error.response?.data);
            console.error("====================================");

            alert(
                `${getErrorMessage(error, "Failed to save user.")}\nStatus: ${
                    error.response?.status || "Unknown"
                }`
            );

        } finally {
            setSavingUser(false);
        }
    };


    /* =====================================================
       SAVE ROLE
    ===================================================== */

    const handleSaveRole = async (formData) => {

        try {

            setSavingRole(true);
            setRoleError("");

            const data = {

                name: formData.name.trim(),

                description: formData.description.trim(),

            };


            /* =============================================
               UPDATE ROLE
            ============================================= */

            if (formData.id) {

                const response = await RoleService.update(
                    formData.id,
                    data
                );

                const updatedRole =
                    response.data?.data || response.data;

                setRoles((current) =>
                    current.map((role) =>
                        role.id === formData.id
                            ? updatedRole
                            : role
                    )
                );

            }


            /* =============================================
               CREATE ROLE
            ============================================= */

            else {

                const response = await RoleService.create(data);

                const newRole =
                    response.data?.data || response.data;

                setRoles((current) => [
                    ...current,
                    newRole,
                ]);

            }


            setRoleDialog(null);

        } catch (error) {

            console.error("Failed to save role:", error);

            alert(
                getErrorMessage(error, "Failed to save role.")
            );

        } finally {
            setSavingRole(false);
        }
    };


    /* =====================================================
       DELETE USER / ROLE
    ===================================================== */

    const handleDelete = async () => {

        if (!deleteDialog || deleting) return;

        try {

            setDeleting(true);

            const itemId = deleteDialog.item.id;


            /* =============================================
               DELETE USER
            ============================================= */

            if (deleteDialog.type === "user") {

                await UserService.delete(itemId);

                setUsers((current) =>
                    current.filter(
                        (user) => user.id !== itemId
                    )
                );

            }


            /* =============================================
               DELETE ROLE
            ============================================= */

            else if (deleteDialog.type === "role") {

                await RoleService.delete(itemId);

                setRoles((current) =>
                    current.filter(
                        (role) => role.id !== itemId
                    )
                );

                // Refresh users after deleting a role.
                await fetchUsers();

            }


            setDeleteDialog(null);

        } catch (error) {

            console.error("Failed to delete:", error);

            alert(
                getErrorMessage(error, "Failed to delete.")
            );

        } finally {
            setDeleting(false);
        }
    };


    /* =====================================================
       OPEN USER DIALOG
    ===================================================== */

    const openCreateUser = () => {
        setUserDialog({
            mode: "create",
            user: null,
        });
    };


    const openEditUser = (user) => {
        setUserDialog({
            mode: "edit",
            user,
        });
    };


    /* =====================================================
       OPEN ROLE DIALOG
    ===================================================== */

    const openCreateRole = () => {
        setRoleDialog({
            mode: "create",
            role: null,
        });
    };


    const openEditRole = (role) => {
        setRoleDialog({
            mode: "edit",
            role,
        });
    };


    /* =====================================================
       OPEN DELETE DIALOG
    ===================================================== */

    const openDeleteDialog = (type, item) => {

        setDeleteDialog({
            type,
            item,
        });

    };


    /* =====================================================
       RETURN
    ===================================================== */

    return (

        <MainLayout
            activePage="User Home"
            title="User Management"
        >

            <div className="user-management-page">

                {/* =========================================
                   PAGE HEADER
                ========================================= */}

                <div className="user-management-header">

                    <div className="page-title-row">

                        <div className="page-title-icon">
                            <Users size={22} />
                        </div>

                        <div>

                            <h2>User Management</h2>

                            <p>
                                Manage users, roles and permissions
                                from one place.
                            </p>

                        </div>

                    </div>


                    {activeTab === "users" ? (

                        <button
                            type="button"
                            className="primary-button"
                            onClick={openCreateUser}
                        >
                            <UserPlus size={18} />
                            Add User
                        </button>

                    ) : (

                        <button
                            type="button"
                            className="primary-button"
                            onClick={openCreateRole}
                        >
                            <ShieldPlus size={18} />
                            Create Role
                        </button>

                    )}

                </div>


                {/* =========================================
                   TABS
                ========================================= */}

                <div className="user-tabs">

                    <button
                        type="button"
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

                            <small>
                                {users.length} registered users
                            </small>

                        </div>

                    </button>


                    <button
                        type="button"
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

                            <small>
                                {roles.length} available roles
                            </small>

                        </div>

                    </button>

                </div>


                {/* =========================================
                   CONTENT
                ========================================= */}

                <div className="user-tab-panel">

                    {activeTab === "users" && (

                        <UserList

                            users={filteredUsers}

                            searchUser={searchUser}

                            setSearchUser={setSearchUser}

                            loading={loadingUsers}

                            error={userError}

                            onRetry={fetchUsers}

                            onAdd={openCreateUser}

                            onEdit={openEditUser}

                            onDelete={(user) =>
                                openDeleteDialog("user", user)
                            }

                        />

                    )}


                    {activeTab === "roles" && (

                        <RoleList

                            roles={roles}

                            loading={loadingRoles}

                            error={roleError}

                            onRetry={fetchRoles}

                            onAdd={openCreateRole}

                            onEdit={openEditRole}

                            onDelete={(role) =>
                                openDeleteDialog("role", role)
                            }

                        />

                    )}

                </div>

            </div>


            {/* =============================================
               USER DIALOG
            ============================================= */}

            {userDialog && (

                <UserDialog

                    key={
                        userDialog.user?.id || "new-user"
                    }

                    user={userDialog.user}

                    roles={roles}

                    saving={savingUser}

                    onClose={() => setUserDialog(null)}

                    onSave={handleSaveUser}

                />

            )}


            {/* =============================================
               ROLE DIALOG
            ============================================= */}

            {roleDialog && (

                <RoleDialog

                    key={
                        roleDialog.role?.id || "new-role"
                    }

                    role={roleDialog.role}

                    saving={savingRole}

                    onClose={() => setRoleDialog(null)}

                    onSave={handleSaveRole}

                />

            )}


            {/* =============================================
               DELETE DIALOG
            ============================================= */}

            {deleteDialog && (

                <DeleteDialog

                    type={deleteDialog.type}

                    item={deleteDialog.item}

                    deleting={deleting}

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
    loading,
    error,
    onRetry,
    onAdd,
    onEdit,
    onDelete,
}) {

    return (

        <div className="management-card">

            {/* HEADER */}

            <div className="list-header">

                <div>

                    <h3>Registered Users</h3>

                    <p>
                        Add, update and remove users from your system.
                    </p>

                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onAdd}
                >
                    <UserPlus size={17} />
                    New User
                </button>

            </div>


            {/* TOOLBAR */}

            <div className="list-toolbar">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        value={searchUser}
                        onChange={(e) =>
                            setSearchUser(e.target.value)
                        }
                        placeholder="Search users..."
                    />

                    {searchUser && (

                        <button
                            type="button"
                            className="search-clear"
                            onClick={() => setSearchUser("")}
                            title="Clear search"
                        >
                            <X size={15} />
                        </button>

                    )}

                </div>


                <div className="result-count">

                    {loading
                        ? "Loading..."
                        : `${users.length} users`
                    }

                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="user-error-message">

                    <p>{error}</p>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onRetry}
                    >
                        <RefreshCw size={15} />
                        Try Again
                    </button>

                </div>

            )}


            {/* TABLE */}

            <div className="users-table-wrapper">

                {loading ? (

                    <div className="empty-state">

                        <Users size={40} />

                        <h4>Loading users...</h4>

                        <p>
                            Please wait while we load your users.
                        </p>

                    </div>

                ) : users.length === 0 ? (

                    <div className="empty-state">

                        <Users size={40} />

                        <h4>No users found</h4>

                        <p>
                            Try another search or create a new user.
                        </p>

                        {!searchUser && (

                            <button
                                type="button"
                                className="primary-button"
                                onClick={onAdd}
                            >
                                <UserPlus size={17} />
                                Add User
                            </button>

                        )}

                    </div>

                ) : (

                    <table className="users-table">

                        <thead>

                            <tr>
                                <th>User</th>
                                <th>Username</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th>Contact</th>
                                <th className="action-column">
                                    Actions
                                </th>
                            </tr>

                        </thead>


                        <tbody>

                            {users.map((user) => (

                                <tr key={user.id}>

                                    {/* USER */}

                                    <td>

                                        <div className="user-cell">

                                            <div className="user-avatar">
                                                {getInitials(user)}
                                            </div>

                                            <div>

                                                <strong>
                                                    {getFullName(user) || "Unnamed User"}
                                                </strong>

                                                <span>
                                                    {user.email || "-"}
                                                </span>

                                            </div>

                                        </div>

                                    </td>


                                    {/* USERNAME */}

                                    <td>

                                        <span className="username-text">
                                            @{user.username || "-"}
                                        </span>

                                    </td>


                                    {/* ROLE */}

                                    <td>

                                        <span className="role-badge">

                                            <Shield size={14} />

                                            {user.role?.name || "No Role"}

                                        </span>

                                    </td>


                                    {/* STATUS */}

                                    <td>

                                        <span
                                            className={`status-badge ${
                                                (user.status || "ACTIVE").toLowerCase()
                                            }`}
                                        >

                                            <span className="status-dot" />

                                            {user.status || "ACTIVE"}

                                        </span>

                                    </td>


                                    {/* CONTACT */}

                                    <td>

                                        <div className="contact-cell">

                                            <span>
                                                <Phone size={12} />
                                                {user.phone || "-"}
                                            </span>

                                        </div>

                                    </td>


                                    {/* ACTIONS */}

                                    <td>

                                        <div className="row-actions">

                                            <button
                                                type="button"
                                                className="icon-action edit"
                                                title="Edit user"
                                                onClick={() => onEdit(user)}
                                            >
                                                <Edit3 size={16} />
                                            </button>


                                            <button
                                                type="button"
                                                className="icon-action delete"
                                                title="Delete user"
                                                onClick={() => onDelete(user)}
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <button
                                                type="button"
                                                className="icon-action more"
                                                title="More actions"
                                                onClick={() => onEdit(user)}
                                            >
                                                <MoreHorizontal size={17} />
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

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
    loading,
    error,
    onRetry,
    onAdd,
    onEdit,
    onDelete,
}) {

    return (

        <div className="management-card">

            {/* HEADER */}

            <div className="list-header">

                <div>

                    <h3>Roles & Permissions</h3>

                    <p>
                        Create roles and control what each role can access.
                    </p>

                </div>

                <button
                    type="button"
                    className="secondary-button"
                    onClick={onAdd}
                >
                    <ShieldPlus size={17} />
                    New Role
                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div className="user-error-message">

                    <p>{error}</p>

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onRetry}
                    >
                        <RefreshCw size={15} />
                        Try Again
                    </button>

                </div>

            )}


            {/* LOADING */}

            {loading ? (

                <div className="empty-state">

                    <Shield size={40} />

                    <h4>Loading roles...</h4>

                    <p>
                        Please wait while we load your roles.
                    </p>

                </div>

            ) : (

                <div className="role-list">

                    {roles.map((role) => (

                        <div
                            className="role-card"
                            key={role.id}
                        >

                            <div className="role-card-main">

                                <div className="role-card-icon">
                                    <Shield size={21} />
                                </div>

                                <div className="role-card-info">

                                    <div className="role-name-row">

                                        <h4>{role.name}</h4>

                                    </div>

                                    <p>
                                        {role.description || "No description."}
                                    </p>

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="role-actions">

                                <button
                                    type="button"
                                    className="secondary-icon-button"
                                    onClick={() => onEdit(role)}
                                >
                                    <Edit3 size={16} />
                                    Edit
                                </button>

                                <button
                                    type="button"
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

            )}


            {/* EMPTY */}

            {!loading && roles.length === 0 && (

                <div className="empty-state">

                    <Shield size={40} />

                    <h4>No roles created</h4>

                    <p>Create your first role.</p>

                    <button
                        type="button"
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
    roles,
    saving,
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

        roleId: user?.role?.id?.toString() || "",

        status: user?.status || "ACTIVE",

        password: "",

    });


    const [error, setError] = useState("");


    const isEdit = Boolean(user);


    /* =====================================================
       UPDATE FIELD
    ===================================================== */

    const updateField = (field, value) => {

        setForm((current) => ({
            ...current,
            [field]: value,
        }));

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = (e) => {

        e.preventDefault();

        setError("");


        if (
            !form.firstName.trim() ||
            !form.lastName.trim() ||
            !form.email.trim()
        ) {

            setError(
                "First name, last name and email are required."
            );

            return;
        }


        if (!form.username.trim()) {

            setError("Username is required.");

            return;
        }


        if (!form.roleId) {

            setError("Please select a role.");

            return;
        }


        if (!isEdit && !form.password) {

            setError("Password is required.");

            return;
        }


        if (!isEdit && form.password.length < 6) {

            setError("Password must be at least 6 characters.");

            return;
        }


        const data = {

            id: form.id,

            firstName: form.firstName.trim(),

            lastName: form.lastName.trim(),

            email: form.email.trim(),

            phone: form.phone.trim(),

            username: form.username.trim(),

            roleId: Number(form.roleId),

            status: form.status,

            password: form.password,

        };


        onSave(data);

    };


    return (

        <div
            className="dialog-overlay"
            onMouseDown={onClose}
        >

            <div
                className="dialog user-dialog"
                onMouseDown={(e) => e.stopPropagation()}
            >

                {/* HEADER */}

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
                                    : "Create a new user account and assign a role."
                                }
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="dialog-close"
                        onClick={onClose}
                        disabled={saving}
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="dialog-body">

                        {error && (

                            <div className="user-error-message">
                                {error}
                            </div>

                        )}


                        {/* PERSONAL INFORMATION */}

                        <div className="dialog-section-title">
                            Personal Information
                        </div>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    First Name <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={form.firstName}
                                    onChange={(e) =>
                                        updateField("firstName", e.target.value)
                                    }
                                    placeholder="Enter first name"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Last Name <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={form.lastName}
                                    onChange={(e) =>
                                        updateField("lastName", e.target.value)
                                    }
                                    placeholder="Enter last name"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Email Address <span className="required">*</span>
                                </label>

                                <input
                                    type="email"
                                    value={form.email}
                                    onChange={(e) =>
                                        updateField("email", e.target.value)
                                    }
                                    placeholder="Enter email address"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>Phone Number</label>

                                <input
                                    type="tel"
                                    value={form.phone}
                                    onChange={(e) =>
                                        updateField("phone", e.target.value)
                                    }
                                    placeholder="Enter phone number"
                                />

                            </div>

                        </div>


                        {/* ACCOUNT INFORMATION */}

                        <div className="dialog-section-title">
                            Account Information
                        </div>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Username <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={form.username}
                                    onChange={(e) =>
                                        updateField("username", e.target.value)
                                    }
                                    placeholder="Enter username"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Role <span className="required">*</span>
                                </label>

                                <select
                                    value={form.roleId}
                                    onChange={(e) =>
                                        updateField("roleId", e.target.value)
                                    }
                                    required
                                >

                                    <option value="">
                                        Select role
                                    </option>

                                    {roles.map((role) => (

                                        <option
                                            key={role.id}
                                            value={role.id}
                                        >
                                            {role.name}
                                        </option>

                                    ))}

                                </select>

                                {roles.length === 0 && (

                                    <small>
                                        No roles available. Please create a role first.
                                    </small>

                                )}

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
                                        updateField("password", e.target.value)
                                    }
                                    placeholder={
                                        isEdit
                                            ? "Leave blank to keep current"
                                            : "Enter password"
                                    }
                                    required={!isEdit}
                                    minLength={6}
                                />

                            </div>


                            {/* STATUS */}

                            {isEdit && (

                                <div className="form-group status-field">

                                    <label>Status</label>

                                    <select
                                        value={form.status}
                                        onChange={(e) =>
                                            updateField("status", e.target.value)
                                        }
                                    >

                                        <option value="ACTIVE">
                                            Active
                                        </option>

                                        <option value="INACTIVE">
                                            Inactive
                                        </option>

                                    </select>

                                </div>

                            )}

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="dialog-footer">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving || roles.length === 0}
                        >

                            {saving ? (
                                <>
                                    <RefreshCw size={16} />
                                    Saving...
                                </>
                            ) : isEdit ? (
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
    saving,
    onClose,
    onSave,
}) {

    const [name, setName] = useState(role?.name || "");

    const [description, setDescription] = useState(
        role?.description || ""
    );

    const [error, setError] = useState("");

    const isEdit = Boolean(role);


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit = (e) => {

        e.preventDefault();

        setError("");

        if (!name.trim()) {

            setError("Role name is required.");

            return;
        }


        onSave({

            id: role?.id || null,

            name: name.trim(),

            description: description.trim(),

        });

    };


    return (

        <div
            className="dialog-overlay"
            onMouseDown={onClose}
        >

            <div
                className="dialog role-dialog"
                onMouseDown={(e) => e.stopPropagation()}
            >

                {/* HEADER */}

                <div className="dialog-header">

                    <div className="dialog-title">

                        <div className="dialog-icon role">
                            <ShieldPlus size={20} />
                        </div>

                        <div>

                            <h3>
                                {isEdit ? "Update Role" : "Create New Role"}
                            </h3>

                            <p>
                                Create a role for your users.
                            </p>

                        </div>

                    </div>

                    <button
                        type="button"
                        className="dialog-close"
                        onClick={onClose}
                        disabled={saving}
                    >
                        <X size={19} />
                    </button>

                </div>


                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="dialog-body">

                        {error && (

                            <div className="user-error-message">
                                {error}
                            </div>

                        )}

                        <div className="dialog-section-title">
                            Role Information
                        </div>

                        <div className="form-grid">

                            <div className="form-group">

                                <label>
                                    Role Name <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) =>
                                        setName(e.target.value)
                                    }
                                    placeholder="e.g. Manager"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>Description</label>

                                <textarea
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
                                    rows={3}
                                    placeholder="Describe this role..."
                                />

                            </div>

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="dialog-footer">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={onClose}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-button"
                            disabled={saving}
                        >

                            {saving ? (
                                <>
                                    <RefreshCw size={16} />
                                    Saving...
                                </>
                            ) : isEdit ? (
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
    deleting,
    onClose,
    onDelete,
}) {

    const isUser = type === "user";

    const title = isUser
        ? "Delete User?"
        : "Delete Role?";


    const name = isUser
        ? getFullName(item)
        : item?.name;


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

                    <strong>
                        {name || "this item"}
                    </strong>

                    ?

                    <br />

                    This action cannot be undone.

                </p>


                <div className="delete-actions">

                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                        disabled={deleting}
                    >
                        Cancel
                    </button>


                    <button
                        type="button"
                        className="delete-confirm-button"
                        onClick={onDelete}
                        disabled={deleting}
                    >

                        {deleting ? (
                            <>
                                <RefreshCw size={16} />
                                Deleting...
                            </>
                        ) : (
                            <>
                                <Trash2 size={17} />
                                Delete
                            </>
                        )}

                    </button>

                </div>

            </div>

        </div>

    );

}


/* =========================================================
   EXPORT
========================================================= */

export default UserHome;