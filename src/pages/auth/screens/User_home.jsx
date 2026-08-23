import { useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import "../css/UserHome.css";

function UserHome() {
    const [activeTab, setActiveTab] = useState("users");

    return (
        <MainLayout
            activePage="User Home"
            title="User Management"
        >
            <div className="user-management-page">

                {/* =====================================================
                    HEADER
                ===================================================== */}
                <div className="user-management-header">
                    <div>
                        <h2>User Management</h2>
                        <p>
                            Register users and manage roles and permissions.
                        </p>
                    </div>
                </div>

                {/* =====================================================
                    TABS
                ===================================================== */}
                <div className="user-tabs">
                    <button
                        className={`user-tab ${
                            activeTab === "users" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("users")}
                    >
                        <span className="tab-icon">👤</span>

                        <span className="tab-content">
                            <strong>Register New User</strong>
                            <small>
                                Create a new user account
                            </small>
                        </span>
                    </button>

                    <button
                        className={`user-tab ${
                            activeTab === "roles" ? "active" : ""
                        }`}
                        onClick={() => setActiveTab("roles")}
                    >
                        <span className="tab-icon">🔐</span>

                        <span className="tab-content">
                            <strong>Roles & Permissions</strong>
                            <small>
                                Create roles and manage permissions
                            </small>
                        </span>
                    </button>
                </div>

                {/* =====================================================
                    TAB CONTENT
                ===================================================== */}
                <div className="user-tab-panel">

                    {activeTab === "users" && (
                        <RegisterUser />
                    )}

                    {activeTab === "roles" && (
                        <RolePermission />
                    )}

                </div>
            </div>
        </MainLayout>
    );
}


/* =========================================================
   REGISTER USER
========================================================= */

function RegisterUser() {
    return (
        <div className="management-card">

            <div className="management-card-header">
                <div>
                    <h3>Register New User</h3>
                    <p>
                        Create a new account and assign a role to the user.
                    </p>
                </div>
            </div>

            <form className="user-form">

                <div className="form-section-title">
                    Personal Information
                </div>

                <div className="form-grid">

                    <div className="form-group">
                        <label>First Name</label>
                        <input
                            type="text"
                            placeholder="Enter first name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Last Name</label>
                        <input
                            type="text"
                            placeholder="Enter last name"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="Enter email address"
                        />
                    </div>

                    <div className="form-group">
                        <label>Phone Number</label>
                        <input
                            type="text"
                            placeholder="Enter phone number"
                        />
                    </div>

                </div>

                <div className="form-section-title">
                    Account Information
                </div>

                <div className="form-grid">

                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>

                        <select defaultValue="">
                            <option value="" disabled>
                                Select role
                            </option>

                            <option value="admin">
                                Administrator
                            </option>

                            <option value="manager">
                                Manager
                            </option>

                            <option value="staff">
                                Staff
                            </option>

                            <option value="user">
                                User
                            </option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                        />
                    </div>

                    <div className="form-group">
                        <label>Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm password"
                        />
                    </div>

                </div>

                <div className="form-actions">
                    <button
                        type="button"
                        className="secondary-button"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        className="primary-button"
                    >
                        + Register User
                    </button>
                </div>

            </form>
        </div>
    );
}


/* =========================================================
   ROLE & PERMISSION
========================================================= */

function RolePermission() {
    const permissions = [
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

    return (
        <div className="management-card">

            <div className="management-card-header">
                <div>
                    <h3>Roles & Permissions</h3>
                    <p>
                        Create a role and choose what users with this role
                        are allowed to access.
                    </p>
                </div>
            </div>

            <div className="role-layout">

                {/* =================================================
                    ROLE INFORMATION
                ================================================= */}

                <div className="role-information">

                    <div className="form-section-title">
                        Role Information
                    </div>

                    <div className="form-group">
                        <label>Role Name</label>

                        <input
                            type="text"
                            placeholder="e.g. Asset Manager"
                        />
                    </div>

                    <div className="form-group">
                        <label>Description</label>

                        <textarea
                            rows="4"
                            placeholder="Describe what this role is responsible for..."
                        />
                    </div>

                    <div className="role-preview">
                        <span className="role-preview-icon">
                            🔐
                        </span>

                        <div>
                            <strong>New Role</strong>
                            <p>
                                Permissions selected on the right will
                                be assigned to this role.
                            </p>
                        </div>
                    </div>

                </div>


                {/* =================================================
                    PERMISSIONS
                ================================================= */}

                <div className="permissions-section">

                    <div className="permissions-header">
                        <div>
                            <h4>Permissions</h4>
                            <p>
                                Select the permissions for this role.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="select-all-button"
                        >
                            Select All
                        </button>
                    </div>

                    <div className="permissions-list">

                        {permissions.map((group) => (
                            <div
                                className="permission-group"
                                key={group.category}
                            >
                                <div className="permission-category">
                                    {group.category}
                                </div>

                                <div className="permission-items">

                                    {group.items.map((permission) => (
                                        <label
                                            className="permission-item"
                                            key={permission}
                                        >
                                            <input
                                                type="checkbox"
                                                value={permission}
                                            />

                                            <span className="custom-checkbox">
                                                ✓
                                            </span>

                                            <span>
                                                {permission}
                                            </span>
                                        </label>
                                    ))}

                                </div>
                            </div>
                        ))}

                    </div>

                </div>

            </div>

            <div className="form-actions">

                <button
                    type="button"
                    className="secondary-button"
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="primary-button"
                >
                    + Create Role
                </button>

            </div>

        </div>
    );
}

export default UserHome;