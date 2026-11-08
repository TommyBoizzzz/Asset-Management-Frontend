import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Download,
  SlidersHorizontal,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import AssetService from "../../asset/services/AssetService";
import AssetAssignmentService from "../../assign_asset/services/Assetassignmentservice";
import MaintenanceService from "../../matainance/services/MaintenanceService";
import { getStatusAfterInspection } from "../../../utils/assetLifecycle";

import "./history.css";


const parseEventDate = (value) => {
  if (!value) return null;
  const date = new Date(
    /^\d{4}-\d{2}-\d{2}$/.test(String(value))
      ? `${value}T00:00:00`
      : value
  );
  return Number.isNaN(date.getTime()) ? null : date;
};

const createHistoryEvent = (dateValue, asset, action, oldStatus, newStatus, description, id) => {
  const date = parseEventDate(dateValue);
  if (!date) return null;

  return {
    id,
    timestamp: date.getTime(),
    date: String(date.getDate()).padStart(2, "0"),
    month: date.toLocaleString("en", { month: "short" }).toUpperCase(),
    year: String(date.getFullYear()),
    code: asset?.assetCode || asset?.assetTag || `AST-${asset?.id || "UNKNOWN"}`,
    name: asset?.name || "Unknown asset",
    action,
    oldStatus,
    newStatus,
    description,
  };
};

function buildHistoryData(assets, assignments, maintenanceRecords) {
  const events = [];

  assets.forEach((asset) => {
    const event = createHistoryEvent(
      asset.createdAt,
      asset,
      "ASSET REGISTERED",
      "—",
      "Registered",
      "Asset added to the inventory.",
      `asset-created-${asset.id}`
    );
    if (event) events.push(event);
  });

  assignments.forEach((assignment) => {
    const asset = assignment.asset || {};
    const assigned = createHistoryEvent(
      assignment.assignedAt || assignment.assignmentDate || assignment.assignedDate || assignment.createdAt,
      asset,
      "ASSET ASSIGNED",
      "Available",
      "Assigned",
      `Assigned to ${assignment.staff?.fullName || assignment.staff?.name || "staff"}.`,
      `assignment-${assignment.id}`
    );
    if (assigned) events.push(assigned);

    const returned = createHistoryEvent(
      assignment.returnedAt || assignment.returnDate || assignment.returnedDate,
      asset,
      "ASSET RETURNED",
      "Assigned",
      getStatusAfterInspection(assignment.conditionAfter),
      `Returned by ${assignment.staff?.fullName || assignment.staff?.name || "staff"}.`,
      `return-${assignment.id}`
    );
    if (returned) events.push(returned);
  });

  maintenanceRecords.forEach((record) => {
    const asset = record.asset || {};
    const status = String(record.status || "").toUpperCase();
    const scheduled = createHistoryEvent(
      record.scheduledDate,
      asset,
      "MAINTENANCE SCHEDULED",
      "—",
      "Scheduled",
      record.problemDescription || "Maintenance scheduled.",
      `maintenance-scheduled-${record.id}`
    );
    if (scheduled) events.push(scheduled);

    if (status === "IN_PROGRESS") {
      const started = createHistoryEvent(
        record.startedAt || record.updatedAt,
        asset,
        "MAINTENANCE STARTED",
        "—",
        "Under Maintenance",
        record.problemDescription || "Maintenance started.",
        `maintenance-started-${record.id}`
      );
      if (started) events.push(started);
    } else if (status === "COMPLETED") {
      const completed = createHistoryEvent(
        record.completedDate,
        asset,
        "MAINTENANCE COMPLETED",
        "Under Maintenance",
        getStatusAfterInspection(
          record.completionCondition || record.conditionAfter || asset.condition
        ),
        record.actionTaken || "Maintenance completed.",
        `maintenance-completed-${record.id}`
      );
      if (completed) events.push(completed);
    } else if (status === "CANCELLED") {
      const cancelled = createHistoryEvent(
        record.updatedAt,
        asset,
        "MAINTENANCE CANCELLED",
        "—",
        "Cancelled",
        "Scheduled maintenance was cancelled.",
        `maintenance-cancelled-${record.id}`
      );
      if (cancelled) events.push(cancelled);
    }
  });

  return events.sort((left, right) => right.timestamp - left.timestamp);
}


/* =========================================================
   COMPONENT
========================================================= */

