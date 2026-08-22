import { useState } from "react";
import { useNavigate } from "react-router-dom";

import UserService from "../services/UserService";
import loginIllustration from "../../../assets/login-illustration.png";
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
            <section className="login-left">
                <div className="left-content">
                    <div className="brand">
                        <div className="brand-logo">
                            <span aria-hidden="true">◆</span>
                        </div>

                        <div>
                            <h2>BAMS</h2>

                            <p>
                                Business Asset Management System
                            </p>
                        </div>
                    </div>

                    <div className="hero-text">
                        <h1>
                            Manage <span>Assets</span>
                            <br />
                            Smarter
                        </h1>

                        <p>
                            Track, manage, and optimize your
                            company&apos;s assets
                            <br />
                            from one secure platform.
                        </p>
                    </div>

                    <div className="illustration-container">
                        <img
                            src={loginIllustration}
                            alt="Business asset management"
                        />
                    </div>

                    <div className="features">
                        <div className="feature-item">
                            <div
                                className="feature-icon"
                                aria-hidden="true"
                            >
                                ✓
                            </div>

                            <div>
                                <h3>Real-time Tracking</h3>
                                <p>
                                    Monitor all assets in real-time
                                </p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div
                                className="feature-icon"
                                aria-hidden="true"
                            >
                                ◉
                            </div>

                            <div>
                                <h3>Secure Management</h3>
                                <p>
                                    Your data is protected and safe
                                </p>
                            </div>
                        </div>

                        <div className="feature-item">
                            <div
                                className="feature-icon"
                                aria-hidden="true"
                            >
                                ⚒
                            </div>

                            <div>
                                <h3>Maintenance Monitoring</h3>
                                <p>
                                    Automate service schedules
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="login-right">
                <div className="login-card">
                    <div
                        className="login-icon"
                        aria-hidden="true"
                    >
                        <span>▣</span>
                    </div>

                    <div className="login-header">
                        <h1>ASSET MANAGEMENT SYSTEM</h1>
                        <p>Sign in to your account</p>

                        <span>
                            Manage your assets in one secure place
                        </span>
                    </div>

                    <form onSubmit={handleLogin} noValidate>
                        <div className="form-group">
                            <label htmlFor="username">
                                Username
                            </label>

                            <div className="input-wrapper">
                                <span
                                    className="input-icon"
                                    aria-hidden="true"
                                >
                                    👤
                                </span>

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

                        <div className="form-group">
                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">
                                <span
                                    className="input-icon"
                                    aria-hidden="true"
                                >
                                    🔒
                                </span>

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
                                    aria-pressed={showPassword}
                                    disabled={loading}
                                >
                                    {showPassword ? "◉" : "◌"}
                                </button>
                            </div>
                        </div>

                        <div className="login-options">
                            <label className="remember">
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
                                Forgot Password?
                            </button>
                        </div>

                        {error && (
                            <div
                                className="login-error"
                                role="alert"
                            >
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            className="login-button"
                            disabled={loading}
                        >
                            {loading
                                ? "Signing In..."
                                : "Sign In"}
                        </button>
                    </form>

                    <div className="divider">
                        <span />
                        <p>or continue with</p>
                        <span />
                    </div>

                    <div className="register-text">
                        <span>
                            Don&apos;t have an account?
                        </span>

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
                </div>
            </section>
        </main>
    );
}