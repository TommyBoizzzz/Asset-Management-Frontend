import { useEffect, useState } from "react";
import {
    Bell,
    ChevronRight,
    Globe,
    Lock,
    Moon,
    Palette,
    Save,
    ShieldCheck,
    User,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import UserService from "../../auth/services/UserService";
import "./setting.css";

const getCurrentUser = () => {
    const rawUser =
        localStorage.getItem("user") || sessionStorage.getItem("user");

    if (!rawUser) return null;

    try {
        return JSON.parse(rawUser);
    } catch {
        return null;
    }
};

const normalizeGender = (value) => {
    if (value === null || value === undefined || value === "") {
        return "";
    }

    const normalized = String(value).trim();
    const upper = normalized.toUpperCase();

    if (["MALE", "FEMALE", "OTHER"].includes(upper)) {
        return upper;
    }

    return normalized;
};

const getProfileFromUser = (user) => {
    const fullName = user?.fullName || "User";

    return {
        username: user?.username || "",
        fullName,
        email: user?.email || "",
        phone: user?.phone || "",
        gender: normalizeGender(user?.gender),
        position: user?.position || "",
        department:
            user?.department ||
            user?.position ||
            user?.role?.name ||
            "IT Operations",
        role: user?.role?.name || user?.role || "User",
        password: "",
    };
};

const defaultProfile = {
    username: "",
    fullName: "User",
    email: "",
    phone: "",
    gender: "",
    position: "",
    department: "IT Operations",
    role: "User",
    password: "",
};

const initialPreferences = {
    theme: "Dark mode",
    language: "English",
    timezone: "Bangkok (UTC+7)",
    dateFormat: "DD/MM/YYYY",
};

function SettingHome() {
    const [profile, setProfile] = useState(() =>
        getProfileFromUser(getCurrentUser()) || defaultProfile
    );
    const [preferences, setPreferences] = useState(initialPreferences);
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        pushAlerts: true,
        weeklyReports: false,
        maintenanceReminders: true,
    });
    const [security, setSecurity] = useState({
        twoFactor: true,
        autoLock: true,
        activityLog: true,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleProfileChange = (field, value) => {
        setProfile((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handlePreferenceChange = (field, value) => {
        setPreferences((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleToggle = (setter, key) => {
        setter((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    useEffect(() => {
        const currentUser = getCurrentUser();

        if (currentUser) {
            setProfile(getProfileFromUser(currentUser));
        }
    }, []);

    const handleSave = async () => {
        setIsSaving(true);

        try {
            const activeStorage =
                localStorage.getItem("user") !== null
                    ? localStorage
                    : sessionStorage;
            const currentUser = getCurrentUser();

            const updatedPassword = profile.password?.trim();
            const fullName = (profile.fullName || "").trim() || "User";

            const payload = {
                username: profile.username || currentUser?.username || "",
                password: updatedPassword || currentUser?.password || "",
                fullName,
                email: profile.email,
                gender: normalizeGender(profile.gender),
                phone: profile.phone,
                department: profile.department,
                position: profile.position,
                status: currentUser?.status || "ACTIVE",
                role: currentUser?.role && typeof currentUser.role === "object"
                    ? { ...currentUser.role, name: profile.role }
                    : { name: profile.role },
            };

            if (currentUser?.id) {
                const response = await UserService.update(currentUser.id, payload);
                const savedUser = response?.data || currentUser;

                const nextUser = {
                    ...savedUser,
                    username: savedUser?.username || profile.username || currentUser?.username,
                    fullName: savedUser?.fullName || fullName,
                    email: savedUser?.email || profile.email,
                    phone: savedUser?.phone || profile.phone,
                    gender: normalizeGender(savedUser?.gender) || normalizeGender(profile.gender),
                    position: savedUser?.position || profile.position,
                    department: savedUser?.department || profile.department,
                    password: updatedPassword || savedUser?.password || currentUser?.password || "",
                    role:
                        savedUser?.role && typeof savedUser.role === "object"
                            ? savedUser.role
                            : { name: profile.role },
                };

                activeStorage.setItem("user", JSON.stringify(nextUser));
            }

            console.log("Settings saved", {
                profile,
                preferences,
                notifications,
                security,
            });

            await new Promise((resolve) => setTimeout(resolve, 700));
            setProfile((prev) => ({ ...prev, password: "" }));
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error("Failed to save profile:", error);
            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Failed to save profile. Please try again."
            );
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <MainLayout
            activePage="Settings"
            title="Settings"
        >
            <div className="settings-page">
                <div className="settings-header">
                    <div>
                        <span className="settings-overline">
                            Workspace preferences
                        </span>
                        <h2>Personal settings</h2>
                    </div>

                    <button
                        type="button"
                        className="save-settings-button"
                        onClick={handleSave}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <span className="save-loader" aria-hidden="true" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={16} />
                                Save changes
                            </>
                        )}
                    </button>
                </div>

                <div className="settings-grid">
                    <section className="settings-card settings-card-wide">
                        <div className="settings-card-header">
                            <div className="settings-icon accent-blue">
                                <User size={18} />
                            </div>
                            <div>
                                <h3>Profile</h3>
                                <p>Update your personal details</p>
                            </div>
                        </div>

                        <div className="settings-form-grid">
                            <label className="form-field">
                                <span>Username</span>
                                <input
                                    type="text"
                                    value={profile.username}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "username",
                                            event.target.value
                                        )
                                    }
                                />
                            </label>

                            <label className="form-field">
                                <span>Full name</span>
                                <input
                                    type="text"
                                    value={profile.fullName}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "fullName",
                                            event.target.value
                                        )
                                    }
                                />
                            </label>

                            <label className="form-field">
                                <span>Email</span>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "email",
                                            event.target.value
                                        )
                                    }
                                />
                            </label>

                            <label className="form-field">
                                <span>Gender</span>
                                <input
                                    type="text"
                                    value={profile.gender}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "gender",
                                            event.target.value
                                        )
                                    }
                                />
                            </label>

                            <label className="form-field">
                                <span>Phone</span>
                                <input
                                    type="tel"
                                    value={profile.phone}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "phone",
                                            event.target.value
                                        )
                                    }
                                />
                            </label>

                            <label className="form-field">
                                <span>Position</span>
                                <input
                                    type="text"
                                    value={profile.position}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "position",
                                            event.target.value
                                        )
                                    }
                                />
                            </label>

                            <label className="form-field">
                                <span>Department</span>
                                <input
                                    type="text"
                                    value={profile.department}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "department",
                                            event.target.value
                                        )
                                    }
                                />
                            </label>

                            <label className="form-field form-field-full">
                                <span>Role</span>
                                <input
                                    type="text"
                                    value={profile.role}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "role",
                                            event.target.value
                                        )
                                    }
                                />
                            </label>

                            <label className="form-field form-field-full">
                                <span>Password</span>
                                <input
                                    type="password"
                                    value={profile.password || ""}
                                    onChange={(event) =>
                                        handleProfileChange(
                                            "password",
                                            event.target.value
                                        )
                                    }
                                    placeholder="Leave blank to keep current password"
                                />
                            </label>
                        </div>
                    </section>

                    <section className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-icon accent-purple">
                                <Moon size={18} />
                            </div>
                            <div>
                                <h3>Preferences</h3>
                                <p>Customize your workspace</p>
                            </div>
                        </div>

                        <div className="settings-list">
                            <label className="settings-option-item">
                                <span>Theme</span>
                                <select
                                    value={preferences.theme}
                                    onChange={(event) =>
                                        handlePreferenceChange(
                                            "theme",
                                            event.target.value
                                        )
                                    }
                                >
                                    <option>Dark mode</option>
                                    <option>Light mode</option>
                                    <option>System default</option>
                                </select>
                            </label>

                            <label className="settings-option-item">
                                <span>Language</span>
                                <select
                                    value={preferences.language}
                                    onChange={(event) =>
                                        handlePreferenceChange(
                                            "language",
                                            event.target.value
                                        )
                                    }
                                >
                                    <option>English</option>
                                    <option>Khmer</option>
                                    <option>French</option>
                                </select>
                            </label>

                            <label className="settings-option-item">
                                <span>Timezone</span>
                                <select
                                    value={preferences.timezone}
                                    onChange={(event) =>
                                        handlePreferenceChange(
                                            "timezone",
                                            event.target.value
                                        )
                                    }
                                >
                                    <option>Bangkok (UTC+7)</option>
                                    <option>UTC</option>
                                    <option>Singapore (UTC+8)</option>
                                </select>
                            </label>

                            <label className="settings-option-item">
                                <span>Date format</span>
                                <select
                                    value={preferences.dateFormat}
                                    onChange={(event) =>
                                        handlePreferenceChange(
                                            "dateFormat",
                                            event.target.value
                                        )
                                    }
                                >
                                    <option>DD/MM/YYYY</option>
                                    <option>MM/DD/YYYY</option>
                                    <option>YYYY-MM-DD</option>
                                </select>
                            </label>
                        </div>
                    </section>

                    <section className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-icon accent-gold">
                                <Bell size={18} />
                            </div>
                            <div>
                                <h3>Notifications</h3>
                                <p>Alert preferences</p>
                            </div>
                        </div>

                        <div className="settings-toggle-list">
                            <div className="toggle-row">
                                <div>
                                    <strong>Email alerts</strong>
                                    <span>Receive key updates by email</span>
                                </div>
                                <button
                                    type="button"
                                    className={`toggle-switch ${notifications.emailAlerts ? "on" : ""}`}
                                    onClick={() =>
                                        handleToggle(
                                            setNotifications,
                                            "emailAlerts"
                                        )
                                    }
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="toggle-row">
                                <div>
                                    <strong>Push notifications</strong>
                                    <span>Instant notifications in browser</span>
                                </div>
                                <button
                                    type="button"
                                    className={`toggle-switch ${notifications.pushAlerts ? "on" : ""}`}
                                    onClick={() =>
                                        handleToggle(
                                            setNotifications,
                                            "pushAlerts"
                                        )
                                    }
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="toggle-row">
                                <div>
                                    <strong>Weekly reports</strong>
                                    <span>Scheduled summary of asset usage</span>
                                </div>
                                <button
                                    type="button"
                                    className={`toggle-switch ${notifications.weeklyReports ? "on" : ""}`}
                                    onClick={() =>
                                        handleToggle(
                                            setNotifications,
                                            "weeklyReports"
                                        )
                                    }
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="toggle-row">
                                <div>
                                    <strong>Maintenance reminders</strong>
                                    <span>Equipment service reminders</span>
                                </div>
                                <button
                                    type="button"
                                    className={`toggle-switch ${notifications.maintenanceReminders ? "on" : ""}`}
                                    onClick={() =>
                                        handleToggle(
                                            setNotifications,
                                            "maintenanceReminders"
                                        )
                                    }
                                >
                                    <span />
                                </button>
                            </div>
                        </div>
                    </section>

                    <section className="settings-card">
                        <div className="settings-card-header">
                            <div className="settings-icon accent-green">
                                <ShieldCheck size={18} />
                            </div>
                            <div>
                                <h3>Security</h3>
                                <p>Manage account protection</p>
                            </div>
                        </div>

                        <div className="settings-toggle-list">
                            <div className="toggle-row">
                                <div>
                                    <strong>Two-factor authentication</strong>
                                    <span>Extra login protection</span>
                                </div>
                                <button
                                    type="button"
                                    className={`toggle-switch ${security.twoFactor ? "on" : ""}`}
                                    onClick={() =>
                                        handleToggle(
                                            setSecurity,
                                            "twoFactor"
                                        )
                                    }
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="toggle-row">
                                <div>
                                    <strong>Auto lock</strong>
                                    <span>Lock after inactivity</span>
                                </div>
                                <button
                                    type="button"
                                    className={`toggle-switch ${security.autoLock ? "on" : ""}`}
                                    onClick={() =>
                                        handleToggle(
                                            setSecurity,
                                            "autoLock"
                                        )
                                    }
                                >
                                    <span />
                                </button>
                            </div>

                            <div className="toggle-row">
                                <div>
                                    <strong>Activity log</strong>
                                    <span>Track important account actions</span>
                                </div>
                                <button
                                    type="button"
                                    className={`toggle-switch ${security.activityLog ? "on" : ""}`}
                                    onClick={() =>
                                        handleToggle(
                                            setSecurity,
                                            "activityLog"
                                        )
                                    }
                                >
                                    <span />
                                </button>
                            </div>
                        </div>

                        <button type="button" className="security-link">
                            <Lock size={16} />
                            Change password
                            <ChevronRight size={16} />
                        </button>
                    </section>

                    <section className="settings-card settings-card-wide">
                        <div className="settings-card-header">
                            <div className="settings-icon accent-cyan">
                                <Globe size={18} />
                            </div>
                            <div>
                                <h3>Workspace</h3>
                                <p>Company and portal preferences</p>
                            </div>
                        </div>

                        <div className="workspace-summary">
                            <div className="workspace-item">
                                <span className="label">Company</span>
                                <strong>BAMS Asset Management</strong>
                            </div>
                            <div className="workspace-item">
                                <span className="label">Portal</span>
                                <strong>Staff portal</strong>
                            </div>
                            <div className="workspace-item">
                                <span className="label">Theme</span>
                                <strong>{preferences.theme}</strong>
                            </div>
                            <div className="workspace-item">
                                <span className="label">Security</span>
                                <strong>{security.twoFactor ? "Protected" : "Basic"}</strong>
                            </div>
                        </div>
                    </section>
                </div>
            </div>

            {isSuccessModalOpen && (
                <div className="settings-modal-overlay" role="dialog" aria-modal="true">
                    <div className="settings-modal-card">
                        <div className="settings-modal-icon">
                            <ShieldCheck size={22} />
                        </div>
                        <h3>Profile saved</h3>
                        <p>
                            Your personal settings have been updated successfully.
                        </p>
                        <button
                            type="button"
                            className="settings-modal-button"
                            onClick={() => setIsSuccessModalOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
}

export default SettingHome;
