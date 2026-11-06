export const AUTO_LOCK_STORAGE_KEY = "autoLockMinutes";
export const AUTO_LOCK_CHANGE_EVENT = "autoLockSettingsChanged";
export const AUTO_LOCK_ACTIVITY_KEY = "autoLockLastActivity";

export const AUTO_LOCK_OPTIONS = ["5", "10", "15", "20", "Never"];

export const getAutoLockMinutes = () => {
    const storedValue = localStorage.getItem(AUTO_LOCK_STORAGE_KEY);
    return AUTO_LOCK_OPTIONS.includes(storedValue) ? storedValue : "5";
};

export const setAutoLockMinutes = (value) => {
    if (!AUTO_LOCK_OPTIONS.includes(value)) {
        throw new Error(`Unsupported auto-lock duration: ${value}`);
    }

    localStorage.setItem(AUTO_LOCK_STORAGE_KEY, value);
    window.dispatchEvent(new Event(AUTO_LOCK_CHANGE_EVENT));
};