function History() {
  const [allHistoryData, setAllHistoryData] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState("");

  useEffect(() => {
    let active = true;
    let isLoading = false;

    const loadHistory = async (background = false) => {
      if (isLoading) return;
      isLoading = true;

      try {
        const [assetResponse, assignmentResponse, maintenanceResponse] =
          await Promise.all([
            AssetService.getAll(),
            AssetAssignmentService.getAll(),
            MaintenanceService.getAll(),
          ]);

        if (
          !Array.isArray(assetResponse.data) ||
          !Array.isArray(assignmentResponse.data) ||
          !Array.isArray(maintenanceResponse.data)
        ) {
          throw new Error("The server returned invalid history data.");
        }

        if (active) {
          setAllHistoryData(
            buildHistoryData(
              assetResponse.data,
              assignmentResponse.data,
              maintenanceResponse.data
            )
          );
          setHistoryError("");
        }
      } catch (error) {
        console.error("Failed to load asset history:", error);
        if (active && !background) {
          setHistoryError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load asset history."
          );
        }
      } finally {
        if (active && !background) setHistoryLoading(false);
        isLoading = false;
      }
    };

    loadHistory();
    const intervalId = window.setInterval(
      () => {
        if (document.visibilityState === "visible") {
          loadHistory(true);
        }
      },
      60_000
    );
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, []);

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 4;

  /* =======================================================
     SEARCH
  ======================================================= */

  const [search, setSearch] =
    useState("");


  /* =======================================================
     FILTER
  ======================================================= */

  const [actionFilter, setActionFilter] =
    useState("All Actions");

  const [timeFilter, setTimeFilter] =
    useState("All Time");


  const [showActionMenu, setShowActionMenu] =
    useState(false);

  const [showTimeMenu, setShowTimeMenu] =
    useState(false);

  const [showFilterPanel, setShowFilterPanel] =
    useState(false);

  const [showExportMenu, setShowExportMenu] =
    useState(false);


  /* =======================================================
     SEARCH + ACTION FILTER
  ======================================================= */

  const filteredData = useMemo(() => {

    const query =
      search
        .trim()
        .toLowerCase();


    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - ((today.getDay() + 6) % 7));
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startDates = {
      "All Time": null,
      Today: today,
      "This Week": startOfWeek,
      "This Month": startOfMonth,
      "This Year": startOfYear,
    };
    const fromDate = startDates[timeFilter];

    return allHistoryData.filter((item) => {

      const matchesSearch =
        !query ||
        item.code
          .toLowerCase()
          .includes(query) ||
        item.name
          .toLowerCase()
          .includes(query) ||
        item.action
          .toLowerCase()
          .includes(query) ||
        item.description
          .toLowerCase()
          .includes(query);


      const matchesAction =
        actionFilter === "All Actions" ||
        item.action === actionFilter;

      const matchesTime =
        !fromDate || item.timestamp >= fromDate.getTime();

      return (
        matchesSearch &&
        matchesAction &&
        matchesTime
      );

    });

  }, [
    search,
    actionFilter,
    timeFilter,
    allHistoryData,
  ]);

  const actionOptions = useMemo(
    () => ["All Actions", ...new Set(allHistoryData.map((item) => item.action))],
    [allHistoryData]
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / recordsPerPage));


  /* =======================================================
     CURRENT PAGE DATA
  ======================================================= */

  const startIndex =
    (currentPage - 1) *
    recordsPerPage;


  const currentRecords =
    filteredData.slice(
      startIndex,
      startIndex + recordsPerPage
    );


  /* =======================================================
     PAGE FUNCTION
  ======================================================= */

  const goToPage = (page) => {

    if (page < 1) {
      return;
    }

    if (page > totalPages) {
      return;
    }

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

  };


  /* =======================================================
     SEARCH HANDLER
  ======================================================= */

  const handleSearch = (value) => {

    setSearch(value);

    setCurrentPage(1);

  };


  /* =======================================================
     ACTION FILTER
  ======================================================= */

  const handleActionFilter = (value) => {

    setActionFilter(value);

    setCurrentPage(1);

    setShowActionMenu(false);

  };


  /* =======================================================
     TIME FILTER
  ======================================================= */

  const handleTimeFilter = (value) => {

    setTimeFilter(value);

    setCurrentPage(1);

    setShowTimeMenu(false);

  };


  /* =======================================================
     RESET FILTER
  ======================================================= */

  const resetFilters = () => {

    setSearch("");

    setActionFilter("All Actions");

    setTimeFilter("All Time");

    setCurrentPage(1);

  };


  /* =======================================================
     EXPORT CSV
  ======================================================= */

  const exportHistory = () => {

    const headers = [
      "Date",
      "Asset Code",
      "Asset Name",
      "Action",
      "Old Status",
      "New Status",
      "Description",
    ];


    const rows =
      filteredData.map((item) => [
        `${item.date} ${item.month} ${item.year}`,
        item.code,
        item.name,
        item.action,
        item.oldStatus,
        item.newStatus,
        item.description,
      ]);


    const csv = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replaceAll(
              '"',
              '""'
            )}"`
          )
          .join(",")
      )
      .join("\n");


    const blob = new Blob(
      [csv],
      {
        type:
          "text/csv;charset=utf-8;",
      }
    );


    const url =
      URL.createObjectURL(blob);


    const link =
      document.createElement("a");


    link.href = url;

    link.download =
      "BAMS-Asset-History.csv";


    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setShowExportMenu(false);

  };


  /* =======================================================
     STATUS CLASS
  ======================================================= */

  const statusClass = (status) => {

    if (status === "Available" || status === "AVAILABLE" || status === "Registered") {
      return "status-pill status-available";
    }

    if (status === "Under Maintenance" || status === "MAINTENANCE") {
      return "status-pill status-maintenance";
    }

    if (status === "Assigned") return "status-pill status-assigned";
    if (status === "Damaged" || status === "Retired") return "status-pill status-damaged";

    return "status-pill status-condition";

  };


  /* =======================================================
     RENDER
  ======================================================= */

  return (

    <MainLayout
      activePage="History"
      title="History"
    >

      <div className="history-page">


        {/* =================================================
            PAGE HEADER
        ================================================= */}

        <div className="history-page-header">

          <div>

            <h1>
              Asset History
            </h1>

            <p>
              Recorded activity from asset, assignment, and maintenance records.
              Exact change history requires backend audit events.
            </p>

          </div>

          {historyError && (
            <div className="history-error" role="alert">
              {historyError}
            </div>
          )}


          <div className="history-top-actions">


            {/* EXPORT */}

            <div className="history-menu-wrapper">

              <button
                className="history-outline-btn"
                onClick={() =>
                  setShowExportMenu(
                    !showExportMenu
                  )
                }
              >

                <Download size={16} />

                Export History

              </button>


              {showExportMenu && (

                <div className="history-export-menu">

                  <div className="history-menu-title">
                    Export History
                  </div>

                  <div className="history-menu-text">
                    Export all filtered history
                    records as CSV.
                  </div>

                  <button
                    className="history-export-btn"
                    onClick={
                      exportHistory
                    }
                  >

                    <Download size={14} />

                    Export CSV

                  </button>

                </div>

              )}

            </div>


            {/* FILTER */}

            <button
              className="history-outline-btn"
              onClick={() =>
                setShowFilterPanel(
                  !showFilterPanel
                )
              }
            >

              <SlidersHorizontal
                size={16}
              />

              Filter

            </button>

          </div>

        </div>



        {/* =================================================
            FILTER PANEL
        ================================================= */}

        {showFilterPanel && (

          <div className="history-filter-panel">

            <div>

              <strong>
                History Filters
              </strong>

              <span>
                Search and filter asset activity.
              </span>

            </div>


            <button
              onClick={resetFilters}
              className="history-reset-btn"
            >
              Reset
            </button>


            <button
              className="history-close-btn"
              onClick={() =>
                setShowFilterPanel(false)
              }
            >
              <X size={16} />
            </button>

          </div>

        )}



        {/* =================================================
            HISTORY CARD
        ================================================= */}

        <div className="history-card">


          {/* =================================================
              SEARCH BAR
          ================================================= */}

          <div className="history-toolbar">


            <div className="history-search-box">

              <Search size={18} />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  handleSearch(
                    e.target.value
                  )
                }
                placeholder="Search assets, descriptions, or users..."
              />

            </div>



            {/* ALL ACTIONS */}

            <div className="history-menu-wrapper">

              <button
                className="history-filter-select"
                onClick={() => {

                  setShowActionMenu(
                    !showActionMenu
                  );

                  setShowTimeMenu(false);

                }}
              >

                <span>
                  {actionFilter}
                </span>

                <ChevronDown
                  size={17}
                />

              </button>


              {showActionMenu && (

                <div className="history-dropdown">

                  {actionOptions.map((item) => (

                    <button
                      key={item}
                      className={
                        actionFilter === item
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        handleActionFilter(
                          item
                        )
                      }
                    >

                      {item}

                    </button>

                  ))}

                </div>

              )}

            </div>



            {/* ALL TIME */}

            <div className="history-menu-wrapper">

              <button
                className="history-filter-select time"
                onClick={() => {

                  setShowTimeMenu(
                    !showTimeMenu
                  );

                  setShowActionMenu(false);

                }}
              >

                <div className="history-time-label">

                  <CalendarDays
                    size={16}
                  />

                  <span>
                    {timeFilter}
                  </span>

                </div>

                <ChevronDown
                  size={17}
                />

              </button>


              {showTimeMenu && (

                <div className="history-dropdown">

                  {[
                    "All Time",
                    "Today",
                    "This Week",
                    "This Month",
                    "This Year",
                  ].map((item) => (

                    <button
                      key={item}
                      className={
                        timeFilter === item
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        handleTimeFilter(
                          item
                        )
                      }
                    >

                      {item}

                    </button>

                  ))}

                </div>

              )}

            </div>

          </div>



          {/* =================================================
              TABLE
          ================================================= */}

          <div className="history-table-wrapper">

            <table className="history-table">

              <thead>

                <tr>

                  <th className="date-column">
                    <span className="history-header-label">
                      DATE
                    </span>
                  </th>

                  <th className="code-column">
                    <span className="history-header-label">
                      ASSET
                      <br />
                      CODE
                    </span>
                  </th>

                  <th className="name-column">
                    <span className="history-header-label">
                      ASSET NAME
                    </span>
                  </th>

                  <th className="action-column">
                    <span className="history-header-label">
                      ACTION
                    </span>
                  </th>

                  <th className="status-column">
                    <span className="history-header-label">
                      STATUS CHANGE
                    </span>
                  </th>

                  <th className="description-column">
                    <span className="history-header-label">
                      DESCRIPTION
                    </span>
                  </th>

                </tr>

              </thead>


              <tbody>

                {currentRecords.length > 0 ? (

                  currentRecords.map(
                    (item, index) => (

                      <tr
                        key={`${item.code}-${index}`}
                      >

                        {/* DATE */}

                        <td>

                          <div className="history-date">

                            <span className="history-day">
                              {item.date}
                            </span>

                            <span className="history-month">
                              {item.month}
                            </span>

                            <span className="history-year">
                              {item.year}
                            </span>

                          </div>

                        </td>


                        {/* CODE */}

                        <td>

                          <span className="history-code">
                            {item.code}
                          </span>

                        </td>


                        {/* NAME */}

                        <td>

                          <div className="history-asset-name">
                            {item.name}
                          </div>

                        </td>


                        {/* ACTION */}

                        <td>

                          <span
                            className={`action-pill ${
                              item.action.includes("COMPLETED")
                                ? "action-completed"
                                : "action-updated"
                            }`}
                          >
                            {item.action}
                          </span>

                        </td>


                        {/* STATUS */}

                        <td>

                          <div className="status-change">

                            {item.newStatus === "Registered" ? (
                              <span
                                className={statusClass(item.newStatus)}
                              >
                                {item.newStatus}
                              </span>
                            ) : (
                              <>
                                <span
                                  className={statusClass(item.oldStatus)}
                                >
                                  {item.oldStatus}
                                </span>

                                <span className="status-arrow">
                                  →
                                </span>

                                <span
                                  className={statusClass(item.newStatus)}
                                >
                                  {item.newStatus}
                                </span>
                              </>
                            )}

                          </div>

                        </td>


                        {/* DESCRIPTION */}

                        <td>

                          <div className="history-description">
                            {item.description}
                          </div>

                        </td>

                      </tr>

                    )
                  )

                ) : (

                  <tr>

                    <td
                      colSpan="6"
                      className="history-empty"
                    >

                      {historyLoading
                        ? "Loading asset history..."
                        : historyError
                          ? "History could not be loaded."
                          : "No recorded asset activity found."}

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>



          {/* =================================================
              TABLE FOOTER
          ================================================= */}

          <div className="history-table-footer">


            <span className="history-record-count">

              Showing{" "}

              {filteredData.length === 0
                ? 0
                : startIndex + 1}

              –

              {Math.min(
                startIndex +
                  recordsPerPage,
                filteredData.length
              )}

              {" "}of{" "}

              {filteredData.length}

              {" "}records

            </span>



            {/* PAGINATION */}

            <div className="history-pagination">


              {/* PREVIOUS */}

              <button
                className={`pagination-arrow ${
                  currentPage === 1
                    ? "disabled"
                    : ""
                }`}
                disabled={
                  currentPage === 1
                }
                onClick={() =>
                  goToPage(
                    currentPage - 1
                  )
                }
              >

                <ChevronLeft
                  size={20}
                />

              </button>


              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-page ${currentPage === page ? "active" : ""}`}
                  onClick={() => goToPage(page)}
                >
                  {page}
                </button>
              ))}


              {/* NEXT */}

              <button
                className={`pagination-arrow ${
                  currentPage === totalPages
                    ? "disabled"
                    : ""
                }`}
                disabled={
                  currentPage === totalPages
                }
                onClick={() =>
                  goToPage(
                    currentPage + 1
                  )
                }
              >

                <ChevronRight
                  size={20}
                />

              </button>

            </div>

          </div>

        </div>

      </div>

    </MainLayout>
  );
}


export default History;