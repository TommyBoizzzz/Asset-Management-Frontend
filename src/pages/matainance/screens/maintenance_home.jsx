import { useEffect, useMemo, useState } from "react";
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
    Trash2,
    Calendar,
    DollarSign,
    User,
    FileText,
    X,
    ArrowRight,
} from "lucide-react";
import MaintenanceService from "../services/MaintenanceService";
import "../css/Maintenace.css";

const FILTER_TABS = [
    { key: "ALL", label: "All" },
    { key: "SCHEDULED", label: "Scheduled" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "COMPLETED", label: "Completed" },
];

const statusOrder = ["SCHEDULED", "IN_PROGRESS", "COMPLETED"];

const formatStatus = (status) => status.replace("_", " ");

function getStatusProgress(status) {
    if (status === "SCHEDULED") return 35;
    if (status === "IN_PROGRESS") return 68;
    return 100;
}

function getStatusLabel(status) {
    if (status === "SCHEDULED") return "Scheduled";
    if (status === "IN_PROGRESS") return "In Progress";
    return "Completed";
}

function getNextStatus(currentStatus) {
    const index = statusOrder.indexOf(currentStatus);
    return statusOrder[index + 1] || currentStatus;
}

const emptyTaskForm = {
    assetName: "",
    assetTag: "",
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
    const [maintenanceList, setMaintenanceList] = useState([]);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [taskModal, setTaskModal] = useState(null);
    const [taskForm, setTaskForm] = useState(emptyTaskForm);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchMaintenance = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await MaintenanceService.getAll();
                const normalized = (response.data || []).map(normalizeMaintenanceRecord);

                setMaintenanceList(normalized);
                if (normalized.length > 0) {
                    setSelectedRecord(normalized[0]);
                } else {
                    setSelectedRecord(null);
                }
            } catch (err) {
                console.error("Failed to load maintenance records:", err);
                setError("Unable to load maintenance records from the backend.");
                setMaintenanceList([]);
                setSelectedRecord(null);
            } finally {
                setLoading(false);
            }
        };

        fetchMaintenance();
    }, []);

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

    const updateStatus = (id, nextStatus) => {
        const timestamp = new Date();
        const formattedDate = timestamp.toISOString().slice(0, 10);

        setMaintenanceList((prev) =>
            prev.map((item) => {
                if (item.id !== id) return item;

                const completedDate =
                    nextStatus === "COMPLETED" ? formattedDate : item.completedDate;

                return {
                    ...item,
                    status: nextStatus,
                    completedDate,
                    updatedAt: timestamp.toLocaleString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                    }),
                    tracking: [
                        ...(item.tracking || []),
                        {
                            label: getStatusLabel(nextStatus),
                            date: formattedDate,
                            note: `Maintenance status updated to ${getStatusLabel(nextStatus)}.`,
                        },
                    ],
                };
            })
        );

        setSelectedRecord((prev) => {
            if (!prev || prev.id !== id) return prev;

            const updatedItem = maintenanceList.find((item) => item.id === id);

            return {
                ...updatedItem,
                status: nextStatus,
                completedDate:
                    nextStatus === "COMPLETED" ? formattedDate : updatedItem.completedDate,
                updatedAt: timestamp.toLocaleString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
                tracking: [
                    ...(updatedItem.tracking || []),
                    {
                        label: getStatusLabel(nextStatus),
                        date: formattedDate,
                        note: `Maintenance status updated to ${getStatusLabel(nextStatus)}.`,
                    },
                ],
            };
        });
    };

    const openAddTaskModal = () => {
        setTaskForm(emptyTaskForm);
        setTaskModal({ mode: "add" });
    };

    const openEditTaskModal = (task) => {
        setTaskForm({
            assetName: task.asset.name,
            assetTag: task.asset.assetTag,
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

    const handleSaveTask = (event) => {
        event.preventDefault();

        const now = new Date();
        const formattedDate = now.toISOString().slice(0, 10);

        const nextTask = {
            id: taskModal?.mode === "edit" ? taskModal.id : Date.now(),
            asset: {
                id: taskModal?.mode === "edit" ? maintenanceList.find((item) => item.id === taskModal.id)?.asset?.id || Date.now() : Date.now(),
                name: taskForm.assetName || "New Asset",
                assetTag: taskForm.assetTag || `AST-${Math.floor(Math.random() * 9000 + 1000)}`,
            },
            assignedTo: {
                id: taskModal?.mode === "edit" ? maintenanceList.find((item) => item.id === taskModal.id)?.assignedTo?.id || 1 : 1,
                name: taskForm.technicianName || "Unassigned",
                department: taskForm.department || "IT Support",
            },
            maintenanceType: taskForm.maintenanceType,
            scheduledDate: taskForm.scheduledDate || formattedDate,
            completedDate: taskForm.completedDate || null,
            problemDescription: taskForm.problemDescription || "No issue description provided.",
            actionTaken: taskForm.actionTaken || null,
            cost: Number(taskForm.cost || 0),
            status: taskForm.status,
            nextMaintenanceDate: taskForm.nextMaintenanceDate || "",
            notes: taskForm.notes || "",
            createdAt:
                taskModal?.mode === "edit"
                    ? maintenanceList.find((item) => item.id === taskModal.id)?.createdAt || now.toLocaleString()
                    : now.toLocaleString(),
            updatedAt: now.toLocaleString(),
            tracking:
                taskModal?.mode === "edit"
                    ? maintenanceList.find((item) => item.id === taskModal.id)?.tracking || []
                    : [
                        {
                            label: "Task created",
                            date: formattedDate,
                            note: "Maintenance task was created in the system.",
                        },
                    ],
        };

        if (taskModal?.mode === "edit") {
            setMaintenanceList((prev) =>
                prev.map((item) => (item.id === taskModal.id ? nextTask : item))
            );
            setSelectedRecord(nextTask);
        } else {
            setMaintenanceList((prev) => [nextTask, ...prev]);
            setSelectedRecord(nextTask);
        }

        setTaskModal(null);
        setTaskForm(emptyTaskForm);
    };

    const handleDeleteTask = (taskId) => {
        const confirmed = window.confirm("Delete this maintenance task?");

        if (!confirmed) return;

        setMaintenanceList((prev) => prev.filter((item) => item.id !== taskId));
        setSelectedRecord((prev) => (prev && prev.id === taskId ? null : prev));
    };

    return (
        <MainLayout activePage="Maintenance" title="Maintenance">
            <div className="maintenance-page">
                <header className="maintenance-header">
                    <div>
                        <h2>Maintenance</h2>
                        <p>Manage and track scheduled service records.</p>
                    </div>

                    <button type="button" className="add-maintenance-btn" onClick={openAddTaskModal}>
                        <Plus size={16} />
                        <span>Add Task</span>
                    </button>
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
                                                <button
                                                    type="button"
                                                    className="edit-btn"
                                                    onClick={() => openEditTaskModal(item)}
                                                    title="Edit Task"
                                                >
                                                    <Pencil size={15} />
                                                </button>
                                                <button
                                                    type="button"
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteTask(item.id)}
                                                    title="Delete Task"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
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
                    />
                )}

                {taskModal && (
                    <TaskModal
                        mode={taskModal.mode}
                        form={taskForm}
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

function DetailModal({ record, onClose, onStatusUpdate, onEdit }) {
    const progress = getStatusProgress(record.status);
    const nextStatus = getNextStatus(record.status);
    const canAdvance = nextStatus !== record.status;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content tracking-modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h3>Maintenance Record #{record.id}</h3>
                        <span className="modal-subtitle">Tracking and issue details</span>
                    </div>
                    <div className="modal-actions">
                        <button type="button" className="edit-inline-btn" onClick={() => onEdit(record)}>
                            <Pencil size={14} />
                            Edit
                        </button>
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

                            <div className="status-actions">
                                {canAdvance && (
                                    <button
                                        type="button"
                                        className="status-action-btn"
                                        onClick={() => onStatusUpdate(record.id, nextStatus)}
                                    >
                                        Mark as {getStatusLabel(nextStatus)}
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="progress-track">
                            <span style={{ width: `${progress}%` }} />
                        </div>

                        <div className="tracking-list">
                            {(record.tracking || []).map((step, index) => (
                                <div key={`${step.label}-${index}`} className="tracking-item">
                                    <span className="tracking-dot" />
                                    <div className="tracking-copy">
                                        <div className="tracking-topline">
                                            <strong>{step.label}</strong>
                                            <span>{step.date}</span>
                                        </div>
                                        <p>{step.note}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
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

function TaskModal({ mode, form, onClose, onChange, onSubmit }) {
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
                    <div className="task-form-grid">
                        <label className="form-field">
                            <span>Asset name</span>
                            <input
                                type="text"
                                value={form.assetName}
                                onChange={(event) => onChange("assetName", event.target.value)}
                            />
                        </label>

                        <label className="form-field">
                            <span>Asset tag</span>
                            <input
                                type="text"
                                value={form.assetTag}
                                onChange={(event) => onChange("assetTag", event.target.value)}
                            />
                        </label>

                        <label className="form-field">
                            <span>Technician</span>
                            <input
                                type="text"
                                value={form.technicianName}
                                onChange={(event) => onChange("technicianName", event.target.value)}
                            />
                        </label>

                        <label className="form-field">
                            <span>Department</span>
                            <input
                                type="text"
                                value={form.department}
                                onChange={(event) => onChange("department", event.target.value)}
                            />
                        </label>

                        <label className="form-field">
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

                        <label className="form-field">
                            <span>Status</span>
                            <select
                                value={form.status}
                                onChange={(event) => onChange("status", event.target.value)}
                            >
                                <option value="SCHEDULED">Scheduled</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                            </select>
                        </label>

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
