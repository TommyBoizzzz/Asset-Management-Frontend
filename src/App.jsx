import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";

import Login from "./pages/auth/screens/Login";
import UserHome from "./pages/auth/screens/User_home";
import Dashboard from "./pages/dashboard/screens/Dashboard";
import Assets from "./pages/asset/screens/asset_home";
import StaffHome from "./pages/staff/screens/staff_home";
import MaintenanceHome from "./pages/matainance/screens/maintenance_home";
import AssignAssets from "./pages/assign_asset/screens/assign_home";
import Settings from "./pages/setting/screens/setting_home";
import History from "./pages/history/screens/history_home";
import SupportHome from "./pages/support/screens/support_home";
import {
    getStoredUser,
    hasAssetWorkspaceAccess,
    hasUserManagementAccess,
    hasPermission,
} from "./utils/permissions";
import {
    AUTO_LOCK_ACTIVITY_KEY,
    AUTO_LOCK_CHANGE_EVENT,
    AUTO_LOCK_STORAGE_KEY,
    getAutoLockMinutes,
} from "./utils/autoLock";


// ========================================
// Protected Route
// ========================================

function ProtectedRoute({
    children,
    permissionKey,
    assetWorkspace,
    userManagementWorkspace,
}) {
    const navigate = useNavigate();
    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true" ||
        sessionStorage.getItem("isLoggedIn") === "true";
    const [autoLockMinutes, setAutoLockMinutes] = useState(getAutoLockMinutes);

    useEffect(() => {
        const updateAutoLock = (event) => {
            if (!event.key || event.key === AUTO_LOCK_STORAGE_KEY) {
                setAutoLockMinutes(getAutoLockMinutes());
            }
        };

        window.addEventListener(AUTO_LOCK_CHANGE_EVENT, updateAutoLock);
        window.addEventListener("storage", updateAutoLock);

        return () => {
            window.removeEventListener(AUTO_LOCK_CHANGE_EVENT, updateAutoLock);
            window.removeEventListener("storage", updateAutoLock);
        };
    }, []);

    useEffect(() => {
        if (!isLoggedIn || autoLockMinutes === "Never") return undefined;

        const duration = Number(autoLockMinutes) * 60 * 1000;
        const activityEvents = [
            "pointerdown",
            "keydown",
            "mousemove",
            "scroll",
            "touchstart",
        ];
        let timeoutId;
        let lastActivityWrite = 0;

        const clearSession = () => {
            for (const storage of [localStorage, sessionStorage]) {
                storage.removeItem("user");
                storage.removeItem("accessToken");
                storage.removeItem("isLoggedIn");
            }
            localStorage.removeItem(AUTO_LOCK_ACTIVITY_KEY);
            navigate("/login", { replace: true });
        };

        const resetTimer = () => {
            window.clearTimeout(timeoutId);
            timeoutId = window.setTimeout(clearSession, duration);
        };

        const recordActivity = () => {
            const now = Date.now();
            if (now - lastActivityWrite >= 1000) {
                localStorage.setItem(AUTO_LOCK_ACTIVITY_KEY, String(now));
                lastActivityWrite = now;
            }
            resetTimer();
        };

        const handleStorage = (event) => {
            if (event.key === AUTO_LOCK_ACTIVITY_KEY && event.newValue !== null) {
                resetTimer();
            }
            if (event.key === "isLoggedIn" && event.newValue === null) {
                navigate("/login", { replace: true });
            }
        };

        activityEvents.forEach((eventName) => {
            window.addEventListener(eventName, recordActivity, { passive: true });
        });
        window.addEventListener("storage", handleStorage);
        recordActivity();

        return () => {
            window.clearTimeout(timeoutId);
            activityEvents.forEach((eventName) => {
                window.removeEventListener(eventName, recordActivity);
            });
            window.removeEventListener("storage", handleStorage);
        };
    }, [autoLockMinutes, isLoggedIn, navigate]);

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    const user = getStoredUser();
    const hasAccess = assetWorkspace
        ? hasAssetWorkspaceAccess(user)
        : userManagementWorkspace
            ? hasUserManagementAccess(user)
            : !permissionKey || hasPermission(user, permissionKey);

    if (!hasAccess) {
        return (
            <main className="access-denied">
                <h1>Access denied</h1>
                <p>Your role does not have permission to view this page.</p>
            </main>
        );
    }

    return children;
}

// ========================================
// App
// ========================================

function App() {
    return (
        <BrowserRouter>
            <Routes>

                {/* Default */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* Dashboard */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute permissionKey="dashboard">
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Assets */}
                <Route
                    path="/assets"
                    element={
                        <ProtectedRoute assetWorkspace>
                            <Assets />
                        </ProtectedRoute>
                    }
                />

                {/* Staff */}
                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute permissionKey="staff">
                            <StaffHome />
                        </ProtectedRoute>
                    }
                />
                
                {/* User Home */}
                <Route
                    path="/user-home"
                    element={
                        <ProtectedRoute userManagementWorkspace>
                            <UserHome />
                        </ProtectedRoute>
                    }
                />
                
                {/* Assign Assets */}
                <Route
                    path="/assign-assets"
                    element={
                        <ProtectedRoute permissionKey="assign-assets">
                            <AssignAssets />
                        </ProtectedRoute>
                    }
                />

                {/* Maintenance */}
                <Route
                    path="/maintenance"
                    element={
                        <ProtectedRoute permissionKey="maintenance">
                            <MaintenanceHome />
                        </ProtectedRoute>
                    }
                />

                {/* History */}
                <Route
                    path="/history"
                    element={
                        <ProtectedRoute permissionKey="history">
                            <History />
                        </ProtectedRoute>
                    }
                />

                {/* Settings */}
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute permissionKey="settings">
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                {/* Support */}
                <Route
                    path="/support"
                    element={
                        <ProtectedRoute permissionKey="support">
                            <SupportHome />
                        </ProtectedRoute>
                    }
                />

                {/* Unknown */}
                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;