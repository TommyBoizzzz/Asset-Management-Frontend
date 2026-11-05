export const PERMISSION_ACTIONS = [
    { key: "view", label: "View" },
    { key: "create", label: "Create" },
    { key: "edit", label: "Edit" },
    { key: "delete", label: "Delete" },
];

export const APP_PERMISSION_PAGES = [
    { key: "dashboard", label: "Dashboard", path: "/dashboard" },
    { key: "assets", label: "Assets", path: "/assets" },
    { key: "asset-categories", label: "Asset Categories" },
    { key: "staff", label: "Staff", path: "/staff" },
    { key: "user-management", label: "User Management", path: "/user-home" },
    { key: "role-management", label: "Role Management" },
    { key: "assign-assets", label: "Assign Assets", path: "/assign-assets" },
    { key: "maintenance", label: "Maintenance", path: "/maintenance" },
    { key: "history", label: "History", path: "/history" },
    { key: "settings", label: "Settings", path: "/settings" },
    { key: "support", label: "Support", path: "/support" },
];

export const ALL_PERMISSION_KEYS = APP_PERMISSION_PAGES.flatMap((page) =>
    PERMISSION_ACTIONS.map(({ key: action }) => `${page.key}:${action}`)
);

export const getStoredUser = () => {
    const storedUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");

    if (!storedUser) return null;

    try {
        return JSON.parse(storedUser);
    } catch (error) {
        console.error("Failed to read the logged-in user:", error);
        return null;
    }
};

const getUserPermissions = (user) =>
    user?.role?.permissions ?? user?.permissions;

export const hasPermission = (user, pageKey, action = "view") => {
    const role = user?.role;
    const permissions = getUserPermissions(user);

    // Keep existing access for accounts created before role permissions existed.
    if (role?.permissionsConfigured !== true || !Array.isArray(permissions)) {
        return true;
    }

    if (action === "view") {
        return (
            permissions.includes(`${pageKey}:view`) ||
            permissions.some((permission) =>
                permission.startsWith(`${pageKey}:`)
            )
        );
    }

    return permissions.includes(`${pageKey}:${action}`);
};

export const hasAssetWorkspaceAccess = (user) =>
    hasPermission(user, "assets", "view") ||
    hasPermission(user, "asset-categories", "view");

export const hasUserManagementAccess = (user) =>
    hasPermission(user, "user-management", "view") ||
    hasPermission(user, "role-management", "view");

export const getLandingPath = (user) =>
    APP_PERMISSION_PAGES.find((page) =>
        page.key === "assets"
            ? hasAssetWorkspaceAccess(user)
            : page.key === "user-management"
                ? hasUserManagementAccess(user)
            : page.path && hasPermission(user, page.key, "view")
    )?.path || "/dashboard";

export const updateStoredUser = (user) => {
    const storage = localStorage.getItem("user") ? localStorage : sessionStorage;
    storage.setItem("user", JSON.stringify(user));
};
