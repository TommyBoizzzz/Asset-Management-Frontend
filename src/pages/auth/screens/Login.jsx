import { useState } from "react";
import { useNavigate } from "react-router-dom";
import UserService from "../services/UserService";
import loginIllustration from "../../../assets/login-illustration.png";

const styles = `
* {
    box-sizing: border-box;
}

.login-page {
    min-height: 100vh;
    width: 100%;
    display: flex;
    background: #f4f9f6;
    font-family:
        Inter,
        -apple-system,
        BlinkMacSystemFont,
        "Segoe UI",
        sans-serif;
}

.login-left {
    width: 43%;
    min-height: 100vh;
    position: relative;
    overflow: hidden;

    background:
        radial-gradient(
            circle at 15% 10%,
            rgba(0, 195, 160, 0.12),
            transparent 25%
        ),
        linear-gradient(
            145deg,
            #061a2a 0%,
            #092b3c 50%,
            #061b2a 100%
        );

    color: white;
}

.login-left::before {
    content: "";
    position: absolute;
    width: 450px;
    height: 450px;
    background: rgba(0, 190, 160, 0.06);
    border-radius: 50%;
    left: -200px;
    bottom: -200px;
}

.login-left::after {
    content: "";
    position: absolute;
    width: 350px;
    height: 350px;
    background: rgba(0, 190, 160, 0.04);
    border-radius: 50%;
    right: -200px;
    top: 45%;
}

.left-content {
    width: 100%;
    max-width: 620px;
    min-height: 100vh;
    padding: 55px 70px;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
}

.brand {
    display: flex;
    align-items: center;
    gap: 12px;
}

.brand-logo {
    width: 42px;
    height: 42px;
    border-radius: 9px;
    background: linear-gradient(135deg, #00c49a, #007fba);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 25px rgba(0, 196, 154, 0.2);
}

.brand-logo span {
    font-size: 20px;
    color: white;
}

.brand h2 {
    margin: 0;
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.5px;
}

.brand p {
    margin: 2px 0 0;
    font-size: 10px;
    color: #9fb2bc;
}

.hero-text {
    margin-top: 65px;
}

.hero-text h1 {
    margin: 0;
    font-size: 42px;
    line-height: 1.08;
    font-weight: 700;
    letter-spacing: -1px;
}

.hero-text h1 span {
    color: #00c49a;
}

.hero-text p {
    margin-top: 18px;
    color: #9fb4bf;
    font-size: 14px;
    line-height: 1.7;
}

.illustration-container {
    margin-top: 35px;
    width: 100%;
    height: 220px;
    border-radius: 14px;
    overflow: hidden;
    background: rgba(0, 0, 0, 0.2);
    border: 1px solid rgba(0, 196, 154, 0.12);
}

.illustration-container img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
}

.features {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.feature-item {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 13px 15px;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.035);
    border: 1px solid rgba(255, 255, 255, 0.08);
    transition: 0.25s ease;
}

.feature-item:hover {
    background: rgba(0, 196, 154, 0.08);
    border-color: rgba(0, 196, 154, 0.25);
}

.feature-icon {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #00c49a;
    background: rgba(0, 196, 154, 0.1);
    font-size: 14px;
}

.feature-item h3 {
    margin: 0;
    font-size: 12px;
    font-weight: 500;
}

.feature-item p {
    margin: 3px 0 0;
    color: #839ba7;
    font-size: 10px;
}

.login-right {
    flex: 1;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
}

.login-card {
    width: 100%;
    max-width: 390px;
    padding: 32px 34px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 15px 45px rgba(20, 50, 40, 0.08);
    border: 1px solid rgba(0, 0, 0, 0.025);
}

.login-icon {
    width: 34px;
    height: 34px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: rgba(0, 196, 154, 0.1);
    color: #00b990;
    margin-bottom: 14px;
}

.login-icon span {
    font-size: 16px;
}

.login-header h1 {
    margin: 0;
    font-size: 12px;
    letter-spacing: 0.6px;
    font-weight: 700;
    color: #00a986;
}

.login-header p {
    margin: 6px 0 0;
    color: #333;
    font-size: 13px;
}

.login-header span {
    display: block;
    margin-top: 4px;
    color: #89938f;
    font-size: 10px;
}

.login-card form {
    margin-top: 26px;
}

.form-group {
    margin-bottom: 18px;
}

.form-group label {
    display: block;
    margin-bottom: 7px;
    font-size: 11px;
    color: #444;
}

.input-wrapper {
    height: 38px;
    display: flex;
    align-items: center;
    border: 1px solid #d4ddd9;
    border-radius: 7px;
    padding: 0 10px;
    transition: 0.2s;
}

.input-wrapper:focus-within {
    border-color: #00b990;
    box-shadow: 0 0 0 3px rgba(0, 185, 144, 0.08);
}

.input-icon {
    font-size: 12px;
    color: #9ca7a3;
    margin-right: 8px;
}

.input-wrapper input {
    width: 100%;
    height: 100%;
    border: none;
    outline: none;
    font-size: 11px;
    color: #333;
    background: transparent;
}

.input-wrapper input::placeholder {
    color: #adb5b2;
}

.password-toggle {
    border: none;
    background: transparent;
    cursor: pointer;
    color: #9aa5a1;
    font-size: 13px;
}

.login-options {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 2px;
    margin-bottom: 20px;
}

.remember {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 10px;
    color: #747d79;
    cursor: pointer;
}

.remember input {
    width: 12px;
    height: 12px;
    accent-color: #00b990;
}

.forgot-password {
    border: none;
    background: transparent;
    color: #00a986;
    font-size: 10px;
    cursor: pointer;
    padding: 0;
}

.forgot-password:hover {
    text-decoration: underline;
}

.login-error {
    padding: 9px 11px;
    margin-bottom: 15px;
    border-radius: 6px;
    background: #fff1f1;
    color: #dc4545;
    border: 1px solid #ffd5d5;
    font-size: 10px;
}

.login-button {
    width: 100%;
    height: 39px;
    border: none;
    border-radius: 7px;
    background: #00b990;
    color: white;
    font-size: 11px;
    cursor: pointer;
    transition: 0.2s;
    box-shadow: 0 5px 15px rgba(0, 185, 144, 0.15);
}

.login-button:hover {
    background: #00a982;
    transform: translateY(-1px);
}

.login-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
}

.divider {
    display: flex;
    align-items: center;
    gap: 9px;
    margin: 22px 0 18px;
}

.divider span {
    height: 1px;
    flex: 1;
    background: #e8ecea;
}

.divider p {
    margin: 0;
    color: #9ba39f;
    font-size: 9px;
}

.register-text {
    text-align: center;
    font-size: 10px;
    color: #858e8a;
}

.register-text button {
    border: none;
    background: transparent;
    color: #00a986;
    cursor: pointer;
    font-size: 10px;
    padding-left: 3px;
}

.register-text button:hover {
    text-decoration: underline;
}

@media (max-width: 1000px) {
    .login-left {
        width: 45%;
    }

    .left-content {
        padding: 40px;
    }

    .hero-text h1 {
        font-size: 34px;
    }
}

@media (max-width: 750px) {
    .login-page {
        display: block;
    }

    .login-left {
        width: 100%;
        min-height: auto;
    }

    .left-content {
        min-height: auto;
        padding: 35px 25px;
    }

    .hero-text {
        margin-top: 35px;
    }

    .illustration-container {
        height: 180px;
    }

    .features {
        margin-top: 30px;
    }

    .login-right {
        min-height: auto;
        padding: 35px 20px;
    }

    .login-card {
        max-width: 100%;
    }
}
`;

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

    // ========================================
    // Input Change
    // ========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
    };

    // ========================================
    // Login
    // ========================================

    const handleLogin = async (e) => {
        e.preventDefault();

        // Validate
        if (!formData.username.trim()) {
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

            // ==================================
            // API Login
            // ==================================

            const response = await UserService.login({
                username: formData.username,
                password: formData.password,
            });

            const user = response.data;

            console.log("Login successful:", user);

            // ==================================
            // Clear old auth data
            // ==================================

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");

            sessionStorage.removeItem("user");
            sessionStorage.removeItem("isLoggedIn");

            // ==================================
            // Remember Me
            // ==================================

            if (rememberMe) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                localStorage.setItem(
                    "isLoggedIn",
                    "true"
                );
            } else {
                sessionStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );

                sessionStorage.setItem(
                    "isLoggedIn",
                    "true"
                );
            }

            // ==================================
            // Go Dashboard
            // ==================================

            navigate("/dashboard", {
                replace: true,
            });

        } catch (err) {
            console.error("Login error:", err);

            if (err.response?.status === 401) {
                setError(
                    "Invalid username or password."
                );
            } else if (err.response?.status === 404) {
                setError(
                    "Login service not found."
                );
            } else {
                setError(
                    "Unable to connect to the server."
                );
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">

            <style>
                {styles}
            </style>

            {/* ==================================
                LEFT SIDE
            ================================== */}

            <div className="login-left">

                <div className="left-content">

                    {/* Brand */}

                    <div className="brand">

                        <div className="brand-logo">
                            <span>◆</span>
                        </div>

                        <div>
                            <h2>
                                BAMS
                            </h2>

                            <p>
                                Business Asset Management System
                            </p>
                        </div>

                    </div>

                    {/* Hero */}

                    <div className="hero-text">

                        <h1>
                            Manage{" "}
                            <span>
                                Assets
                            </span>

                            <br />

                            Smarter
                        </h1>

                        <p>
                            Track, manage, and optimize
                            your company's assets
                            <br />
                            from one secure platform.
                        </p>

                    </div>

                    {/* Illustration */}

                    <div className="illustration-container">

                        <img
                            src={loginIllustration}
                            alt="Asset Management"
                        />

                    </div>

                    {/* Features */}

                    <div className="features">

                        <div className="feature-item">

                            <div className="feature-icon">
                                ✓
                            </div>

                            <div>

                                <h3>
                                    Real-time Tracking
                                </h3>

                                <p>
                                    Monitor all assets in real-time
                                </p>

                            </div>

                        </div>

                        <div className="feature-item">

                            <div className="feature-icon">
                                ◉
                            </div>

                            <div>

                                <h3>
                                    Secure Management
                                </h3>

                                <p>
                                    Your data is protected and safe
                                </p>

                            </div>

                        </div>

                        <div className="feature-item">

                            <div className="feature-icon">
                                ⚒
                            </div>

                            <div>

                                <h3>
                                    Maintenance Monitoring
                                </h3>

                                <p>
                                    Automate service schedules
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

            {/* ==================================
                RIGHT SIDE
            ================================== */}

            <div className="login-right">

                <div className="login-card">

                    {/* Login Icon */}

                    <div className="login-icon">
                        <span>
                            ▣
                        </span>
                    </div>

                    {/* Header */}

                    <div className="login-header">

                        <h1>
                            ASSET MANAGEMENT SYSTEM
                        </h1>

                        <p>
                            Sign in to your account
                        </p>

                        <span>
                            Manage your assets in one secure place
                        </span>

                    </div>

                    {/* Form */}

                    <form onSubmit={handleLogin}>

                        {/* Username */}

                        <div className="form-group">

                            <label htmlFor="username">
                                Username
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
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
                                />

                            </div>

                        </div>

                        {/* Password */}

                        <div className="form-group">

                            <label htmlFor="password">
                                Password
                            </label>

                            <div className="input-wrapper">

                                <span className="input-icon">
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
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(
                                            (previous) =>
                                                !previous
                                        )
                                    }
                                    aria-label={
                                        showPassword
                                            ? "Hide password"
                                            : "Show password"
                                    }
                                >
                                    {showPassword
                                        ? "◉"
                                        : "◌"}
                                </button>

                            </div>

                        </div>

                        {/* Remember / Forgot */}

                        <div className="login-options">

                            <label className="remember">

                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) =>
                                        setRememberMe(
                                            e.target.checked
                                        )
                                    }
                                />

                                <span>
                                    Remember me
                                </span>

                            </label>

                            <button
                                type="button"
                                className="forgot-password"
                                onClick={() =>
                                    alert(
                                        "Please contact the administrator to reset your password."
                                    )
                                }
                            >
                                Forgot Password?
                            </button>

                        </div>

                        {/* Error */}

                        {error && (
                            <div className="login-error">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}

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

                    {/* Divider */}

                    <div className="divider">

                        <span />

                        <p>
                            or continue with
                        </p>

                        <span />

                    </div>

                    {/* Register */}

                    <div className="register-text">

                        <span>
                            Don't have an account?
                        </span>

                        <button
                            type="button"
                            onClick={() =>
                                alert(
                                    "Please contact the administrator."
                                )
                            }
                        >
                            Contact Administrator
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}