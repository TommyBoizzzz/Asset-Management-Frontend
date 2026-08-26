import { useEffect, useState } from "react";
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

import UserService from "../services/UserService";
import RoleService from "../services/RoleService";

import "../css/UserHome.css";


//    PERMISSION GROUPS
const PERMISSION_GROUPS = [
    {
        category: "Dashboard",
        items: [
            "View Dashboard",
        ],
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
        items: [
            "View History",
        ],
    },
];


//    USER HOME
function UserHome() {

    const [activeTab, setActiveTab] =
        useState("users");


    /* =====================================================
       USERS
    ===================================================== */

    const [users, setUsers] =
        useState([]);

    const [loadingUsers, setLoadingUsers] =
        useState(false);

    const [userError, setUserError] =
        useState("");


    /* =====================================================
       ROLES
    ===================================================== */

    const [roles, setRoles] =
        useState([]);

    const [loadingRoles, setLoadingRoles] =
        useState(false);

    const [roleError, setRoleError] =
        useState("");


    /* =====================================================
       DIALOGS
    ===================================================== */

    const [userDialog, setUserDialog] =
        useState(null);

    const [roleDialog, setRoleDialog] =
        useState(null);

    const [deleteDialog, setDeleteDialog] =
        useState(null);


    /* =====================================================
       SEARCH
    ===================================================== */

    const [searchUser, setSearchUser] =
        useState("");


    /* =====================================================
       LOAD DATA
    ===================================================== */

    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);


    /* =====================================================
       FETCH USERS
    ===================================================== */

    const fetchUsers = async () => {

        try {

            setLoadingUsers(true);
            setUserError("");

            const response =
                await UserService.getAll();

            console.log(
                "Users from API:",
                response.data
            );

            if (Array.isArray(response.data)) {

                setUsers(response.data);

            } else if (
                Array.isArray(response.data?.data)
            ) {

                setUsers(response.data.data);

            } else {

                setUsers([]);

            }

        } catch (error) {

            console.error(
                "Failed to fetch users:",
                error
            );

            setUserError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to load users."
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

            const response =
                await RoleService.getAll();

            console.log(
                "Roles from API:",
                response.data
            );

            if (Array.isArray(response.data)) {

                setRoles(response.data);

            } else if (
                Array.isArray(response.data?.data)
            ) {

                setRoles(response.data.data);

            } else {

                setRoles([]);

            }

        } catch (error) {

            console.error(
                "Failed to fetch roles:",
                error
            );

            setRoleError(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to load roles."
            );

        } finally {

            setLoadingRoles(false);

        }
    };


    /* =====================================================
       SEARCH USERS
    ===================================================== */

    const filteredUsers =
        users.filter((user) => {

            const search =
                searchUser
                    .toLowerCase()
                    .trim();


            const fullName =
                `${user.firstName || ""} ${
                    user.lastName || ""
                }`.toLowerCase();


            const email =
                (user.email || "")
                    .toLowerCase();


            const username =
                (user.username || "")
                    .toLowerCase();


            const role =
                (
                    user.role?.name ||
                    ""
                ).toLowerCase();


            return (
                fullName.includes(search) ||
                email.includes(search) ||
                username.includes(search) ||
                role.includes(search)
            );
        });


    /* =====================================================
       SAVE USER
    ===================================================== */

    const handleSaveUser =
        async (formData) => {

        try {

            setUserError("");

            console.log(
                "Sending user data:",
                formData
            );


            /* =============================================
               BUILD REQUEST
            ============================================= */

            const data = {

                username:
                    formData.username.trim(),

                email:
                    formData.email.trim(),

                firstName:
                    formData.firstName.trim(),

                lastName:
                    formData.lastName.trim(),

                phone:
                    formData.phone.trim(),

                status:
                    formData.status,

            };


            /* =============================================
               ROLE
               
               Backend expects:
               
               "role": {
                   "id": 1
               }
            ============================================= */

            if (formData.roleId) {

                data.role = {
                    id: Number(
                        formData.roleId
                    ),
                };

            }


            /* =============================================
               PASSWORD
            ============================================= */

            if (formData.password) {

                data.password =
                    formData.password;

            }


            console.log(
                "Final request:",
                data
            );


            /* =============================================
               UPDATE
            ============================================= */

            if (formData.id) {

                const response =
                    await UserService.update(
                        formData.id,
                        data
                    );


                console.log(
                    "Update response:",
                    response.data
                );


                const updatedUser =
                    response.data?.data ||
                    response.data;


                setUsers(
                    (current) =>
                        current.map(
                            (user) =>
                                user.id ===
                                formData.id
                                    ? updatedUser
                                    : user
                        )
                );

            }

            /* =============================================
               CREATE
            ============================================= */

            else {

                const response =
                    await UserService.create(
                        data
                    );


                console.log(
                    "Create response:",
                    response.data
                );


                const newUser =
                    response.data?.data ||
                    response.data;


                setUsers(
                    (current) => [
                        ...current,
                        newUser,
                    ]
                );

            }


            setUserDialog(null);

        } catch (error) {

            console.error(
                "========== SAVE USER ERROR =========="
            );

            console.error(
                "Error:",
                error
            );

            console.error(
                "Status:",
                error.response?.status
            );

            console.error(
                "Response:",
                error.response?.data
            );

            console.error(
                "Request:",
                error.config?.data
            );

            console.error(
                "===================================="
            );


            let message =
                "Failed to save user.";


            if (
                typeof error.response?.data ===
                "string"
            ) {

                message =
                    error.response.data;

            } else if (
                error.response?.data?.message
            ) {

                message =
                    error.response.data.message;

            } else if (
                error.response?.data?.error
            ) {

                message =
                    error.response.data.error;

            }


            alert(
                `${message}\nStatus: ${
                    error.response?.status ||
                    "Unknown"
                }`
            );

        }
    };


    /* =====================================================
       SAVE ROLE
    ===================================================== */

    const handleSaveRole =
        async (formData) => {

        try {

            setRoleError("");


            const data = {

                name:
                    formData.name.trim(),

                description:
                    formData.description.trim(),

            };


            /* =============================================
               UPDATE ROLE
            ============================================= */

            if (formData.id) {

                const response =
                    await RoleService.update(
                        formData.id,
                        data
                    );


                console.log(
                    "Role update:",
                    response.data
                );


                const updatedRole =
                    response.data?.data ||
                    response.data;


                setRoles(
                    (current) =>
                        current.map(
                            (role) =>
                                role.id ===
                                formData.id
                                    ? updatedRole
                                    : role
                        )
                );

            }


            /* =============================================
               CREATE ROLE
            ============================================= */

            else {

                const response =
                    await RoleService.create(
                        data
                    );


                console.log(
                    "Role create:",
                    response.data
                );


                const newRole =
                    response.data?.data ||
                    response.data;


                setRoles(
                    (current) => [
                        ...current,
                        newRole,
                    ]
                );

            }


            setRoleDialog(null);

        } catch (error) {

            console.error(
                "Failed to save role:",
                error
            );


            alert(
                error.response?.data?.message ||
                error.response?.data ||
                "Failed to save role."
            );

        }
    };


    /* =====================================================
       DELETE USER / ROLE
    ===================================================== */

    const handleDelete =
        async () => {

        if (!deleteDialog) {
            return;
        }


        /* =============================================
           DELETE USER
        ============================================= */

        if (
            deleteDialog.type ===
            "user"
        ) {

            try {

                const userId =
                    deleteDialog.item.id;


                await UserService.delete(
                    userId
                );


                setUsers(
                    (current) =>
                        current.filter(
                            (user) =>
                                user.id !==
                                userId
                        )
                );


                setDeleteDialog(null);

            } catch (error) {

                console.error(
                    "Failed to delete user:",
                    error
                );


                alert(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to delete user."
                );

            }


            return;
        }


        /* =============================================
           DELETE ROLE
        ============================================= */

        if (
            deleteDialog.type ===
            "role"
        ) {

            try {

                const roleId =
                    deleteDialog.item.id;


                await RoleService.delete(
                    roleId
                );


                setRoles(
                    (current) =>
                        current.filter(
                            (role) =>
                                role.id !==
                                roleId
                        )
                );


                /*
                 * Refresh users because
                 * deleting a role can affect
                 * the relationship.
                 */

                await fetchUsers();


                setDeleteDialog(null);

            } catch (error) {

                console.error(
                    "Failed to delete role:",
                    error
                );


                alert(
                    error.response?.data?.message ||
                    error.response?.data ||
                    "Failed to delete role."
                );

            }

        }
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


                {/* =================================================
                   HEADER
                ================================================= */}

                <div className="user-management-header">

                    <div>

                        <div className="page-title-row">

                            <div className="page-title-icon">

                                <Users size={22} />

                            </div>


                            <div>

                                <h2>
                                    User Management
                                </h2>

                                <p>
                                    Manage users, roles and
                                    permissions from one place.
                                </p>

                            </div>

                        </div>

                    </div>


                    {activeTab === "users" ? (

                        <button
                            className="primary-button"
                            onClick={() =>
                                setUserDialog({
                                    mode: "create",
                                })
                            }
                        >

                            <UserPlus size={18} />

                            Add User

                        </button>

                    ) : (

                        <button
                            className="primary-button"
                            onClick={() =>
                                setRoleDialog({
                                    mode: "create",
                                })
                            }
                        >

                            <ShieldPlus size={18} />

                            Create Role

                        </button>

                    )}

                </div>


                {/* =================================================
                   TABS
                ================================================= */}

                <div className="user-tabs">


                    {/* USERS */}

                    <button
                        className={`user-tab ${
                            activeTab === "users"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveTab("users")
                        }
                    >

                        <div className="tab-icon">

                            <Users size={20} />

                        </div>


                        <div className="tab-content">

                            <strong>
                                Users
                            </strong>

                            <small>
                                {users.length}
                                {" "}
                                registered users
                            </small>

                        </div>

                    </button>


                    {/* ROLES */}

                    <button
                        className={`user-tab ${
                            activeTab === "roles"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            setActiveTab("roles")
                        }
                    >

                        <div className="tab-icon">

                            <Shield size={20} />

                        </div>


                        <div className="tab-content">

                            <strong>
                                Roles & Permissions
                            </strong>

                            <small>
                                {roles.length}
                                {" "}
                                available roles
                            </small>

                        </div>

                    </button>

                </div>


                {/* =================================================
                   CONTENT
                ================================================= */}

                <div className="user-tab-panel">


                    {/* =================================================
                       USERS
                    ================================================= */}

                    {activeTab === "users" && (

                        <UserList

                            users={
                                filteredUsers
                            }

                            searchUser={
                                searchUser
                            }

                            setSearchUser={
                                setSearchUser
                            }

                            loading={
                                loadingUsers
                            }

                            error={
                                userError
                            }

                            onRetry={
                                fetchUsers
                            }

                            onAdd={() =>
                                setUserDialog({
                                    mode: "create",
                                })
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


                    {/* =================================================
                       ROLES
                    ================================================= */}

                    {activeTab === "roles" && (

                        <RoleList

                            roles={
                                roles
                            }

                            loading={
                                loadingRoles
                            }

                            error={
                                roleError
                            }

                            onRetry={
                                fetchRoles
                            }

                            onAdd={() =>
                                setRoleDialog({
                                    mode: "create",
                                })
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


            {/* =================================================
               USER DIALOG
            ================================================= */}

            {userDialog && (

                <UserDialog

                    user={
                        userDialog.user
                    }

                    roles={
                        roles
                    }

                    onClose={() =>
                        setUserDialog(null)
                    }

                    onSave={
                        handleSaveUser
                    }

                />

            )}


            {/* =================================================
               ROLE DIALOG
            ================================================= */}

            {roleDialog && (

                <RoleDialog

                    role={
                        roleDialog.role
                    }

                    onClose={() =>
                        setRoleDialog(null)
                    }

                    onSave={
                        handleSaveRole
                    }

                />

            )}


            {/* =================================================
               DELETE DIALOG
            ================================================= */}

            {deleteDialog && (

                <DeleteDialog

                    type={
                        deleteDialog.type
                    }

                    item={
                        deleteDialog.item
                    }

                    onClose={() =>
                        setDeleteDialog(null)
                    }

                    onDelete={
                        handleDelete
                    }

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

                    <h3>
                        Registered Users
                    </h3>

                    <p>
                        Add, update and remove users
                        from your system.
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


            {/* TOOLBAR */}

            <div className="list-toolbar">

                <div className="search-box">

                    <Search size={18} />

                    <input
                        type="text"
                        value={
                            searchUser
                        }
                        onChange={(e) =>
                            setSearchUser(
                                e.target.value
                            )
                        }
                        placeholder="Search users..."
                    />

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

                <div
                    style={{
                        padding: "16px",
                        marginBottom: "16px",
                        borderRadius: "8px",
                        background: "#fff1f2",
                        color: "#be123c",
                    }}
                >

                    <p>
                        {error}
                    </p>


                    <button
                        className="secondary-button"
                        onClick={
                            onRetry
                        }
                    >
                        Try Again
                    </button>

                </div>

            )}


            {/* TABLE */}

            <div className="users-table-wrapper">

                {loading ? (

                    <div className="empty-state">

                        <Users size={40} />

                        <h4>
                            Loading users...
                        </h4>

                        <p>
                            Please wait while we
                            load your users.
                        </p>

                    </div>

                ) : (

                    <>

                        <table className="users-table">

                            <thead>

                                <tr>

                                    <th>
                                        User
                                    </th>

                                    <th>
                                        Username
                                    </th>

                                    <th>
                                        Role
                                    </th>

                                    <th>
                                        Status
                                    </th>

                                    <th>
                                        Contact
                                    </th>

                                    <th className="action-column">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {users.map(
                                    (user) => (

                                        <tr
                                            key={
                                                user.id
                                            }
                                        >


                                            {/* USER */}

                                            <td>

                                                <div className="user-cell">

                                                    <div className="user-avatar">

                                                        {(
                                                            user.firstName ||
                                                            ""
                                                        ).charAt(0)}

                                                        {(
                                                            user.lastName ||
                                                            ""
                                                        ).charAt(0)}

                                                    </div>


                                                    <div>

                                                        <strong>

                                                            {
                                                                user.firstName
                                                            }{" "}

                                                            {
                                                                user.lastName
                                                            }

                                                        </strong>


                                                        <span>

                                                            {
                                                                user.email
                                                            }

                                                        </span>

                                                    </div>

                                                </div>

                                            </td>


                                            {/* USERNAME */}

                                            <td>

                                                <span className="username-text">

                                                    @
                                                    {
                                                        user.username
                                                    }

                                                </span>

                                            </td>


                                            {/* ROLE */}

                                            <td>

                                                <span className="role-badge">

                                                    <Shield
                                                        size={14}
                                                    />

                                                    {
                                                        user.role?.name ||
                                                        "No Role"
                                                    }

                                                </span>

                                            </td>


                                            {/* STATUS */}

                                            <td>

                                                <span
                                                    className={`status-badge ${
                                                        (
                                                            user.status ||
                                                            "ACTIVE"
                                                        ).toLowerCase()
                                                    }`}
                                                >

                                                    <span className="status-dot" />

                                                    {
                                                        user.status ||
                                                        "ACTIVE"
                                                    }

                                                </span>

                                            </td>


                                            {/* PHONE */}

                                            <td>

                                                <span className="phone-text">

                                                    {
                                                        user.phone ||
                                                        "-"
                                                    }

                                                </span>

                                            </td>


                                            {/* ACTIONS */}

                                            <td>

                                                <div className="row-actions">

                                                    <button
                                                        className="icon-action edit"
                                                        title="Edit user"
                                                        onClick={() =>
                                                            onEdit(
                                                                user
                                                            )
                                                        }
                                                    >

                                                        <Edit3
                                                            size={16}
                                                        />

                                                    </button>


                                                    <button
                                                        className="icon-action delete"
                                                        title="Delete user"
                                                        onClick={() =>
                                                            onDelete(
                                                                user
                                                            )
                                                        }
                                                    >

                                                        <Trash2
                                                            size={16}
                                                        />

                                                    </button>


                                                    <button
                                                        className="icon-action more"
                                                        title="More"
                                                    >

                                                        <MoreHorizontal
                                                            size={17}
                                                        />

                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    )
                                )}

                            </tbody>

                        </table>


                        {/* EMPTY */}

                        {users.length === 0 && (

                            <div className="empty-state">

                                <Users size={40} />

                                <h4>
                                    No users found
                                </h4>

                                <p>
                                    Try another search
                                    or create a new user.
                                </p>


                                <button
                                    className="primary-button"
                                    onClick={onAdd}
                                >

                                    <UserPlus
                                        size={17}
                                    />

                                    Add User

                                </button>

                            </div>

                        )}

                    </>

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

                    <h3>
                        Roles & Permissions
                    </h3>

                    <p>
                        Create roles and control
                        what each role can access.
                    </p>

                </div>


                <button
                    className="secondary-button"
                    onClick={onAdd}
                >

                    <ShieldPlus
                        size={17}
                    />

                    New Role

                </button>

            </div>


            {/* ERROR */}

            {error && (

                <div
                    style={{
                        padding: "16px",
                        marginBottom: "16px",
                        borderRadius: "8px",
                        background: "#fff1f2",
                        color: "#be123c",
                    }}
                >

                    <p>
                        {error}
                    </p>


                    <button
                        className="secondary-button"
                        onClick={
                            onRetry
                        }
                    >

                        Try Again

                    </button>

                </div>

            )}


            {/* LOADING */}

            {loading ? (

                <div className="empty-state">

                    <Shield size={40} />

                    <h4>
                        Loading roles...
                    </h4>

                    <p>
                        Please wait while we
                        load your roles.
                    </p>

                </div>

            ) : (

                <div className="role-list">

                    {roles.map(
                        (role) => (

                            <div
                                className="role-card"
                                key={
                                    role.id
                                }
                            >

                                <div className="role-card-main">


                                    {/* ICON */}

                                    <div className="role-card-icon">

                                        <Shield
                                            size={21}
                                        />

                                    </div>


                                    {/* INFO */}

                                    <div className="role-card-info">

                                        <div className="role-name-row">

                                            <h4>
                                                {
                                                    role.name
                                                }
                                            </h4>

                                        </div>


                                        <p>

                                            {
                                                role.description ||
                                                "No description."
                                            }

                                        </p>

                                    </div>

                                </div>


                                {/* ACTIONS */}

                                <div className="role-actions">

                                    <button
                                        className="secondary-icon-button"
                                        onClick={() =>
                                            onEdit(
                                                role
                                            )
                                        }
                                    >

                                        <Edit3
                                            size={16}
                                        />

                                        Edit

                                    </button>


                                    <button
                                        className="danger-icon-button"
                                        onClick={() =>
                                            onDelete(
                                                role
                                            )
                                        }
                                    >

                                        <Trash2
                                            size={16}
                                        />

                                        Delete

                                    </button>

                                </div>

                            </div>

                        )
                    )}

                </div>

            )}


            {/* EMPTY */}

            {!loading &&
                roles.length === 0 && (

                <div className="empty-state">

                    <Shield size={40} />

                    <h4>
                        No roles created
                    </h4>

                    <p>
                        Create your first role.
                    </p>


                    <button
                        className="primary-button"
                        onClick={onAdd}
                    >

                        <ShieldPlus
                            size={17}
                        />

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
    onClose,
    onSave,
}) {

    const [form, setForm] =
        useState({

            id:
                user?.id ||
                null,

            firstName:
                user?.firstName ||
                "",

            lastName:
                user?.lastName ||
                "",

            email:
                user?.email ||
                "",

            phone:
                user?.phone ||
                "",

            username:
                user?.username ||
                "",

            roleId:
                user?.role?.id ||
                "",

            status:
                user?.status ||
                "ACTIVE",

            password:
                "",

        });


    const [error, setError] =
        useState("");


    const isEdit =
        Boolean(user);


    /* =====================================================
       UPDATE FIELD
    ===================================================== */

    const updateField =
        (field, value) => {

        setForm(
            (current) => ({
                ...current,
                [field]: value,
            })
        );

    };


    /* =====================================================
       SUBMIT
    ===================================================== */

    const handleSubmit =
        (e) => {

        e.preventDefault();

        setError("");


        /* =============================================
           REQUIRED
        ============================================= */

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


        if (
            !form.username.trim()
        ) {

            setError(
                "Username is required."
            );

            return;
        }


        /* =============================================
           ROLE
        ============================================= */

        if (!form.roleId) {

            setError(
                "Please select a role."
            );

            return;
        }


        /* =============================================
           PASSWORD CREATE
        ============================================= */

        if (
            !isEdit &&
            !form.password
        ) {

            setError(
                "Password is required."
            );

            return;
        }


        /* =============================================
           DATA
        ============================================= */

        const data = {

            id:
                form.id,

            firstName:
                form.firstName.trim(),

            lastName:
                form.lastName.trim(),

            email:
                form.email.trim(),

            phone:
                form.phone.trim(),

            username:
                form.username.trim(),

            roleId:
                Number(
                    form.roleId
                ),

            status:
                form.status,

            password:
                form.password,

        };


        console.log(
            "User form data:",
            data
        );


        onSave(data);
    };


    return (

        <div
            className="dialog-overlay"
            onMouseDown={
                onClose
            }
        >

            <div
                className="dialog user-dialog"
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >


                {/* HEADER */}

                <div className="dialog-header">

                    <div className="dialog-title">

                        <div className="dialog-icon">

                            <UserPlus
                                size={20}
                            />

                        </div>


                        <div>

                            <h3>

                                {isEdit
                                    ? "Update User"
                                    : "Add New User"}

                            </h3>


                            <p>

                                {isEdit
                                    ? "Update this user's account information."
                                    : "Create a new user account and assign a role."}

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="dialog-close"
                        onClick={
                            onClose
                        }
                    >

                        <X size={19} />

                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="dialog-body">


                        {/* ERROR */}

                        {error && (

                            <div
                                style={{
                                    padding:
                                        "12px 14px",

                                    marginBottom:
                                        "18px",

                                    borderRadius:
                                        "8px",

                                    background:
                                        "#fff1f2",

                                    color:
                                        "#be123c",

                                    fontSize:
                                        "14px",
                                }}
                            >

                                {error}

                            </div>

                        )}


                        {/* PERSONAL */}

                        <div className="dialog-section-title">

                            Personal Information

                        </div>


                        <div className="form-grid">


                            {/* FIRST NAME */}

                            <div className="form-group">

                                <label>
                                    First Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.firstName
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "firstName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter first name"
                                />

                            </div>


                            {/* LAST NAME */}

                            <div className="form-group">

                                <label>
                                    Last Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.lastName
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "lastName",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter last name"
                                />

                            </div>


                            {/* EMAIL */}

                            <div className="form-group">

                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    value={
                                        form.email
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "email",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter email address"
                                />

                            </div>


                            {/* PHONE */}

                            <div className="form-group">

                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.phone
                                    }
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


                        {/* ACCOUNT */}

                        <div className="dialog-section-title">

                            Account Information

                        </div>


                        <div className="form-grid">


                            {/* USERNAME */}

                            <div className="form-group">

                                <label>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    value={
                                        form.username
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "username",
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter username"
                                />

                            </div>


                            {/* ROLE */}

                            <div className="form-group">

                                <label>
                                    Role
                                </label>

                                <select
                                    value={
                                        form.roleId
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "roleId",
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        Select role
                                    </option>


                                    {roles.map(
                                        (role) => (

                                            <option
                                                key={
                                                    role.id
                                                }
                                                value={
                                                    role.id
                                                }
                                            >

                                                {
                                                    role.name
                                                }

                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* PASSWORD */}

                            <div className="form-group">

                                <label>

                                    Password

                                    {!isEdit && (

                                        <span className="required">
                                            *
                                        </span>

                                    )}

                                </label>


                                <input
                                    type="password"
                                    value={
                                        form.password
                                    }
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

                        </div>


                        {/* STATUS */}

                        {isEdit && (

                            <div className="form-group status-field">

                                <label>
                                    Status
                                </label>


                                <select
                                    value={
                                        form.status
                                    }
                                    onChange={(e) =>
                                        updateField(
                                            "status",
                                            e.target.value
                                        )
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


                    {/* FOOTER */}

                    <div className="dialog-footer">


                        <button
                            type="button"
                            className="secondary-button"
                            onClick={
                                onClose
                            }
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                        >

                            {isEdit ? (

                                <>

                                    <Edit3
                                        size={17}
                                    />

                                    Update User

                                </>

                            ) : (

                                <>

                                    <UserPlus
                                        size={17}
                                    />

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


//    ROLE DIALOG
function RoleDialog({
    role,
    onClose,
    onSave,
}) {

    const [name, setName] =
        useState(
            role?.name || ""
        );


    const [description, setDescription] =
        useState(
            role?.description || ""
        );


    const isEdit =
        Boolean(role);


    const handleSubmit =
        (e) => {

        e.preventDefault();


        if (!name.trim()) {
            return;
        }


        onSave({

            id:
                role?.id ||
                null,

            name:
                name.trim(),

            description:
                description.trim(),

        });

    };


    return (

        <div
            className="dialog-overlay"
            onMouseDown={
                onClose
            }
        >

            <div
                className="dialog role-dialog"
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >


                {/* HEADER */}

                <div className="dialog-header">

                    <div className="dialog-title">

                        <div className="dialog-icon role">

                            <ShieldPlus
                                size={20}
                            />

                        </div>


                        <div>

                            <h3>

                                {isEdit
                                    ? "Update Role"
                                    : "Create New Role"}

                            </h3>


                            <p>

                                Create a role for
                                your users.

                            </p>

                        </div>

                    </div>


                    <button
                        type="button"
                        className="dialog-close"
                        onClick={
                            onClose
                        }
                    >

                        <X size={19} />

                    </button>

                </div>


                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                >

                    <div className="dialog-body">


                        <div className="dialog-section-title">

                            Role Information

                        </div>


                        <div className="form-grid">


                            {/* ROLE NAME */}

                            <div className="form-group">

                                <label>
                                    Role Name
                                </label>

                                <input
                                    type="text"
                                    value={
                                        name
                                    }
                                    onChange={(e) =>
                                        setName(
                                            e.target.value
                                        )
                                    }
                                    placeholder="e.g. Manager"
                                />

                            </div>


                            {/* DESCRIPTION */}

                            <div className="form-group">

                                <label>
                                    Description
                                </label>

                                <textarea
                                    value={
                                        description
                                    }
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


                        {/* PERMISSIONS */}

                        <div className="permissions-dialog-header">

                            <div>

                                <h4>
                                    Permissions
                                </h4>

                                <p>
                                    Permission UI only.
                                </p>

                            </div>

                        </div>


                        <div className="permissions-dialog-list">

                            {PERMISSION_GROUPS.map(
                                (group) => (

                                    <div
                                        className="permission-dialog-group"
                                        key={
                                            group.category
                                        }
                                    >

                                        <div className="permission-dialog-category">

                                            {
                                                group.category
                                            }

                                        </div>


                                        <div className="permission-dialog-items">

                                            {group.items.map(
                                                (
                                                    permission
                                                ) => (

                                                    <label
                                                        className="permission-checkbox"
                                                        key={
                                                            permission
                                                        }
                                                    >

                                                        <input
                                                            type="checkbox"
                                                        />

                                                        <span className="checkbox-ui" />

                                                        <span>
                                                            {
                                                                permission
                                                            }
                                                        </span>

                                                    </label>

                                                )
                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </div>


                    {/* FOOTER */}

                    <div className="dialog-footer">

                        <button
                            type="button"
                            className="secondary-button"
                            onClick={
                                onClose
                            }
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="primary-button"
                        >

                            {isEdit ? (

                                <>

                                    <Edit3
                                        size={17}
                                    />

                                    Update Role

                                </>

                            ) : (

                                <>

                                    <ShieldPlus
                                        size={17}
                                    />

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


//    DELETE DIALOG
function DeleteDialog({
    type,
    item,
    onClose,
    onDelete,
}) {

    const isUser =
        type === "user";


    const title =
        isUser
            ? "Delete User?"
            : "Delete Role?";


    const name =
        isUser
            ? `${item.firstName || ""} ${
                  item.lastName || ""
              }`
            : item.name;


    return (

        <div
            className="dialog-overlay"
            onMouseDown={
                onClose
            }
        >

            <div
                className="dialog delete-dialog"
                onMouseDown={(e) =>
                    e.stopPropagation()
                }
            >

                <div className="delete-icon">

                    <Trash2 size={23} />

                </div>


                <h3>
                    {title}
                </h3>


                <p>

                    Are you sure you want
                    to delete{" "}

                    <strong>
                        {name}
                    </strong>

                    ?

                    <br />

                    This action cannot
                    be undone.

                </p>


                <div className="delete-actions">

                    <button
                        className="secondary-button"
                        onClick={
                            onClose
                        }
                    >

                        Cancel

                    </button>


                    <button
                        className="delete-confirm-button"
                        onClick={
                            onDelete
                        }
                    >

                        <Trash2
                            size={17}
                        />

                        Delete

                    </button>

                </div>

            </div>

        </div>
    );
}


export default UserHome;