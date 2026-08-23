import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/auth/screens/Login";
import UserHome from "./pages/auth/screens/user_home";
import Dashboard from "./pages/dashboard/screens/Dashboard";
import Assets from "./pages/asset/screens/asset_home";
import StaffHome from "./pages/staff/screens/staff_home";
import MaintenanceHome from "./pages/matainance/screens/maintenance_home";
import AssignAssets from "./pages/assign_asset/screens/assign_home";
import Settings from "./pages/setting/screens/setting_home";
import History from "./pages/history/screens/history_home";
import SupportHome from "./pages/support/screens/support_home";


// ========================================
// Protected Route
// ========================================

function ProtectedRoute({ children }) {
    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true" ||
        sessionStorage.getItem("isLoggedIn") === "true";

    return isLoggedIn ? (
        children
    ) : (
        <Navigate to="/login" replace />
    );
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
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* Assets */}
                <Route
                    path="/assets"
                    element={
                        <ProtectedRoute>
                            <Assets />
                        </ProtectedRoute>
                    }
                />

                {/* Staff */}
                <Route
                    path="/staff"
                    element={
                        <ProtectedRoute>
                            <StaffHome />
                        </ProtectedRoute>
                    }
                />
                
                {/* User Home */}
                <Route
                    path="/user-home"
                    element={
                        <ProtectedRoute>
                            <UserHome />
                        </ProtectedRoute>
                    }
                />
                
                {/* Assign Assets */}
                <Route
                    path="/assign-assets"
                    element={
                        <ProtectedRoute>
                            <AssignAssets />
                        </ProtectedRoute>
                    }
                />

                {/* Maintenance */}
                <Route
                    path="/maintenance"
                    element={
                        <ProtectedRoute>
                            <MaintenanceHome />
                        </ProtectedRoute>
                    }
                />

                {/* History */}
                <Route
                    path="/history"
                    element={
                        <ProtectedRoute>
                            <History />
                        </ProtectedRoute>
                    }
                />

                {/* Settings */}
                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute>
                            <Settings />
                        </ProtectedRoute>
                    }
                />

                {/* Support */}
                <Route
                    path="/support"
                    element={
                        <ProtectedRoute>
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