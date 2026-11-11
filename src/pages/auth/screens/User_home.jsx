import { Fragment, useMemo, useState } from "react";
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
    ChevronLeft,
    ChevronRight,
} from "lucide-react";

import UserService from "../services/UserService";
import RoleService from "../services/RoleService";
import useIntervalRefresh from "../../../hooks/useIntervalRefresh";
import {
    ALL_PERMISSION_KEYS,
    APP_PERMISSION_PAGES,
    MAINTENANCE_ASSIGNMENT_PERMISSION,
    PERMISSION_ACTIONS,
    canAssignMaintenanceUser,
    getStoredUser,
    hasPermission,
    updateStoredUser,
} from "../../../utils/permissions";

import "../css/UserHome.css";


/* =========================================================
   HELPERS
========================================================= */

const LIST_PAGE_SIZE = 5;

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
    return user?.fullName || "UNKNOWN";
};


const getInitials = (user) => {
    const fullName = (user?.fullName || "User").trim();
    const words = fullName.split(/\s+/).filter(Boolean);

    if (words.length === 1) {
        return words[0].slice(0, 2).toUpperCase();
    }

    return words
        .slice(0, 2)
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase() || "U";
};


function ListPagination({ page, totalPages, onPageChange, label }) {
    return (
        <nav className="management-pagination" aria-label={label}>
            <button
                type="button"
                aria-label="Previous page"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                <ChevronLeft size={16} aria-hidden="true" />
            </button>

            <button
                type="button"
                className="management-page-number is-current"
                aria-current="page"
                aria-label={`Page ${page} of ${totalPages}`}
            >
                {page}
            </button>

            <span className="management-pagination-total">
                <span>of</span> {totalPages}
            </span>

            <button
                type="button"
                aria-label="Next page"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                <ChevronRight size={16} aria-hidden="true" />
            </button>
        </nav>
    );
}

const normalizeGender = (value) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const normalized = String(value).trim();
    const upper = normalized.toUpperCase();

    if (["MALE", "FEMALE", "OTHER"].includes(upper)) {
        return upper;
    }

    return normalized;
};


/* =========================================================
   USER MANAGEMENT PAGE
========================================================= */

