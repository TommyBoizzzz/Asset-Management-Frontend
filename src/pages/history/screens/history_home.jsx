import { useMemo, useState } from "react";
import {
  Search,
  Download,
  SlidersHorizontal,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Bell,
  CircleHelp,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";

import "./history.css";


/* =========================================================
   DEMO HISTORY DATA
========================================================= */

const historyData = [
  {
    date: "05",
    month: "AUG",
    year: "2026",
    code: "AST-005",
    name: 'MacBook Pro 14" M3',
    action: "MAINTENANCE",
    oldStatus: "AVAILABLE",
    newStatus: "MAINTENANCE",
    description: "Sent to corrective maintenance.",
  },
  {
    date: "04",
    month: "AUG",
    year: "2026",
    code: "AST-009",
    name: "Honda EP6500CX Generator",
    action: "MAINTENANCE",
    oldStatus: "AVAILABLE",
    newStatus: "MAINTENANCE",
    description: "Emergency corrective maintenance.",
  },
  {
    date: "20",
    month: "JUL",
    year: "2026",
    code: "AST-004",
    name: "Epson EB-E01 Projector",
    action: "UPDATED",
    oldStatus: "Condition: Good",
    newStatus: "Fair",
    description: "Condition updated after inspection.",
  },
  {
    date: "16",
    month: "JUL",
    year: "2026",
    code: "AST-006",
    name: "Cisco SG350-28 Switch",
    action: "MAINTENANCE COMPLETED",
    oldStatus: "MAINTENANCE",
    newStatus: "AVAILABLE",
    description: "Firmware update completed successfully.",
  },
];


/* =========================================================
   CREATE MORE RECORDS
   40 RECORDS = 10 PAGES
========================================================= */

const extraAssets = [
  "Dell XPS 15",
  "HP LaserJet Enterprise",
  "Epson EB-X06 Projector",
  "Canon EOS Camera",
  "TP-Link Network Router",
  "Lenovo ThinkPad X1",
  "Samsung Monitor 27",
  "Cisco Switch 24 Port",
  "MacBook Air M2",
  "Dell Latitude 5420",
  "HP Office Printer",
  "Ubiquiti Access Point",
  "Acer Aspire 5",
  "LG UltraWide Monitor",
  "Brother Printer",
  "Netgear Switch",
  "Microsoft Surface Laptop",
  "Sony Projector",
  "Dell Monitor 24",
  "Cisco Firewall",
  "HP ProBook 450",
  "Epson L3250 Printer",
  "Huawei Router",
  "Canon Scanner",
  "Mac Mini M2",
  "Lenovo Monitor",
  "Zebra Label Printer",
  "Aruba Network Switch",
  "Dell Precision 5570",
  "BenQ Projector",
  "HP Desktop Pro",
  "TP-Link Switch",
  "MacBook Pro M1",
  "Dell PowerEdge Server",
  "Epson Projector",
  "Cisco SG350 Switch",
];


const extraRecords = extraAssets.map((name, index) => {

  const actions = [
    "MAINTENANCE",
    "UPDATED",
    "MAINTENANCE COMPLETED",
  ];

  const action =
    actions[index % actions.length];

  let oldStatus = "AVAILABLE";
  let newStatus = "MAINTENANCE";

  if (action === "UPDATED") {
    oldStatus = "Condition: Good";
    newStatus = "Fair";
  }

  if (action === "MAINTENANCE COMPLETED") {
    oldStatus = "MAINTENANCE";
    newStatus = "AVAILABLE";
  }

  return {
    date: String(
      ((index * 2) % 27) + 1
    ).padStart(2, "0"),

    month:
      index % 2 === 0
        ? "JUL"
        : "JUN",

    year: "2026",

    code:
      `AST-${String(index + 10).padStart(3, "0")}`,

    name,

    action,

    oldStatus,

    newStatus,

    description:
      action === "UPDATED"
        ? "Asset condition updated after inspection."
        : action === "MAINTENANCE COMPLETED"
          ? "Maintenance completed successfully."
          : "Asset sent to corrective maintenance.",
  };
});


const allHistoryData = [
  ...historyData,
  ...extraRecords,
];


/* =========================================================
   COMPONENT
========================================================= */

function History() {

  /* =======================================================
     PAGINATION
  ======================================================= */

  const [currentPage, setCurrentPage] =
    useState(1);

  const recordsPerPage = 4;

  const totalPages = 10;


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


      return (
        matchesSearch &&
        matchesAction
      );

    });

  }, [
    search,
    actionFilter,
  ]);


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

    if (
      status === "AVAILABLE"
    ) {
      return "status-pill status-available";
    }

    if (
      status === "MAINTENANCE"
    ) {
      return "status-pill status-maintenance";
    }

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
              Track every change, assignment,
              maintenance activity, and status
              update across company assets.
            </p>

          </div>


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

                  {[
                    "All Actions",
                    "MAINTENANCE",
                    "UPDATED",
                    "MAINTENANCE COMPLETED",
                  ].map((item) => (

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
                    DATE
                  </th>

                  <th className="code-column">
                    ASSET
                    <br />
                    CODE
                  </th>

                  <th className="name-column">
                    ASSET NAME
                  </th>

                  <th className="action-column">
                    ACTION
                  </th>

                  <th className="status-column">
                    STATUS CHANGE
                  </th>

                  <th className="description-column">
                    DESCRIPTION
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

                          {item.action ===
                            "MAINTENANCE" && (

                              <span className="action-maintenance">
                                MAINTENANCE
                              </span>

                            )}


                          {item.action ===
                            "UPDATED" && (

                              <span className="action-pill action-updated">
                                UPDATED
                              </span>

                            )}


                          {item.action ===
                            "MAINTENANCE COMPLETED" && (

                              <span className="action-pill action-completed">
                                MAINTENANCE
                                <br />
                                COMPLETED
                              </span>

                            )}

                        </td>


                        {/* STATUS */}

                        <td>

                          <div className="status-change">

                            <span
                              className={statusClass(
                                item.oldStatus
                              )}
                            >
                              {item.oldStatus}
                            </span>


                            <span className="status-arrow">
                              →
                            </span>


                            <span
                              className={statusClass(
                                item.newStatus
                              )}
                            >
                              {item.newStatus}
                            </span>

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

                      No history records found.

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


              {/* PAGE 1 */}

              <button
                className={`pagination-page ${
                  currentPage === 1
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToPage(1)
                }
              >
                1
              </button>


              {/* PAGE 2 */}

              <button
                className={`pagination-page ${
                  currentPage === 2
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToPage(2)
                }
              >
                2
              </button>


              {/* PAGE 3 */}

              <button
                className={`pagination-page ${
                  currentPage === 3
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToPage(3)
                }
              >
                3
              </button>


              <span className="pagination-dots">
                ...
              </span>


              {/* PAGE 10 */}

              <button
                className={`pagination-page ${
                  currentPage === 10
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  goToPage(10)
                }
              >
                10
              </button>


              {/* NEXT */}

              <button
                className={`pagination-arrow ${
                  currentPage === 10
                    ? "disabled"
                    : ""
                }`}
                disabled={
                  currentPage === 10
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