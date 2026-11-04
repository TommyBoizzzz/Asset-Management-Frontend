const STATUS_ALIASES = new Map([
    ["active", "Available"],
    ["available", "Available"],
    ["assigned", "Assigned"],
    ["maintenance", "Under Maintenance"],
    ["undermaintenance", "Under Maintenance"],
    ["damaged", "Damaged"],
    ["inactive", "Retired"],
    ["retired", "Retired"],
]);

export function normalizeAssetStatus(status) {
    const value = String(status || "").trim();
    const key = value.toLowerCase().replace(/[\s_-]+/g, "");

    return STATUS_ALIASES.get(key) || value || "Unknown";
}

export function isAssetAvailable(asset) {
    return normalizeAssetStatus(asset?.status) === "Available";
}

export function isActiveAssignment(assignment) {
    return String(assignment?.status || "").toUpperCase() === "ACTIVE";
}

export function getStatusAfterInspection(condition) {
    return String(condition || "").toUpperCase() === "DAMAGED"
        ? "Damaged"
        : "Available";
}