function UserHome() {
    const currentUser = getStoredUser();
    const canViewUsers = hasPermission(currentUser, "user-management", "view");
    const canCreateUsers = hasPermission(currentUser, "user-management", "create");
    const canEditUsers = hasPermission(currentUser, "user-management", "edit");
    const canDeleteUsers = hasPermission(currentUser, "user-management", "delete");
    const canViewRoles = hasPermission(currentUser, "role-management", "view");
    const canCreateRoles = hasPermission(currentUser, "role-management", "create");
    const canEditRoles = hasPermission(currentUser, "role-management", "edit");
    const canDeleteRoles = hasPermission(currentUser, "role-management", "delete");

    /* =====================================================
       TABS
    ===================================================== */

    const [activeTab, setActiveTab] = useState(() =>
        canViewUsers ? "users" : "roles"
    );


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
    const [userDetailDialog, setUserDetailDialog] = useState(null);
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

    const fetchUsers = async (background = false) => {

        try {
            if (!background) {
                setLoadingUsers(true);
                setUserError("");
            }

            const response = await UserService.getAll();

            const data = getResponseData(response);

            if (!background) console.log("Users from API:", data);

            setUsers(data);
            if (background) setUserError("");

        } catch (error) {

            console.error("Failed to fetch users:", error);

            if (!background) {
                setUserError(
                    getErrorMessage(error, "Failed to load users.")
                );
            }

        } finally {
            if (!background) setLoadingUsers(false);
        }
    };


    /* =====================================================
       FETCH ROLES
    ===================================================== */

    const fetchRoles = async (background = false) => {

        try {
            if (!background) {
                setLoadingRoles(true);
                setRoleError("");
            }

            const response = await RoleService.getAll();

            const data = getResponseData(response);

            if (!background) console.log("Roles from API:", data);

            setRoles(data);
            if (background) setRoleError("");

        } catch (error) {

            console.error("Failed to fetch roles:", error);

            if (!background) {
                setRoleError(
                    getErrorMessage(error, "Failed to load roles.")
                );
            }

        } finally {
            if (!background) setLoadingRoles(false);
        }
    };


    /* =====================================================
       INITIAL LOAD
    ===================================================== */

    useIntervalRefresh(
        (background) =>
            Promise.all([
                fetchUsers(background),
                fetchRoles(background),
            ]),
        60_000,
        true
    );


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
        if (formData.id ? !canEditUsers : !canCreateUsers) return;

        try {

            setSavingUser(true);
            setUserError("");

            const fullName = (formData.fullName || "").trim();
            const roleId = Number(formData.roleId);

            const data = {

                username: formData.username.trim(),

                email: formData.email.trim(),

                fullName,

                gender: normalizeGender(formData.gender) || null,

                phone: formData.phone?.trim() || null,

                department: formData.department?.trim() || null,

                position: formData.position?.trim() || null,

                status: formData.status || "ACTIVE",

                role: roleId ? { id: roleId } : null,

                roleId: roleId || null,

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

                if (String(getStoredUser()?.id) === String(updatedUser.id)) {
                    updateStoredUser(updatedUser);
                }

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
        if (formData.id ? !canEditRoles : !canCreateRoles) return;

        try {

            setSavingRole(true);
            setRoleError("");

            const data = {

                name: formData.name.trim(),

                description: formData.description.trim(),

                permissions: [
                    ...formData.permissions.filter(
                        (permission) => permission !== MAINTENANCE_ASSIGNMENT_PERMISSION
                    ),
                    ...(formData.canAssignMaintenance
                        ? [MAINTENANCE_ASSIGNMENT_PERMISSION]
                        : []),
                ],

                permissionsConfigured: true,

            };


            /* =============================================
               UPDATE ROLE
            ============================================= */

            if (formData.id) {

                const response = await RoleService.update(
                    formData.id,
                    data
                );

                const updatedRoleResponse =
                    response.data?.data || response.data;
                const updatedRole = {
                    ...data,
                    ...updatedRoleResponse,
                    permissions:
                        updatedRoleResponse?.permissions ?? data.permissions,
                };

                const loggedInUser = getStoredUser();
                if (
                    String(loggedInUser?.role?.id) === String(updatedRole.id)
                ) {
                    updateStoredUser({
                        ...loggedInUser,
                        role: updatedRole,
                    });
                }

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

                const newRoleResponse =
                    response.data?.data || response.data;
                const newRole = {
                    ...data,
                    ...newRoleResponse,
                    permissions:
                        newRoleResponse?.permissions ?? data.permissions,
                };

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
        if (deleteDialog.type === "user" ? !canDeleteUsers : !canDeleteRoles) {
            return;
        }

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
        if (!canCreateUsers) return;
        setUserDialog({
            mode: "create",
            user: null,
        });
    };


    const openEditUser = (user) => {
        if (!canEditUsers) return;
        setUserDialog({
            mode: "edit",
            user,
        });
    };


    const openUserDetail = (user) => {
        setUserDetailDialog(user);
    };


    /* =====================================================
       OPEN ROLE DIALOG
    ===================================================== */

    const openCreateRole = () => {
        if (!canCreateRoles) return;
        setRoleDialog({
            mode: "create",
            role: null,
        });
    };


    const openEditRole = (role) => {
        if (!canEditRoles) return;
        setRoleDialog({
            mode: "edit",
            role,
        });
    };


    /* =====================================================
       OPEN DELETE DIALOG
    ===================================================== */

    const openDeleteDialog = (type, item) => {
        if (type === "user" ? !canDeleteUsers : !canDeleteRoles) return;

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
            activePage="Assign Users"
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


                    {activeTab === "users" && canCreateUsers && (
                        <button
                            type="button"
                            className="primary-button"
                            onClick={openCreateUser}
                        >
                            <UserPlus size={18} />
                            Add User
                        </button>
                    )}

                    {activeTab === "roles" && canCreateRoles && (
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

                    {canViewUsers && <button
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

                    </button>}


                    {canViewRoles && <button
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

                    </button>}

                </div>


                {/* =========================================
                   CONTENT
                ========================================= */}

                <div className="user-tab-panel">

                    {activeTab === "users" && canViewUsers && (

                        <UserList

                            users={filteredUsers}

                            searchUser={searchUser}

                            setSearchUser={setSearchUser}

                            loading={loadingUsers}

                            error={userError}

                            onRetry={fetchUsers}

                            onAdd={openCreateUser}

                            onEdit={openEditUser}

                            onDetail={openUserDetail}

                            canCreate={canCreateUsers}

                            canEdit={canEditUsers}

                            canDelete={canDeleteUsers}

                            onDelete={(user) =>
                                openDeleteDialog("user", user)
                            }

                        />

                    )}


                    {activeTab === "roles" && canViewRoles && (

                        <RoleList

                            roles={roles}

                            loading={loadingRoles}

                            error={roleError}

                            onRetry={fetchRoles}

                            onAdd={openCreateRole}

                            onEdit={openEditRole}

                            canCreate={canCreateRoles}

                            canEdit={canEditRoles}

                            canDelete={canDeleteRoles}

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


            {userDetailDialog && (

                <UserDetailDialog

                    user={userDetailDialog}

                    onClose={() => setUserDetailDialog(null)}

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
    onDetail,
    onDelete,
    canCreate,
    canEdit,
    canDelete,
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(users.length / LIST_PAGE_SIZE));
    const activePage = Math.min(currentPage, totalPages);
    const firstItem = users.length ? (activePage - 1) * LIST_PAGE_SIZE + 1 : 0;
    const lastItem = Math.min(activePage * LIST_PAGE_SIZE, users.length);
    const visibleUsers = users.slice(firstItem - 1, lastItem);

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

                {canCreate && (
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onAdd}
                    >
                        <UserPlus size={17} />
                        New User
                    </button>
                )}

            </div>


            {/* TOOLBAR */}

            <div className="list-toolbar">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        value={searchUser}
                        onChange={(e) => {
                            setCurrentPage(1);
                            setSearchUser(e.target.value);
                        }}
                        placeholder="Search users..."
                    />

                    {searchUser && (

                        <button
                            type="button"
                            className="search-clear"
                            onClick={() => {
                                setCurrentPage(1);
                                setSearchUser("");
                            }}
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

                        {!searchUser && canCreate && (

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
                                <th className="user-column">User</th>
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

                            {visibleUsers.map((user) => (

                                <tr key={user.id}>

                                    {/* USER */}

                                    <td className="user-column">

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

                                            {canEdit && (
                                                <button
                                                    type="button"
                                                    className="icon-action edit"
                                                    title="Edit user"
                                                    onClick={() => onEdit(user)}
                                                >
                                                    <Edit3 size={16} />
                                                </button>
                                            )}

                                            {canDelete && (
                                                <button
                                                    type="button"
                                                    className="icon-action delete"
                                                    title="Delete user"
                                                    onClick={() => onDelete(user)}
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="icon-action more"
                                                title="View user details"
                                                onClick={() => onDetail(user)}
                                                aria-label={`View details for ${getFullName(user)}`}
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

            {!loading && users.length > 0 && (
                <div className="management-pagination-footer">
                    <span>
                        Showing <strong>{firstItem}–{lastItem}</strong>
                        {" "}of <strong>{users.length}</strong> users
                    </span>
                    <ListPagination
                        page={activePage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        label="User pages"
                    />
                </div>
            )}

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
    canCreate,
    canEdit,
    canDelete,
}) {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = Math.max(1, Math.ceil(roles.length / LIST_PAGE_SIZE));
    const activePage = Math.min(currentPage, totalPages);
    const firstItem = roles.length ? (activePage - 1) * LIST_PAGE_SIZE + 1 : 0;
    const lastItem = Math.min(activePage * LIST_PAGE_SIZE, roles.length);
    const visibleRoles = roles.slice(firstItem - 1, lastItem);

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

                {canCreate && (
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onAdd}
                    >
                        <ShieldPlus size={17} />
                        New Role
                    </button>
                )}

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

                    {visibleRoles.map((role) => (

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

                                    {Array.isArray(role.permissions) && (
                                        <div className="permission-preview">
                                            {role.permissions.filter(
                                                (permission) =>
                                                    permission !== MAINTENANCE_ASSIGNMENT_PERMISSION
                                            ).length === 0 ? (
                                                <span>No permissions</span>
                                            ) : (
                                                role.permissions
                                                    .filter(
                                                        (permission) =>
                                                            permission !== MAINTENANCE_ASSIGNMENT_PERMISSION
                                                    )
                                                    .slice(0, 4)
                                                    .map((permission) => (
                                                        <span key={permission}>{permission}</span>
                                                    ))
                                            )}
                                            {role.permissions.filter(
                                                (permission) =>
                                                    permission !== MAINTENANCE_ASSIGNMENT_PERMISSION
                                            ).length > 4 && (
                                                <span className="more-permissions">
                                                    +{role.permissions.filter(
                                                        (permission) =>
                                                            permission !== MAINTENANCE_ASSIGNMENT_PERMISSION
                                                    ).length - 4} more
                                                </span>
                                            )}
                                        </div>
                                    )}

                                </div>

                            </div>


                            {/* ACTIONS */}

                            <div className="role-actions">

                                {canEdit && (
                                    <button
                                        type="button"
                                        className="secondary-icon-button"
                                        onClick={() => onEdit(role)}
                                    >
                                        <Edit3 size={16} />
                                        Edit
                                    </button>
                                )}

                                {canDelete && (
                                    <button
                                        type="button"
                                        className="danger-icon-button"
                                        onClick={() => onDelete(role)}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </button>
                                )}

                            </div>

                        </div>

                    ))}

                </div>

            )}

            {!loading && roles.length > 0 && (
                <div className="management-pagination-footer">
                    <span>
                        Showing <strong>{firstItem}–{lastItem}</strong>
                        {" "}of <strong>{roles.length}</strong> roles
                    </span>
                    <ListPagination
                        page={activePage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        label="Role pages"
                    />
                </div>
            )}


            {/* EMPTY */}

            {!loading && roles.length === 0 && canCreate && (

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

        fullName: user?.fullName || "",

        email: user?.email || "",

        phone: user?.phone || "",

        gender: normalizeGender(user?.gender),

        department: user?.department || "",

        position: user?.position || "",

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


        if (!form.fullName.trim()) {

            setError("Full name is required.");

            return;
        }

        if (!form.email.trim()) {

            setError("Email is required.");

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

            fullName: form.fullName.trim(),

            email: form.email.trim(),

            phone: form.phone.trim() || null,

            gender: normalizeGender(form.gender) || null,

            department: form.department.trim() || null,

            position: form.position.trim() || null,

            username: form.username.trim(),

            roleId: Number(form.roleId),

            role: Number(form.roleId) ? { id: Number(form.roleId) } : null,

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
                                    Full Name <span className="required">*</span>
                                </label>

                                <input
                                    type="text"
                                    value={form.fullName}
                                    onChange={(e) =>
                                        updateField("fullName", e.target.value)
                                    }
                                    placeholder="Enter full name"
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

                            <div className="form-group">

                                <label>Gender</label>

                                <select
                                    value={form.gender}
                                    onChange={(e) =>
                                        updateField("gender", e.target.value)
                                    }
                                >

                                    <option value="">Select gender</option>
                                    <option value="MALE">Male</option>
                                    <option value="FEMALE">Female</option>
                                    <option value="OTHER">Other</option>

                                </select>

                            </div>

                            <div className="form-group">

                                <label>Department</label>

                                <input
                                    type="text"
                                    value={form.department}
                                    onChange={(e) =>
                                        updateField("department", e.target.value)
                                    }
                                    placeholder="Enter department"
                                />

                            </div>

                            <div className="form-group">

                                <label>Position</label>

                                <input
                                    type="text"
                                    value={form.position}
                                    onChange={(e) =>
                                        updateField("position", e.target.value)
                                    }
                                    placeholder="Enter position"
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
   USER DETAIL DIALOG
========================================================= */

function UserDetailDialog({
    user,
    onClose,
}) {
    return (
        <div
            className="dialog-overlay"
            onMouseDown={onClose}
        >
            <div
                className="dialog user-detail-dialog"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="dialog-header">
                    <div className="dialog-title">
                        <div className="dialog-icon">
                            <User size={20} />
                        </div>

                        <div>
                            <h3>User Details</h3>
                            <p>Read-only account overview</p>
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

                <div className="dialog-body user-detail-body">
                    <div className="detail-profile-header">
                        <div className="detail-avatar">
                            {getInitials(user)}
                        </div>

                        <div className="detail-profile-info">
                            <h4>{getFullName(user) || "Unnamed User"}</h4>
                            <p>{user.email || "No email"}</p>
                        </div>

                        <span
                            className={`status-badge ${(user.status || "ACTIVE").toLowerCase()}`}
                        >
                            <span className="status-dot" />
                            {user.status || "ACTIVE"}
                        </span>
                    </div>

                    <div className="detail-grid">
                        <div className="detail-item">
                            <label>Username</label>
                            <span>{user.username || "-"}</span>
                        </div>

                        <div className="detail-item">
                            <label>Role</label>
                            <span>{user.role?.name || "No Role"}</span>
                        </div>

                        <div className="detail-item">
                            <label>Phone</label>
                            <span>{user.phone || "-"}</span>
                        </div>

                        <div className="detail-item">
                            <label>Gender</label>
                            <span>{user.gender || "-"}</span>
                        </div>

                        <div className="detail-item">
                            <label>Department</label>
                            <span>{user.department || "-"}</span>
                        </div>

                        <div className="detail-item">
                            <label>Position</label>
                            <span>{user.position || "-"}</span>
                        </div>
                    </div>
                </div>

                <div className="dialog-footer">
                    <button
                        type="button"
                        className="secondary-button"
                        onClick={onClose}
                    >
                        Close
                    </button>
                </div>
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

    const [permissions, setPermissions] = useState(
        role
            ? role.permissionsConfigured === true && Array.isArray(role.permissions)
                ? role.permissions.filter(
                    (permission) => permission !== MAINTENANCE_ASSIGNMENT_PERMISSION
                )
                : ALL_PERMISSION_KEYS
            : []
    );

    const [canAssignMaintenance, setCanAssignMaintenance] = useState(
        role
            ? canAssignMaintenanceUser({ role })
            : false
    );

    const [error, setError] = useState("");

    const isEdit = Boolean(role);
    const togglePermission = (permissionKey) => {
        setPermissions((current) =>
            current.includes(permissionKey)
                ? current.filter((key) => key !== permissionKey)
                : [...current, permissionKey]
        );
    };


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

            permissions,

            canAssignMaintenance,

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

                            <div className="permissions-dialog-header">
                                <div>
                                    <h4>Page Permissions</h4>
                                    <p>
                                        Select what users with this role can do on each page.
                                        Pages without View access are hidden from navigation.
                                    </p>
                                </div>
                                <div className="permission-actions">
                                    <button
                                        type="button"
                                        onClick={() => setPermissions(ALL_PERMISSION_KEYS)}
                                    >
                                        Select all
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setPermissions([])}
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>

                            <div className="permissions-dialog-list">
                                {APP_PERMISSION_PAGES.map((page) => (
                                    <section className="permission-dialog-group" key={page.key}>
                                        <h5 className="permission-dialog-category">{page.label}</h5>
                                        <div className="permission-dialog-items">
                                            {PERMISSION_ACTIONS.map(({ key: action, label }) => {
                                                const permissionKey = `${page.key}:${action}`;
                                                const checked = permissions.includes(permissionKey);

                                                return (
                                                    <Fragment key={permissionKey}>
                                                        <label
                                                            className={`permission-checkbox ${checked ? "checked" : ""}`}
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => togglePermission(permissionKey)}
                                                            />
                                                            <span className="checkbox-ui">
                                                                {checked ? "✓" : ""}
                                                            </span>
                                                            {label}
                                                        </label>
                                                        {page.key === "maintenance" && action === "delete" && (
                                                            <label
                                                                className={`permission-checkbox maintenance-assignment-permission ${canAssignMaintenance ? "checked" : ""}`}
                                                            >
                                                                <input
                                                                    type="checkbox"
                                                                    checked={canAssignMaintenance}
                                                                    onChange={(event) =>
                                                                        setCanAssignMaintenance(event.target.checked)
                                                                    }
                                                                />
                                                                <span className="checkbox-ui">
                                                                    {canAssignMaintenance ? "✓" : ""}
                                                                </span>
                                                                Assign users in Maintenance
                                                            </label>
                                                        )}
                                                    </Fragment>
                                                );
                                            })}
                                        </div>
                                    </section>
                                ))}
                            </div>

                        </div>


                    {/* FOOTER */}

                    <div className="dialog-footer">

                        <span className="selected-permissions">
                            {permissions.length + Number(canAssignMaintenance)} permissions selected
                        </span>

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

    const summary = isUser ? (
        <div className="delete-summary-card">
            <div className="delete-summary-avatar">
                {getInitials(item)}
            </div>

            <div className="delete-summary-info">
                <h4>{name || "Unnamed User"}</h4>
                <p>{item?.email || "No email"}</p>
                <div className="delete-summary-meta">
                    <span>{item?.role?.name || "No Role"}</span>
                    <span className={`mini-status ${(item?.status || "ACTIVE").toLowerCase()}`}>
                        {item?.status || "ACTIVE"}
                    </span>
                </div>
            </div>
        </div>
    ) : (
        <div className="delete-summary-card delete-summary-role">
            <div className="delete-summary-avatar role-avatar">
                <Shield size={18} />
            </div>

            <div className="delete-summary-info">
                <h4>{name || "Role"}</h4>
                <p>{item?.description || "No description"}</p>
            </div>
        </div>
    );

    return (

        <div
            className="dialog-overlay"
            onMouseDown={onClose}
        >

            <div
                className="dialog delete-dialog"
                onMouseDown={(e) => e.stopPropagation()}
            >

                <div className="delete-title-row">
                    <div className="delete-icon">
                        <Trash2 size={23} />
                    </div>

                    <h3>{title}</h3>
                </div>

                {summary}

                <p className="delete-warning">
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