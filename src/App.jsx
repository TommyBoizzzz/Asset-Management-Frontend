import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/auth/screens/Login";
import Dashboard from "./pages/dashboard/screens/Dashboard";
import Assets from "./pages/asset/screens/asset_home";
import StaffHome from "./pages/staff/screens/staff_home";
import MaintenanceHome from "./pages/matainance/screens/maintenance_home";

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

                {/* Maintenance */}
                <Route
                    path="/maintenance"
                    element={
                        <ProtectedRoute>
                            <MaintenanceHome />
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