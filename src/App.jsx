import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../src/pages/auth/screens/Login";

function Dashboard() {
    return (
        <div>
            <h1>Dashboard</h1>
        </div>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Login />} />

                <Route path="/login" element={<Login />} />

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;