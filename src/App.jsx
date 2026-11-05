import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
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
    hasPermission,
} from "./utils/permissions";


// ========================================
// Protected Route
// ========================================

function ProtectedRoute({ children, permissionKey, assetWorkspace }) {
    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true" ||
        sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    const user = getStoredUser();
    const hasAccess = assetWorkspace
        ? hasAssetWorkspaceAccess(user)
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
                        <ProtectedRoute permissionKey="user-management">
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