
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
  Boxes,
} from "lucide-react";
import LoginService from "../services/LoginService";
import "../css/Login.css";

const getErrorMessage = (error, fallback) => {
  const responseData = error?.response?.data;

  if (typeof responseData === "string") {
    return responseData;
  }

  if (responseData?.message) {
    return responseData.message;
  }

  if (responseData?.error) {
    return responseData.error;
  }

  return error?.message || fallback;
};

const extractLoginPayload = (response) => {
  const payload = response?.data;

  if (!payload || typeof payload !== "object") {
    return {};
  }

  if (payload.user || payload.token || payload.accessToken || payload.jwt) {
    return payload;
  }

  if (payload.data && typeof payload.data === "object") {
    return payload.data;
  }

  return payload;
};

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const usernamePlaceholder = "Enter your username";

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);
    setErrorMessage("");

    try {
      const response = await LoginService.login({
        username: formData.username.trim(),
        password: formData.password,
      });

      const loginData = extractLoginPayload(response);
      const user = loginData.user || loginData.data || loginData;
      const token =
        loginData.token ||
        loginData.accessToken ||
        loginData.jwt ||
        loginData.authToken;

      const activeStorage = rememberMe ? localStorage : sessionStorage;
      const inactiveStorage = rememberMe ? sessionStorage : localStorage;

      inactiveStorage.removeItem("user");
      inactiveStorage.removeItem("accessToken");
      inactiveStorage.removeItem("isLoggedIn");

      if (user) {
        activeStorage.setItem("user", JSON.stringify(user));
      }

      if (token) {
        activeStorage.setItem("accessToken", token);
      }

      activeStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      setErrorMessage(
        getErrorMessage(error, "Unable to sign in. Please try again.")
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      {/* Background */}
      <div className="login-background">
        <div className="login-orb orb-one" />
        <div className="login-orb orb-two" />
        <div className="login-grid" />
      </div>

      <section className="login-container">
        {/* Left Panel */}
        <div className="login-showcase">
          <div className="showcase-content">
            <div className="brand-logo">
              <Boxes size={27} strokeWidth={2.2} />
            </div>

            <span className="showcase-label">
              ASSET MANAGEMENT SYSTEM
            </span>

            <h1>
              Manage Your
              <br />
              Assets <span>Smarter.</span>
            </h1>

            <p>
              A smarter way to manage, track, and control
              your organization's assets from one powerful
              platform.
            </p>

            <div className="showcase-features">
              <div>
                <ShieldCheck size={19} />
                <span>Secure Management</span>
              </div>

              <div>
                <Boxes size={19} />
                <span>Centralized Asset Control</span>
              </div>
            </div>
          </div>

          <div className="showcase-footer">
            <span>POWERED BY TECHNOLOGY</span>
            <span>VERSION 1.0.0</span>
          </div>
        </div>

        {/* Right Panel */}
        <div className="login-form-panel">
          <div className="login-form-wrapper">
            <div className="mobile-brand">
              <div className="brand-logo">
                <Boxes size={24} />
              </div>
              <span>ASSET MANAGEMENT</span>
            </div>

            <div className="form-heading">
              <span className="welcome-label">
                WELCOME BACK
              </span>

              <h2>Sign in</h2>

              <p>
                Enter your credentials to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {errorMessage && (
                <div className="login-message login-message-error">
                  {errorMessage}
                </div>
              )}

              {/* Username */}
              <div className="form-group">
                <label htmlFor="username">Username</label>

                <div className="input-wrapper">
                  <Mail size={19} />

                  <input
                    id="username"
                    type="text"
                    name="username"
                    placeholder={usernamePlaceholder}
                    value={formData.username}
                    onChange={handleChange}
                    autoComplete="username"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="form-group">
                <div className="password-label">
                  <label htmlFor="password">Password</label>

                  <a href="/forgot-password">
                    Forgot password?
                  </a>
                </div>

                <div className="input-wrapper">
                  <LockKeyhole size={19} />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                    required
                  />

                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember */}
              <div className="remember-row">
                <label className="remember-option">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) =>
                      setRememberMe(e.target.checked)
                    }
                  />
                  <span>Remember me</span>
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="login-submit"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="login-spinner" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign in to your account
                    <ArrowRight size={19} />
                  </>
                )}
              </button>
            </form>

            <div className="login-security">
              <ShieldCheck size={17} />
              <span>Your account is protected and secure.</span>
            </div>

            <div className="login-copyright">
              © 2026 Asset Management System. All rights reserved.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
