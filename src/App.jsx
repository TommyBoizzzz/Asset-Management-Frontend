import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "./pages/auth/screens/Login";
import Dashboard from "./pages/dashboard/Dashboard";

// ========================================
// Protected Route
// ========================================

function ProtectedRoute({ children }) {
    const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true" ||
        sessionStorage.getItem("isLoggedIn") === "true";

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
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

                {/* ==================================
                    Default
                ================================== */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

                {/* ==================================
                    Login
                ================================== */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                {/* ==================================
                    Protected Dashboard
                ================================== */}
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                {/* ==================================
                    Unknown Route
                ================================== */}
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