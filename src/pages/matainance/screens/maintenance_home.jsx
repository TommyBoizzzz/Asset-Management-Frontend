import { useState } from "react";
import MainLayout from "../../../layouts/MainLayout";
import { 
    Wrench, 
    Clock, 
    CheckCircle2, 
    AlertCircle, 
    Plus, 
    Search,
    Eye,
    Calendar,
    DollarSign,
    User,
    FileText,
    X
} from "lucide-react";
import "../css/Maintenace.css";

const initialMaintenanceData = [
    {
        id: 1,
        asset: { id: 101, name: "MacBook Pro 16\"", assetTag: "AST-00812" },
        assignedTo: { id: 12, name: "Sophea Chan", department: "IT Support" },
        maintenanceType: "REPAIR",
        scheduledDate: "2026-08-18",
        completedDate: null,
        problemDescription: "Screen flickering and overheating under heavy rendering loads.",
        actionTaken: "Replaced thermal paste and ordered replacement display module.",
        cost: 150.00,
        status: "IN_PROGRESS",
        nextMaintenanceDate: "2027-02-18",
        notes: "Priority service request for design team lead.",
        createdAt: "2026-08-17 09:30 AM",
        updatedAt: "2026-08-18 02:15 PM"
    },
    {
        id: 2,
        asset: { id: 102, name: "Dell XPS 15", assetTag: "AST-00098" },
        assignedTo: { id: 14, name: "Vireak Bun", department: "IT Support" },
        maintenanceType: "PREVENTIVE",
        scheduledDate: "2026-08-25",
        completedDate: null,
        problemDescription: "Routine quarterly hardware check and dust cleanup.",
        actionTaken: null,
        cost: 0.00,
        status: "SCHEDULED",
        nextMaintenanceDate: "2027-02-25",
        notes: "Regularly scheduled preventive task.",
        createdAt: "2026-08-01 10:00 AM",
        updatedAt: "2026-08-01 10:00 AM"
    },
    {
        id: 3,
        asset: { id: 103, name: "HP LaserJet Enterprise", assetTag: "AST-00045" },
        assignedTo: { id: 15, name: "Bora Kim", department: "Operations" },
        maintenanceType: "REPAIR",
        scheduledDate: "2026-08-10",
        completedDate: "2026-08-12",
        problemDescription: "Paper jam issue and roller degradation.",
        actionTaken: "Replaced feed rollers and thoroughly cleaned internal paper tray.",
        cost: 85.50,
        status: "COMPLETED",
        nextMaintenanceDate: "2027-08-10",
        notes: "Tested successfully after maintenance.",
        createdAt: "2026-08-10 08:00 AM",
        updatedAt: "2026-08-12 04:30 PM"
    }
];

const FILTER_TABS = [
    { key: "ALL", label: "All" },
    { key: "SCHEDULED", label: "Scheduled" },
    { key: "IN_PROGRESS", label: "In Progress" },
    { key: "COMPLETED", label: "Completed" }
];

function MaintenanceHome() {
    const [maintenanceList] = useState(initialMaintenanceData);
    const [filterStatus, setFilterStatus] = useState("ALL");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRecord, setSelectedRecord] = useState(null);

    const filteredList = maintenanceList.filter((item) => {
        const query = searchTerm.toLowerCase();
        const matchesStatus = filterStatus === "ALL" || item.status === filterStatus;
        const matchesSearch = 
            item.asset.name.toLowerCase().includes(query) ||
            item.asset.assetTag.toLowerCase().includes(query) ||
            item.maintenanceType.toLowerCase().includes(query) ||
            item.problemDescription?.toLowerCase().includes(query) ||
            item.assignedTo?.name.toLowerCase().includes(query);

        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: maintenanceList.length,
        scheduled: maintenanceList.filter(i => i.status === "SCHEDULED").length,
        inProgress: maintenanceList.filter(i => i.status === "IN_PROGRESS").length,
        completed: maintenanceList.filter(i => i.status === "COMPLETED").length
    };

    return (
        <MainLayout activePage="Maintenance" title="Maintenance">
            <div className="maintenance-page">

                {/* Header Section */}
                <header className="maintenance-header">
                    <div>
                        <h2>Maintenance</h2>
                        <p>Manage and track scheduled service records.</p>
                    </div>

                    <button type="button" className="add-maintenance-btn">
                        <Plus size={16} />
                        <span>Add Task</span>
                    </button>
                </header>

                {/* KPI Overview */}
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

                {/* Main Content Area */}
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

                    {/* Data Table */}
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
                                                    {item.status.replace("_", " ")}
                                                </span>
                                            </td>
                                            <td className="text-right">
                                                <button 
                                                    type="button"
                                                    className="view-btn" 
                                                    onClick={() => setSelectedRecord(item)}
                                                    title="View Details"
                                                >
                                                    <Eye size={15} />
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

                {/* Inspection Modal */}
                {selectedRecord && (
                    <DetailModal 
                        record={selectedRecord} 
                        onClose={() => setSelectedRecord(null)} 
                    />
                )}

            </div>
        </MainLayout>
    );
}

// Reusable Stat Card
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

// Reusable Detail Modal
function DetailModal({ record, onClose }) {
    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Maintenance Record #{record.id}</h3>
                    <button type="button" className="close-btn" onClick={onClose}>
                        <X size={18} />
                    </button>
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
                                    {record.status.replace("_", " ")}
                                </span>
                            </p>
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