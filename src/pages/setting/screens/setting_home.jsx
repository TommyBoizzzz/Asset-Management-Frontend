import { useState } from "react";
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
import "./setting.css";

const initialProfile = {
    fullName: "John Smith",
    email: "john.smith@bams.com",
    phone: "+855 12 345 678",
    department: "IT Operations",
    role: "System Administrator",
};

const initialPreferences = {
    theme: "Dark mode",
    language: "English",
    timezone: "Bangkok (UTC+7)",
    dateFormat: "DD/MM/YYYY",
};

function SettingHome() {
    const [profile, setProfile] = useState(initialProfile);
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

    const handleSave = () => {
        console.log("Settings saved", {
            profile,
            preferences,
            notifications,
            security,
        });
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
                    >
                        <Save size={16} />
                        Save changes
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
        </MainLayout>
    );
}

export default SettingHome;
