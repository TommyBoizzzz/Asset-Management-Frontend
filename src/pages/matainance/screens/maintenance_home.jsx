import { useMemo, useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import {
    Wrench,
    Clock,
    CheckCircle2,
    AlertCircle,
    Plus,
    Search,
    Eye,
    Pencil,
    Calendar,
    DollarSign,
    User,
    FileText,
    X,
    ArrowRight,
} from "lucide-react";
import MaintenanceService from "../services/MaintenanceService";
import AssetService from "../../asset/services/AssetService";
import AssetAssignmentService from "../../assign_asset/services/Assetassignmentservice";
import StaffService from "../../staff/services/staff_home";
import {
    getStatusAfterInspection,
    isActiveAssignment,
    normalizeAssetStatus,
} from "../../../utils/assetLifecycle";
import { getStoredUser, hasPermission } from "../../../utils/permissions";
import useIntervalRefresh from "../../../hooks/useIntervalRefresh";
import "../css/Maintenace.css";

const FILTER_TABS = [
    { key: "ALL", label: "All" },
    { key: "SCHEDULED", label: "Scheduled" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "COMPLETED", label: "Completed" },
    { key: "CANCELLED", label: "Cancelled" },
];

const statusOrder = ["SCHEDULED", "IN_PROGRESS", "COMPLETED"];

const formatStatus = (status) => (status || "").replaceAll("_", " ");

function getStatusProgress(status) {
    if (status === "SCHEDULED") return 35;
    if (status === "IN_PROGRESS") return 68;
    return status === "COMPLETED" ? 100 : 0;
}

function getStatusLabel(status) {
    if (status === "SCHEDULED") return "Scheduled";
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "CANCELLED") return "Cancelled";
    return "Completed";
}

function getNextStatus(currentStatus) {
    const index = statusOrder.indexOf(currentStatus);
    if (index < 0) return currentStatus;
    return statusOrder[index + 1] || currentStatus;
}

const emptyTaskForm = {
    assetId: "",
    assetName: "",
    assetTag: "",
    staffId: "",
    technicianName: "",
    department: "IT Support",
    maintenanceType: "REPAIR",
    scheduledDate: "",
    completedDate: "",
    problemDescription: "",
    actionTaken: "",
    cost: "0",
    status: "SCHEDULED",
    nextMaintenanceDate: "",
    notes: "",
};

