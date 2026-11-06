import { useEffect, useState } from "react";
import {
    Bell,
    ChevronRight,
    Edit2,
    Eye,
    EyeOff,
    Globe,
    Lock,
    Moon,
    Palette,
    Save,
    ShieldCheck,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import LoginService from "../../auth/services/LoginService";
import UserService from "../../auth/services/UserService";
import { hasPermission } from "../../../utils/permissions";
import {
    AUTO_LOCK_OPTIONS,
    getAutoLockMinutes,
    setAutoLockMinutes,
} from "../../../utils/autoLock";
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
    const canEdit = hasPermission(getCurrentUser(), "settings", "edit");
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
        activityLog: true,
    });
    const [autoLockMinutes, setAutoLockMinutesState] = useState(getAutoLockMinutes);
    const [isSaving, setIsSaving] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
    const [profileForm, setProfileForm] = useState(() =>
        getProfileFromUser(getCurrentUser()) || defaultProfile
    );
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState(
        "Your personal settings have been updated successfully."
    );
    const [successTitle, setSuccessTitle] = useState("Profile saved");
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const handleProfileChange = (field, value) => {
        setProfileForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const closeProfileModal = () => {
        if (isSaving) return;
        setProfileForm(profile);
        setIsProfileModalOpen(false);
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

    const handleAutoLockChange = (value) => {
        setAutoLockMinutes(value);
        setAutoLockMinutesState(value);
    };

    const handlePasswordFormChange = (field, value) => {
        setPasswordForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const togglePasswordVisibility = (field) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [field]: !prev[field],
        }));
    };

    const closePasswordModal = () => {
        if (isChangingPassword) return;
        setIsPasswordModalOpen(false);
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setVisiblePasswords({});
        setPasswordError("");
    };

    useEffect(() => {
        const currentUser = getCurrentUser();

        if (currentUser) {
            setProfile(getProfileFromUser(currentUser));
        }
    }, []);

    const handleSave = async () => {
        if (!canEdit) return;

        setIsSaving(true);

        try {
            const activeStorage =
                localStorage.getItem("user") !== null
                    ? localStorage
                    : sessionStorage;
            const currentUser = getCurrentUser();

            const fullName = (profileForm.fullName || "").trim() || "User";

            const payload = {
                username: profileForm.username || currentUser?.username || "",
                password: currentUser?.password || "",
                fullName,
                email: profileForm.email,
                gender: normalizeGender(profileForm.gender),
                phone: profileForm.phone,
                department: profileForm.department,
                position: profileForm.position,
                status: currentUser?.status || "ACTIVE",
                role: currentUser?.role && typeof currentUser.role === "object"
                    ? { ...currentUser.role, name: profileForm.role }
                    : { name: profileForm.role },
            };

            let nextProfile = profileForm;
            if (currentUser?.id) {
                const response = await UserService.update(currentUser.id, payload);
                const savedUser = response?.data || currentUser;

                const nextUser = {
                    ...savedUser,
                    username: savedUser?.username || profileForm.username || currentUser?.username,
                    fullName: savedUser?.fullName || fullName,
                    email: savedUser?.email || profileForm.email,
                    phone: savedUser?.phone || profileForm.phone,
                    gender: normalizeGender(savedUser?.gender) || normalizeGender(profileForm.gender),
                    position: savedUser?.position || profileForm.position,
                    department: savedUser?.department || profileForm.department,
                    password: savedUser?.password || currentUser?.password || "",
                    role:
                        savedUser?.role && typeof savedUser.role === "object"
                            ? savedUser.role
                            : { name: profileForm.role },
                };

                activeStorage.setItem("user", JSON.stringify(nextUser));
                nextProfile = getProfileFromUser(nextUser);
            }

            console.log("Settings saved", {
                profile: profileForm,
                preferences,
                notifications,
                security,
            });

            await new Promise((resolve) => setTimeout(resolve, 700));
            setProfile(nextProfile);
            setProfileForm(nextProfile);
            setIsProfileModalOpen(false);
            setSuccessTitle("Profile saved");
            setSuccessMessage("Your personal settings have been updated successfully.");
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

    const handleChangePassword = async (event) => {
        event.preventDefault();
        if (!canEdit || isChangingPassword) return;

        const { currentPassword, newPassword, confirmPassword } = passwordForm;

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordError("Please complete all password fields.");
            return;
        }

        if (newPassword.length < 6) {
            setPasswordError("Your new password must be at least 6 characters.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError("The new passwords do not match.");
            return;
        }

        if (newPassword === currentPassword) {
            setPasswordError("Your new password must be different from the current password.");
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser?.id || !currentUser?.username) {
            setPasswordError("Unable to identify your account. Please sign in again.");
            return;
        }

        setIsChangingPassword(true);
        setPasswordError("");

        try {
            await LoginService.login({
                username: currentUser.username,
                password: currentPassword,
            });

            const fullName = (profile.fullName || "").trim() || "User";
            const payload = {
                username: currentUser.username,
                password: newPassword,
                fullName: currentUser.fullName || fullName,
                email: currentUser.email || "",
                gender: normalizeGender(currentUser.gender),
                phone: currentUser.phone || "",
                department: currentUser.department || currentUser.position || "",
                position: currentUser.position || "",
                status: currentUser.status || "ACTIVE",
                role: currentUser.role && typeof currentUser.role === "object"
                    ? currentUser.role
                    : { name: currentUser.role || profile.role },
            };

            await UserService.update(currentUser.id, payload);

            const activeStorage =
                localStorage.getItem("user") !== null
                    ? localStorage
                    : sessionStorage;
            activeStorage.setItem(
                "user",
                JSON.stringify({ ...currentUser, password: newPassword })
            );

            setIsPasswordModalOpen(false);
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setVisiblePasswords({});
            setSuccessTitle("Password changed");
            setSuccessMessage("Your password has been changed successfully.");
            setIsSuccessModalOpen(true);
        } catch (error) {
            console.error("Failed to change password:", error);
            const responseData = error?.response?.data;
            const message =
                typeof responseData === "string"
                    ? responseData
                    : responseData?.message || responseData?.error;
            setPasswordError(
                message ||
                "Unable to change your password. Check your current password and try again."
            );
        } finally {
            setIsChangingPassword(false);
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

                </div>

                <fieldset
                    className="settings-permission-fields"
                    disabled={!canEdit}
                    style={{
                        border: 0,
                        margin: 0,
                        padding: 0,
                        minWidth: 0,
                        width: "100%",
                    }}
                >
                <div className="settings-grid">
                    <section className="settings-card settings-card-wide">
                        <div className="profile-summary">
                            <div className="profile-summary-top">
                                <div className="profile-summary-person">
                                    <div className="profile-avatar" aria-hidden="true">
                                        {(profile.fullName || "U")
                                            .split(/\s+/)
                                            .map((part) => part[0])
                                            .join("")
                                            .slice(0, 2)
                                            .toUpperCase()}
                                    </div>
                                    <div className="profile-summary-name">
                                        <h4>{profile.fullName || "User"}</h4>
                                        <span>{profile.role}</span>
                                    </div>
                                </div>
                                {canEdit && (
                                    <button
                                        type="button"
                                        className="profile-edit-button"
                                        onClick={() => {
                                            setProfileForm(profile);
                                            setIsProfileModalOpen(true);
                                        }}
                                    >
                                        <Edit2 size={15} />
                                        Edit
                                    </button>
                                )}
                            </div>
                            <div className="profile-summary-details">
                                <div>
                                    <span>Username</span>
                                    <strong>{profile.username || "Not set"}</strong>
                                </div>
                                <div>
                                    <span>Email</span>
                                    <strong>{profile.email || "Not set"}</strong>
                                </div>
                                <div>
                                    <span>Gender</span>
                                    <strong>{profile.gender || "Not set"}</strong>
                                </div>
                                <div>
                                    <span>Phone</span>
                                    <strong>{profile.phone || "Not set"}</strong>
                                </div>
                            </div>
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
                        </div>
                        <label className="settings-option-item security-auto-lock-option">
                            <span>Auto lock (log out after inactivity)</span>
                            <select
                                value={autoLockMinutes}
                                onChange={(event) =>
                                    handleAutoLockChange(event.target.value)
                                }
                            >
                                {AUTO_LOCK_OPTIONS.map((duration) => (
                                    <option key={duration} value={duration}>
                                        {duration === "forever"
                                            ? "Forever"
                                            : `${duration} minutes`}
                                    </option>
                                ))}
                            </select>
                        </label>

                        <button
                            type="button"
                            className="security-link"
                            onClick={() => {
                                setPasswordError("");
                                setIsPasswordModalOpen(true);
                            }}
                        >
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
                                <span className="label">Role</span>
                                <strong>{profile.role}</strong>
                            </div>

                            <div className="workspace-item">
                                <span className="label">Department</span>
                                <strong>{profile.department}</strong>
                            </div>

                            <div className="workspace-item">
                                <span className="label">Position</span>
                                <strong>
                                    {profile.position}
                                </strong>
                            </div>
                        </div>
                    </section>
                </div>
                </fieldset>
            </div>

            {isProfileModalOpen && (
                <div className="settings-modal-overlay">
                    <section
                        className="profile-modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="edit-profile-title"
                    >
                        <div className="profile-modal-heading">
                            <div>
                                <span className="settings-overline">Personal settings</span>
                                <h3 id="edit-profile-title">Edit profile</h3>
                                <p>Update your personal information.</p>
                            </div>
                        </div>

                        <form
                            onSubmit={(event) => {
                                event.preventDefault();
                                handleSave();
                            }}
                        >
                            <div className="settings-form-grid profile-modal-fields">
                                <label className="form-field">
                                    <span>Username</span>
                                    <input
                                        type="text"
                                        value={profileForm.username}
                                        onChange={(event) =>
                                            handleProfileChange("username", event.target.value)
                                        }
                                    />
                                </label>

                                <label className="form-field">
                                    <span>Full name</span>
                                    <input
                                        type="text"
                                        value={profileForm.fullName}
                                        onChange={(event) =>
                                            handleProfileChange("fullName", event.target.value)
                                        }
                                    />
                                </label>

                                <label className="form-field">
                                    <span>Email</span>
                                    <input
                                        type="email"
                                        value={profileForm.email}
                                        onChange={(event) =>
                                            handleProfileChange("email", event.target.value)
                                        }
                                    />
                                </label>

                                <label className="form-field">
                                    <span>Gender</span>
                                    <input type="text" value={profileForm.gender} disabled />
                                </label>

                                <label className="form-field">
                                    <span>Phone</span>
                                    <input
                                        type="tel"
                                        value={profileForm.phone}
                                        onChange={(event) =>
                                            handleProfileChange("phone", event.target.value)
                                        }
                                    />
                                </label>
                            </div>

                            <div className="password-modal-actions profile-modal-actions">
                                <button
                                    type="button"
                                    className="password-modal-cancel"
                                    onClick={closeProfileModal}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="save-settings-button"
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
                        </form>
                    </section>
                </div>
            )}

            {isSuccessModalOpen && (
                <div className="settings-modal-overlay" role="dialog" aria-modal="true">
                    <div className="settings-modal-card">
                        <div className="settings-modal-icon">
                            <ShieldCheck size={22} />
                        </div>
                        <h3>{successTitle}</h3>
                        <p>
                            {successMessage}
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

            {isPasswordModalOpen && (
                <div className="settings-modal-overlay">
                    <section
                        className="password-modal-card"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="change-password-title"
                    >
                        <div className="password-modal-heading">
                            <div className="settings-icon accent-blue">
                                <Lock size={18} />
                            </div>
                            <div>
                                <h3 id="change-password-title">Change password</h3>
                                <p>Verify your current password to continue.</p>
                            </div>
                        </div>

                        <form onSubmit={handleChangePassword}>
                            <label className="password-modal-field">
                                <span>Current password</span>
                                <span className="password-input-wrap">
                                    <input
                                        type={visiblePasswords.currentPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={passwordForm.currentPassword}
                                        onChange={(event) =>
                                            handlePasswordFormChange(
                                                "currentPassword",
                                                event.target.value
                                            )
                                        }
                                        disabled={isChangingPassword}
                                        autoFocus
                                    />
                                    <button
                                        type="button"
                                        className="password-visibility-button"
                                        aria-label={visiblePasswords.currentPassword ? "Hide current password" : "Show current password"}
                                        onClick={() => togglePasswordVisibility("currentPassword")}
                                        disabled={isChangingPassword}
                                    >
                                        {visiblePasswords.currentPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </span>
                            </label>
                            <label className="password-modal-field">
                                <span>New password</span>
                                <span className="password-input-wrap">
                                    <input
                                        type={visiblePasswords.newPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        value={passwordForm.newPassword}
                                        onChange={(event) =>
                                            handlePasswordFormChange(
                                                "newPassword",
                                                event.target.value
                                            )
                                        }
                                        disabled={isChangingPassword}
                                    />
                                    <button
                                        type="button"
                                        className="password-visibility-button"
                                        aria-label={visiblePasswords.newPassword ? "Hide new password" : "Show new password"}
                                        onClick={() => togglePasswordVisibility("newPassword")}
                                        disabled={isChangingPassword}
                                    >
                                        {visiblePasswords.newPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </span>
                            </label>
                            <label className="password-modal-field">
                                <span>Confirm new password</span>
                                <span className="password-input-wrap">
                                    <input
                                        type={visiblePasswords.confirmPassword ? "text" : "password"}
                                        autoComplete="new-password"
                                        value={passwordForm.confirmPassword}
                                        onChange={(event) =>
                                            handlePasswordFormChange(
                                                "confirmPassword",
                                                event.target.value
                                            )
                                        }
                                        disabled={isChangingPassword}
                                    />
                                    <button
                                        type="button"
                                        className="password-visibility-button"
                                        aria-label={visiblePasswords.confirmPassword ? "Hide confirmation password" : "Show confirmation password"}
                                        onClick={() => togglePasswordVisibility("confirmPassword")}
                                        disabled={isChangingPassword}
                                    >
                                        {visiblePasswords.confirmPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                                    </button>
                                </span>
                            </label>

                            {passwordError && (
                                <p className="password-modal-error" role="alert">
                                    {passwordError}
                                </p>
                            )}

                            <div className="password-modal-actions">
                                <button
                                    type="button"
                                    className="password-modal-cancel"
                                    onClick={closePasswordModal}
                                    disabled={isChangingPassword}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="settings-modal-button"
                                    disabled={isChangingPassword}
                                >
                                    {isChangingPassword ? "Changing..." : "Update password"}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </MainLayout>
    );
}

export default SettingHome;
