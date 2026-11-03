
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Boxes,
    User,
    LockKeyhole,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    Package,
    TrendingUp,
    Activity,
    CheckCircle2,
    Building2,
} from "lucide-react";

import UserService from "../services/LoginService";
import "../css/Login.css";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    const handleLogin = async (event) => {
        event.preventDefault();

        const username = formData.username.trim();

        if (!username) {
            setError("Please enter your username.");
            return;
        }

        if (!formData.password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await UserService.login({
                username,
                password: formData.password,
            });

            const user = response.data;

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            sessionStorage.removeItem("user");
            sessionStorage.removeItem("isLoggedIn");

            const storage = rememberMe
                ? localStorage
                : sessionStorage;

            storage.setItem("user", JSON.stringify(user));
            storage.setItem("isLoggedIn", "true");

            navigate("/dashboard", {
                replace: true,
            });
        } catch (err) {
            console.error("Login error:", err);

            const status = err.response?.status;

            if (status === 401) {
                setError("Invalid username or password.");
            } else if (status === 404) {
                setError("Login service not found.");
            } else if (err.code === "ERR_NETWORK") {
                setError("Unable to connect to the server.");
            } else {
                setError(
                    err.response?.data?.message ||
                    "Login failed. Please try again."
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="login-page">

            {/* LEFT SIDE */}
            <section className="login-visual">

                <div className="visual-content">

                    {/* BRAND */}
                    <div className="login-brand">
                        <div className="brand-icon">
                            <Boxes size={25} />
                        </div>

                        <div className="brand-info">
                            <h2>BAMS</h2>
                            <p>Business Asset Management System</p>
                        </div>
                    </div>

                    {/* HERO */}
                    <div className="hero-text">
                        <span className="hero-label">
                            <span className="hero-label-dot" />
                            SMART BUSINESS MANAGEMENT
                        </span>

                        <h1>
                            Manage Your
                            <br />
                            <span>Assets Smarter.</span>
                        </h1>

                        <p>
                            Take control of your business assets with
                            a smarter, simpler, and more secure
                            management experience.
                        </p>
                    </div>

                    {/* DASHBOARD PREVIEW */}
                    <div className="dashboard-preview">

                        <div className="preview-heading">
                            <div>
                                <span className="preview-caption">
                                    SYSTEM OVERVIEW
                                </span>
                                <h3>Asset Dashboard</h3>
                            </div>

                            <div className="preview-status">
                                <span />
                                Live
                            </div>
                        </div>

                        <div className="preview-cards">

                            <div className="preview-card">
                                <div className="preview-card-top">
                                    <span className="preview-icon blue">
                                        <Package size={17} />
                                    </span>
                                    <TrendingUp size={15} className="trend-icon" />
                                </div>

                                <span className="preview-card-label">
                                    Active Assets
                                </span>

                                <strong>4,268</strong>

                                <small>
                                    <span>+12.4%</span> this month
                                </small>
                            </div>

                            <div className="preview-card">
                                <div className="preview-card-top">
                                    <span className="preview-icon green">
                                        <Activity size={17} />
                                    </span>
                                    <CheckCircle2
                                        size={15}
                                        className="trend-icon"
                                    />
                                </div>

                                <span className="preview-card-label">
                                    Operational Health
                                </span>

                                <strong>96.8%</strong>

                                <small>
                                    Across all locations
                                </small>
                            </div>
                        </div>

                        <div className="preview-chart">
                            <div className="chart-heading">
                                <div>
                                    <span>ASSET PERFORMANCE</span>
                                    <strong>Monthly Overview</strong>
                                </div>

                                <span className="chart-period">
                                    This year
                                </span>
                            </div>

                            <div className="chart-bars">
                                {[38, 55, 45, 72, 58, 86, 68, 95, 75, 88, 65, 100].map(
                                    (height, index) => (
                                        <div
                                            className="chart-bar-wrapper"
                                            key={index}
                                        >
                                            <div
                                                className={`chart-bar ${
                                                    index === 11
                                                        ? "active"
                                                        : ""
                                                }`}
                                                style={{
                                                    height: `${height}%`,
                                                }}
                                            />
                                        </div>
                                    )
                                )}
                            </div>

                            <div className="chart-months">
                                <span>JAN</span>
                                <span>MAR</span>
                                <span>MAY</span>
                                <span>JUL</span>
                                <span>SEP</span>
                                <span>DEC</span>
                            </div>
                        </div>
                    </div>

                    {/* FEATURES */}
                    <div className="visual-features">
                        <div>
                            <ShieldCheck size={16} />
                            <span>Secure Management</span>
                        </div>

                        <div>
                            <Activity size={16} />
                            <span>Real-time Tracking</span>
                        </div>

                        <div>
                            <Building2 size={16} />
                            <span>Centralized Control</span>
                        </div>
                    </div>

                    <div className="visual-copyright">
                        © {new Date().getFullYear()} BAMS. All rights reserved.
                    </div>

                </div>
            </section>

            {/* RIGHT SIDE */}
            <section className="login-main">

                <div className="login-topbar">
                    <div className="mobile-brand">
                        <div className="brand-icon">
                            <Boxes size={21} />
                        </div>
                        <span>BAMS</span>
                    </div>

                    <div className="topbar-security">
                        <ShieldCheck size={16} />
                        <span>Secure Access</span>
                    </div>
                </div>

                <div className="login-container">

                    <div className="login-card">

                        {/* LOGIN HEADER */}
                        <div className="login-heading">

                            <div className="login-heading-icon">
                                <LockKeyhole size={24} />
                            </div>

                            <span className="welcome-label">
                                WELCOME BACK
                            </span>

                            <h1>
                                Sign in to your
                                <span> account</span>
                            </h1>

                            <p>
                                Enter your credentials to access your
                                asset management dashboard.
                            </p>

                        </div>

                        {/* LOGIN FORM */}
                        <form onSubmit={handleLogin} noValidate>

                            {/* USERNAME */}
                            <div className="login-form-group">

                                <label htmlFor="username">
                                    Username
                                </label>

                                <div className="login-input-wrapper">

                                    <User
                                        className="login-input-icon"
                                        size={19}
                                    />

                                    <input
                                        id="username"
                                        type="text"
                                        name="username"
                                        placeholder="Enter your username"
                                        value={formData.username}
                                        onChange={handleChange}
                                        autoComplete="username"
                                        disabled={loading}
                                        autoFocus
                                    />

                                </div>
                            </div>

                            {/* PASSWORD */}
                            <div className="login-form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="login-input-wrapper">

                                    <LockKeyhole
                                        className="login-input-icon"
                                        size={18}
                                    />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        disabled={loading}
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                (previous) => !previous
                                            )
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        disabled={loading}
                                    >
                                        {showPassword ? (
                                            <EyeOff size={19} />
                                        ) : (
                                            <Eye size={19} />
                                        )}
                                    </button>

                                </div>
                            </div>

                            {/* OPTIONS */}
                            <div className="login-options">

                                <label className="remember-option">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(event) =>
                                            setRememberMe(
                                                event.target.checked
                                            )
                                        }
                                        disabled={loading}
                                    />

                                    <span className="custom-checkbox">
                                        <CheckCircle2 size={13} />
                                    </span>

                                    <span>Remember me</span>
                                </label>

                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() =>
                                        window.alert(
                                            "Please contact the administrator to reset your password."
                                        )
                                    }
                                >
                                    Forgot password?
                                </button>

                            </div>

                            {/* ERROR */}
                            {error && (
                                <div
                                    className="login-error"
                                    role="alert"
                                >
                                    <span className="error-icon">!</span>
                                    {error}
                                </div>
                            )}

                            {/* SUBMIT */}
                            <button
                                type="submit"
                                className="login-submit"
                                disabled={loading}
                            >
                                <span>
                                    {loading
                                        ? "Signing in..."
                                        : "Sign In"}
                                </span>

                                {!loading && (
                                    <ArrowRight size={19} />
                                )}
                            </button>

                        </form>

                        {/* DIVIDER */}
                        <div className="login-divider">
                            <span />
                            <p>SECURE BUSINESS ACCESS</p>
                            <span />
                        </div>

                        {/* ADMIN CONTACT */}
                        <div className="admin-contact">
                            <p>Don't have an account?</p>

                            <button
                                type="button"
                                onClick={() =>
                                    window.alert(
                                        "Please contact the administrator."
                                    )
                                }
                            >
                                Contact Administrator
                            </button>
                        </div>

                        <div className="login-security-note">
                            <ShieldCheck size={15} />
                            <span>
                                Your account is protected with secure access.
                            </span>
                        </div>

                    </div>
                </div>

                <footer className="login-footer">
                    <span>Powered by BAMS</span>
                    <span className="footer-dot">•</span>
                    <span>Business Asset Management System</span>
                </footer>

            </section>
        </main>
    );
}