const normalizeMaintenanceRecord = (record) => {
    const asset = record.asset || {};
    const assignedTo = record.assignedTo || {};

    const normalizeDate = (value) => {
        if (!value) return "";
        const stringValue = String(value).trim();
        if (!stringValue) return "";

        return stringValue.includes("T")
            ? stringValue.slice(0, 10)
            : stringValue.slice(0, 10);
    };

    return {
        id: record.id,
        asset: {
            id: asset.id ?? null,
            name: asset.name || "Unknown Asset",
            assetTag: asset.assetCode || asset.assetTag || `AST-${asset.id || record.id}`,
        },
        assignedTo: {
            id: assignedTo.id ?? null,
            name: assignedTo.fullName || assignedTo.name || "Unassigned",
            department: assignedTo.position || assignedTo.department || "IT Support",
        },
        maintenanceType: record.maintenanceType || "REPAIR",
        scheduledDate: normalizeDate(record.scheduledDate),
        completedDate: normalizeDate(record.completedDate),
        problemDescription: record.problemDescription || "No issue description provided.",
        actionTaken: record.actionTaken || null,
        cost: Number(record.cost || 0),
        status: record.status || "SCHEDULED",
        completionCondition: record.completionCondition || record.conditionAfter || "",
        nextMaintenanceDate: normalizeDate(record.nextMaintenanceDate),
        notes: record.notes || "",
        createdAt: record.createdAt
            ? new Date(record.createdAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "",
        updatedAt: record.updatedAt
            ? new Date(record.updatedAt).toLocaleString("en-GB", {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            })
            : "",
        tracking: [],
    };
};

function MaintenanceHome() {
    const user = getStoredUser();
    const canCreate = hasPermission(user, "maintenance", "create");
    const canEdit = hasPermission(user, "maintenance", "edit");

    const [maintenanceList, setMaintenanceList] = useState([]);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [taskModal, setTaskModal] = useState(null);
    const [taskForm, setTaskForm] = useState(emptyTaskForm);
    const [assetOptions, setAssetOptions] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [staffOptions, setStaffOptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchData = async (background = false) => {
        try {
            if (!background) {
                setLoading(true);
                setError("");
            }

            const [maintenanceResponse, assetResponse, assignmentResponse, staffResponse] = await Promise.all([
                MaintenanceService.getAll(),
                AssetService.getAll(),
                AssetAssignmentService.getAll(),
                StaffService.getAll(),
            ]);

            const normalized = (maintenanceResponse.data || []).map(normalizeMaintenanceRecord);
            const assets = assetResponse.data || [];
            const staff = staffResponse.data || [];

            setMaintenanceList(normalized);
            setAssetOptions(assets);
            setAssignments(assignmentResponse.data || []);
            setStaffOptions(staff);
            setError("");
        } catch (err) {
            console.error("Failed to load maintenance records:", err);
            if (!background) {
                setError("Unable to load maintenance records from the backend.");
                setMaintenanceList([]);
                setAssetOptions([]);
                setAssignments([]);
                setStaffOptions([]);
            }
        } finally {
            if (!background) setLoading(false);
        }
    };

    useIntervalRefresh(
        (background) => fetchData(background),
        60_000,
        true
    );

    const filteredList = useMemo(() => {
        const query = searchTerm.toLowerCase();

        return maintenanceList.filter((item) => {
            const matchesStatus =
                filterStatus === "ALL" || item.status === filterStatus;
            const matchesSearch =
                item.asset.name.toLowerCase().includes(query) ||
                item.asset.assetTag.toLowerCase().includes(query) ||
                item.maintenanceType.toLowerCase().includes(query) ||
                item.problemDescription?.toLowerCase().includes(query) ||
                item.assignedTo?.name.toLowerCase().includes(query);

            return matchesStatus && matchesSearch;
        });
    }, [filterStatus, maintenanceList, searchTerm]);

    const stats = useMemo(() => ({
        total: maintenanceList.length,
        scheduled: maintenanceList.filter((item) => item.status === "SCHEDULED").length,
        inProgress: maintenanceList.filter((item) => item.status === "IN_PROGRESS").length,
        completed: maintenanceList.filter((item) => item.status === "COMPLETED").length,
    }), [maintenanceList]);

    const updateStatus = async (id, nextStatus, completionCondition) => {
        if (!canEdit) return;
        const timestamp = new Date();
        const formattedDate = timestamp.toISOString().slice(0, 10);
        const record = maintenanceList.find((item) => item.id === id);

        if (!record) return;

        const asset = assetOptions.find(
            (item) => String(item.id) === String(record.asset?.id)
        );

        if (!asset) {
            setError("The asset for this maintenance record could not be found.");
            return;
        }

        if (
            normalizeAssetStatus(asset.status) === "Retired" &&
            nextStatus !== "CANCELLED"
        ) {
            setError("Retired assets cannot enter maintenance.");
            return;
        }

        if (nextStatus === "IN_PROGRESS") {
            const hasActiveAssignment = assignments.some(
                (assignment) =>
                    isActiveAssignment(assignment) &&
                    String(assignment.asset?.id) === String(asset.id)
            );

            if (hasActiveAssignment) {
                setError("Return or transfer this asset before starting maintenance.");
                return;
            }
        }

        if (
            (nextStatus === "COMPLETED" ||
                (nextStatus === "CANCELLED" && record.status === "IN_PROGRESS")) &&
            !completionCondition
        ) {
            setError("Select the asset condition after maintenance before closing this task.");
            return;
        }

        const payload = {
            asset: { id: record.asset?.id || null },
            assignedTo: { id: record.assignedTo?.id || null },
            maintenanceType: record.maintenanceType,
            scheduledDate: record.scheduledDate,
            completedDate: nextStatus === "COMPLETED" ? formattedDate : record.completedDate || null,
            problemDescription: record.problemDescription,
            actionTaken: record.actionTaken,
            cost: Number(record.cost || 0),
            status: nextStatus,
            nextMaintenanceDate: record.nextMaintenanceDate || null,
            notes: record.notes,
        };

        let maintenanceSaved = false;

        try {
            let response;

            if (nextStatus === "COMPLETED") {
                response = await MaintenanceService.complete(id, payload);
            } else {
                response = await MaintenanceService.update(id, payload);
            }
            maintenanceSaved = true;

            const updatedItem = {
                ...normalizeMaintenanceRecord(response.data),
                completionCondition:
                    completionCondition || record.completionCondition,
            };

            if (nextStatus === "IN_PROGRESS") {
                await AssetService.update(asset.id, {
                    ...asset,
                    status: "Under Maintenance",
                });
            } else if (nextStatus === "COMPLETED") {
                await AssetService.update(asset.id, {
                    ...asset,
                    condition: completionCondition,
                    status: getStatusAfterInspection(completionCondition),
                });
            } else if (
                nextStatus === "CANCELLED" &&
                record.status === "IN_PROGRESS"
            ) {
                await AssetService.update(asset.id, {
                    ...asset,
                    condition: completionCondition,
                    status: getStatusAfterInspection(completionCondition),
                });
            }

            setMaintenanceList((prev) =>
                prev.map((item) => (item.id === id ? updatedItem : item))
            );
            setSelectedRecord(updatedItem);
            setError("");
        } catch (err) {
            console.error("Failed to update maintenance status:", err);
            setError(
                maintenanceSaved
                    ? "The maintenance record was updated, but the asset status or condition could not be updated. Refresh and reconcile the asset before continuing."
                    : err.response?.data?.message || "Failed to update maintenance status in the backend."
            );
        }
    };

    const openAddTaskModal = () => {
        if (!canCreate) return;
        setTaskForm({
            ...emptyTaskForm,
            assetId: assetOptions[0]?.id ? String(assetOptions[0].id) : "",
            staffId: staffOptions[0]?.id ? String(staffOptions[0].id) : "",
        });
        setTaskModal({ mode: "add" });
    };

    const openEditTaskModal = (task) => {
        if (!canEdit) return;
        setTaskForm({
            assetId: task.asset?.id ? String(task.asset.id) : "",
            assetName: task.asset?.name || "",
            assetTag: task.asset?.assetTag || "",
            staffId: task.assignedTo?.id ? String(task.assignedTo.id) : "",
            technicianName: task.assignedTo?.name || "",
            department: task.assignedTo?.department || "IT Support",
            maintenanceType: task.maintenanceType,
            scheduledDate: task.scheduledDate,
            completedDate: task.completedDate || "",
            problemDescription: task.problemDescription || "",
            actionTaken: task.actionTaken || "",
            cost: String(task.cost || 0),
            status: task.status,
            nextMaintenanceDate: task.nextMaintenanceDate || "",
            notes: task.notes || "",
        });
        setTaskModal({ mode: "edit", id: task.id });
    };

    const handleFormChange = (field, value) => {
        setTaskForm((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const hasActiveMaintenanceForAsset = (assetId, currentTaskId = null) => {
        const numericAssetId = Number(assetId);

        return maintenanceList.some((item) => {
            const sameAsset = Number(item.asset?.id) === numericAssetId;
            const isOpen = !["COMPLETED", "CANCELLED"].includes(item.status);
            const notCurrent = !currentTaskId || item.id !== currentTaskId;

            return sameAsset && isOpen && notCurrent;
        });
    };

    const handleSaveTask = async (event) => {
        event.preventDefault();
        if (taskModal?.mode === "edit" ? !canEdit : !canCreate) return;

        if (!taskForm.assetId || !taskForm.staffId) {
            setError("Please select both an asset and a staff member.");
            return;
        }

        const chosenAsset = assetOptions.find(
            (asset) => String(asset.id) === String(taskForm.assetId)
        );

        if (
            !chosenAsset ||
            normalizeAssetStatus(chosenAsset.status) === "Retired"
        ) {
            setError("Maintenance cannot be scheduled for a retired or missing asset.");
            return;
        }

        if (taskModal?.mode !== "edit" && hasActiveMaintenanceForAsset(taskForm.assetId)) {
            setError("This asset already has an active maintenance task. Complete it before creating a new one.");
            return;
        }

        const payload = {
            asset: { id: Number(taskForm.assetId) },
            assignedTo: { id: Number(taskForm.staffId) },
            maintenanceType: taskForm.maintenanceType,
            scheduledDate: taskForm.scheduledDate || new Date().toISOString().slice(0, 10),
            completedDate: taskForm.completedDate || null,
            problemDescription: taskForm.problemDescription || "No issue description provided.",
            actionTaken: taskForm.actionTaken || null,
            cost: Number(taskForm.cost || 0),
            status: taskForm.status,
            nextMaintenanceDate: taskForm.nextMaintenanceDate || null,
            notes: taskForm.notes || "",
        };

        try {
            if (taskModal?.mode === "edit") {
                const response = await MaintenanceService.update(taskModal.id, payload);
                const updatedRecord = normalizeMaintenanceRecord(response.data);

                setMaintenanceList((prev) =>
                    prev.map((item) => (item.id === updatedRecord.id ? updatedRecord : item))
                );
                setSelectedRecord(updatedRecord);
            } else {
                const response = await MaintenanceService.create(payload);
                const createdRecord = normalizeMaintenanceRecord(response.data);

                setMaintenanceList((prev) => [createdRecord, ...prev]);
                setSelectedRecord(createdRecord);
            }

            setTaskModal(null);
            setTaskForm(emptyTaskForm);
            setError("");
        } catch (err) {
            console.error("Failed to save maintenance record:", err);
            setError("Failed to save maintenance record to the backend.");
        }
    };

    return (
        <MainLayout activePage="Maintenance" title="Maintenance">
            <div className="maintenance-page">
                <header className="maintenance-header">
                    <div>
                        <h2>Maintenance</h2>
                        <p>Manage and track scheduled service records.</p>
                    </div>

                    {canCreate && <button type="button" className="add-maintenance-btn" onClick={openAddTaskModal}>
                        <Plus size={16} />
                        <span>Add Task</span>
                    </button>}
                </header>

                <section className="maintenance-stats">
                    <StatCard
                        label="Total Tasks"
                        value={stats.total}
                        desc="Logged records"
                        icon={<Wrench size={20} />}
                        theme="blue"
                    />
                    <StatCard
                        label="Scheduled"
                        value={stats.scheduled}
                        desc="Pending start"
                        icon={<Clock size={20} />}
                        theme="purple"
                    />
                    <StatCard
                        label="In Progress"
                        value={stats.inProgress}
                        desc="Under repair"
                        icon={<AlertCircle size={20} />}
                        theme="orange"
                    />
                    <StatCard
                        label="Completed"
                        value={stats.completed}
                        desc="Resolved"
                        icon={<CheckCircle2 size={20} />}
                        theme="green"
                    />
                </section>

                {loading && <div className="maintenance-loading">Loading maintenance records...</div>}
                {error && <div className="maintenance-error">{error}</div>}

                <section className="maintenance-card">
                    <div className="card-header">
                        <div className="history-search">
                            <Search size={16} />
                            <input
                                type="text"
                                placeholder="Search tasks, assets, or staff..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        <div className="filter-group">
                            {FILTER_TABS.map((tab) => (
                                <button
                                    key={tab.key}
                                    type="button"
                                    className={`filter-btn ${filterStatus === tab.key ? "active" : ""}`}
                                    onClick={() => setFilterStatus(tab.key)}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="table-responsive">
                        <table className="assets-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Asset Details</th>
                                    <th>Assigned To</th>
                                    <th>Type</th>
                                    <th>Scheduled</th>
                                    <th>Completed</th>
                                    <th>Cost</th>
                                    <th>Status</th>
                                    <th className="text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredList.length > 0 ? (
                                    filteredList.map((item) => (
                                        <tr key={item.id}>
                                            <td className="log-id">#{item.id}</td>
                                            <td>
                                                <div className="user-cell">
                                                    <strong>{item.asset.name}</strong>
                                                    <span>{item.asset.assetTag}</span>
                                                </div>
                                            </td>
                                            <td>
                                                {item.assignedTo ? (
                                                    <div className="user-cell">
                                                        <strong>{item.assignedTo.name}</strong>
                                                        <span>{item.assignedTo.department}</span>
                                                    </div>
                                                ) : (
                                                    <span className="unassigned">Unassigned</span>
                                                )}
                                            </td>
                                            <td>
                                                <span className="type-badge">{item.maintenanceType}</span>
                                            </td>
                                            <td className="date-cell">{item.scheduledDate}</td>
                                            <td className="date-cell">
                                                {item.completedDate || <span className="dash-text">—</span>}
                                            </td>
                                            <td className="cost-cell">
                                                ${Number(item.cost || 0).toFixed(2)}
                                            </td>
                                            <td>
                                                <span className={`status-pill ${item.status.toLowerCase().replace("_", "-")}`}>
                                                    {formatStatus(item.status)}
                                                </span>
                                            </td>
                                            <td className="text-right action-cell">
                                                <button
                                                    type="button"
                                                    className="view-btn"
                                                    onClick={() => setSelectedRecord(item)}
                                                    title="View Details"
                                                >
                                                    <Eye size={15} />
                                                </button>
                                                {canEdit && <button
                                                    type="button"
                                                    className="edit-btn"
                                                    onClick={() => openEditTaskModal(item)}
                                                    title="Edit Task"
                                                >
                                                    <Pencil size={15} />
                                                </button>}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="9" className="no-data">
                                            No maintenance records found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </section>

                {selectedRecord && (
                    <DetailModal
                        record={selectedRecord}
                        onClose={() => setSelectedRecord(null)}
                        onStatusUpdate={updateStatus}
                        onEdit={openEditTaskModal}
                        canEdit={canEdit}
                    />
                )}

                {taskModal && (
                    <TaskModal
                        mode={taskModal.mode}
                        form={taskForm}
                        assetOptions={assetOptions}
                        staffOptions={staffOptions}
                        onClose={() => {
                            setTaskModal(null);
                            setTaskForm(emptyTaskForm);
                        }}
                        onChange={handleFormChange}
                        onSubmit={handleSaveTask}
                    />
                )}
            </div>
        </MainLayout>
    );
}

function StatCard({ label, value, desc, icon, theme }) {
    return (
        <div className="stat-card">
            <div className="stat-content">
                <span className="stat-label">{label}</span>
                <h3>{value}</h3>
                <span className="stat-description">{desc}</span>
            </div>
            <div className={`stat-icon ${theme}`}>{icon}</div>
        </div>
    );
}

function DetailModal({ record, onClose, onStatusUpdate, onEdit, canEdit }) {
    const progress = getStatusProgress(record.status);
    const nextStatus = getNextStatus(record.status);
    const canAdvance = nextStatus !== record.status;
    const currentStep = statusOrder.indexOf(record.status);
    const timelineDetails = {
        SCHEDULED: {
            inProgress: "Work has not started yet",
            completed: "Awaiting completion",
        },
        IN_PROGRESS: {
            inProgress: "Technician is working on this task",
            completed: "Awaiting completion",
        },
        COMPLETED: {
            inProgress: "Service work finished",
            completed: record.completedDate
                ? `Service completed on ${record.completedDate}`
                : "Service work finished",
        },
        CANCELLED: {
            inProgress: "Task stopped before completion",
            completed: "Task was cancelled",
        },
    }[record.status] || {
        inProgress: "No work status available",
        completed: "No completion status available",
    };
    const timelineSteps = [
        {
            label: "Scheduled",
            detail: record.scheduledDate
                ? `Service scheduled for ${record.scheduledDate}`
                : "Maintenance task created",
        },
        {
            label: "In progress",
            detail: timelineDetails.inProgress,
        },
        {
            label: "Completed",
            detail: record.completedDate
                ? `Service completed on ${record.completedDate}`
                : timelineDetails.completed,
        },
    ];
    const [completionCondition, setCompletionCondition] = useState(
        record.completionCondition || "GOOD"
    );
    const requiresCondition =
        nextStatus === "COMPLETED" || record.status === "IN_PROGRESS";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content tracking-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3>Maintenance Record #{record.id}</h3>
                        <span className="modal-subtitle">Tracking and issue details</span>
                    </div>
                    <div className="modal-actions">
                        {canEdit && (
                            <button type="button" className="edit-inline-btn" onClick={() => onEdit(record)}>
                                <Pencil size={14} />
                                Edit
                            </button>
                        )}
                        <button type="button" className="close-btn" onClick={onClose}>
                            <X size={18} />
                        </button>
                    </div>
                </div>

                <div className="modal-body">
                    <div className="detail-grid">
                        <DetailField icon={<Wrench size={14} />} label="Asset" value={`${record.asset.name} (${record.asset.assetTag})`} />
                        <DetailField icon={<User size={14} />} label="Assigned Staff" value={record.assignedTo?.name || "N/A"} />
                        <DetailField icon={<FileText size={14} />} label="Type" value={record.maintenanceType} />
                        <DetailField icon={<DollarSign size={14} />} label="Cost" value={`$${Number(record.cost).toFixed(2)}`} />
                        <DetailField icon={<Calendar size={14} />} label="Scheduled Date" value={record.scheduledDate} />
                        <DetailField icon={<Calendar size={14} />} label="Completed Date" value={record.completedDate || "Pending"} />
                        <DetailField icon={<Calendar size={14} />} label="Next Service" value={record.nextMaintenanceDate || "N/A"} />
                        <div className="detail-item">
                            <label>Status</label>
                            <p>
                                <span className={`status-pill ${record.status.toLowerCase().replace("_", "-")}`}>
                                    {formatStatus(record.status)}
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="tracking-panel">
                        <div className="tracking-panel-header">
                            <div>
                                <label>Tracking progress</label>
                                <strong>{progress}%</strong>
                            </div>

                            {canEdit && <div className="status-actions">
                                {requiresCondition && (
                                    <label className="form-field">
                                        <span>Condition after maintenance</span>
                                        <select
                                            value={completionCondition}
                                            onChange={(event) => setCompletionCondition(event.target.value)}
                                        >
                                            <option value="GOOD">Good</option>
                                            <option value="FAIR">Fair</option>
                                            <option value="POOR">Poor</option>
                                            <option value="DAMAGED">Damaged</option>
                                        </select>
                                    </label>
                                )}
                                {canAdvance && (
                                    <button
                                        type="button"
                                        className="status-action-btn"
                                        onClick={() =>
                                            onStatusUpdate(
                                                record.id,
                                                nextStatus,
                                                completionCondition
                                            )
                                        }
                                    >
                                        Mark as {getStatusLabel(nextStatus)}
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                                {["SCHEDULED", "IN_PROGRESS"].includes(record.status) && (
                                    <button
                                        type="button"
                                        className="status-action-btn is-cancel"
                                        onClick={() =>
                                            onStatusUpdate(
                                                record.id,
                                                "CANCELLED",
                                                completionCondition
                                            )
                                        }
                                    >
                                        Cancel Maintenance
                                    </button>
                                )}
                            </div>}
                        </div>

                        <div className="progress-track">
                            <span style={{ width: `${progress}%` }} />
                        </div>

                        <ol className="maintenance-timeline" aria-label="Maintenance workflow">
                            {timelineSteps.map((step, index) => {
                                const isComplete = currentStep >= 0 && index < currentStep;
                                const isCurrent = currentStep === index;

                                return (
                                    <li
                                        key={step.label}
                                        className={`maintenance-timeline-step${isComplete ? " is-complete" : ""}${isCurrent ? " is-current" : ""}`}
                                        aria-current={isCurrent ? "step" : undefined}
                                    >
                                        <span className="maintenance-timeline-marker">
                                            {isComplete ? <CheckCircle2 size={15} /> : index + 1}
                                        </span>
                                        <div className="maintenance-timeline-copy">
                                            <strong>{step.label}</strong>
                                            <span>{step.detail}</span>
                                        </div>
                                    </li>
                                );
                            })}
                        </ol>
                        {record.status === "CANCELLED" && (
                            <div className="maintenance-cancelled-note">
                                <AlertCircle size={15} />
                                This maintenance task was cancelled.
                            </div>
                        )}
                    </div>

                    <DetailBlock label="Problem Description" content={record.problemDescription} />
                    <DetailBlock label="Action Taken" content={record.actionTaken} />
                    <DetailBlock label="Notes" content={record.notes} />

                    <div className="detail-timestamps">
                        <span><strong>Created:</strong> {record.createdAt}</span>
                        <span><strong>Updated:</strong> {record.updatedAt}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TaskModal({ mode, form, assetOptions, staffOptions, onClose, onChange, onSubmit }) {
    const title = mode === "edit" ? "Edit Maintenance Task" : "Add Maintenance Task";

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="task-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3>{title}</h3>
                        <span className="modal-subtitle">Update asset maintenance information</span>
                    </div>
                    <button type="button" className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
                </div>

                <form className="task-form" onSubmit={onSubmit}>
                    <section className="task-form-section">
                        <div className="task-form-section-heading">
                            <h4>Task details</h4>
                            <p>Choose the asset, technician, and service type.</p>
                        </div>
                        <div className="task-form-grid">
                            <label className="form-field">
                                <span>Asset</span>
                                <select
                                    value={form.assetId || ""}
                                    disabled={form.status !== "SCHEDULED"}
                                    onChange={(event) => onChange("assetId", event.target.value)}
                                >
                                    <option value="">Select asset</option>
                                    {assetOptions.map((asset) => (
                                        <option key={asset.id} value={asset.id}>
                                            {asset.name} ({asset.assetCode || asset.assetTag || `#${asset.id}`})
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="form-field">
                                <span>Assigned staff</span>
                                <select
                                    value={form.staffId || ""}
                                    onChange={(event) => onChange("staffId", event.target.value)}
                                >
                                    <option value="">Select staff</option>
                                    {staffOptions.map((staff) => (
                                        <option key={staff.id} value={staff.id}>
                                            {staff.fullName || staff.name} ({staff.position || staff.department || "Staff"})
                                        </option>
                                    ))}
                                </select>
                            </label>

                            <label className="form-field form-field-full">
                                <span>Maintenance type</span>
                                <select
                                    value={form.maintenanceType}
                                    onChange={(event) => onChange("maintenanceType", event.target.value)}
                                >
                                    <option value="REPAIR">REPAIR</option>
                                    <option value="PREVENTIVE">PREVENTIVE</option>
                                    <option value="INSPECTION">INSPECTION</option>
                                </select>
                            </label>
                        </div>
                    </section>

                    <section className="task-form-section">
                        <div className="task-form-section-heading">
                            <h4>Schedule &amp; cost</h4>
                            <p>Keep service dates and the maintenance cost up to date.</p>
                        </div>
                        <div className="task-form-grid">
                            <label className="form-field">
                                <span>Scheduled date</span>
                                <input
                                    type="date"
                                    value={form.scheduledDate}
                                    onChange={(event) => onChange("scheduledDate", event.target.value)}
                                />
                            </label>

                            <label className="form-field">
                                <span>Completed date</span>
                                <input
                                    type="date"
                                    value={form.completedDate}
                                    onChange={(event) => onChange("completedDate", event.target.value)}
                                />
                            </label>

                            <label className="form-field">
                                <span>Next service</span>
                                <input
                                    type="date"
                                    value={form.nextMaintenanceDate}
                                    onChange={(event) => onChange("nextMaintenanceDate", event.target.value)}
                                />
                            </label>

                            <label className="form-field">
                                <span>Cost</span>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={form.cost}
                                    onChange={(event) => onChange("cost", event.target.value)}
                                />
                            </label>
                        </div>
                    </section>

                    <section className="task-form-section">
                        <div className="task-form-section-heading">
                            <h4>Work notes</h4>
                            <p>Document the issue, work performed, and any extra details.</p>
                        </div>
                        <div className="task-form-grid">
                            <label className="form-field form-field-full">
                                <span>Problem description</span>
                                <textarea
                                    rows="3"
                                    value={form.problemDescription}
                                    onChange={(event) => onChange("problemDescription", event.target.value)}
                                />
                            </label>

                            <label className="form-field form-field-full">
                                <span>Action taken</span>
                                <textarea
                                    rows="3"
                                    value={form.actionTaken}
                                    onChange={(event) => onChange("actionTaken", event.target.value)}
                                />
                            </label>

                            <label className="form-field form-field-full">
                                <span>Notes</span>
                                <textarea
                                    rows="3"
                                    value={form.notes}
                                    onChange={(event) => onChange("notes", event.target.value)}
                                />
                            </label>
                        </div>
                    </section>

                    <div className="task-form-actions">
                        <button type="button" className="secondary-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="primary-btn">
                            {mode === "edit" ? "Save Changes" : "Create Task"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

function DetailField({ icon, label, value }) {
    return (
        <div className="detail-item">
            <label>{icon} {label}</label>
            <p>{value}</p>
        </div>
    );
}

function DetailBlock({ label, content }) {
    return (
        <div className="detail-block">
            <label>{label}</label>
            <div className="text-box">{content || "None recorded"}</div>
        </div>
    );
}

export default MaintenanceHome;
