
/* =========================================================
   USER MANAGEMENT PAGE
========================================================= */

.user-management-page {
    width: 100%;
    min-height: 100%;
    padding: 4px 0 40px;
    color: #172033;
    box-sizing: border-box;
}

/* =========================================================
   PAGE HEADER
========================================================= */

.user-management-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 26px;
}

.page-title-row {
    display: flex;
    align-items: center;
    gap: 14px;
    min-width: 0;
}

.page-title-icon {
    width: 46px;
    height: 46px;
    flex-shrink: 0;
    border-radius: 13px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef4ff;
    color: #356ae6;
}

.user-management-header h2 {
    margin: 0;
    color: #151a24;
    font-size: 25px;
    font-weight: 750;
    letter-spacing: -0.4px;
}

.user-management-header p {
    margin: 5px 0 0;
    color: #7a8497;
    font-size: 14px;
}

/* =========================================================
   BUTTONS
========================================================= */

.primary-button,
.secondary-button {
    min-height: 42px;
    padding: 0 16px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    border-radius: 9px;
    font-family: inherit;
    font-size: 13px;
    font-weight: 650;
    cursor: pointer;
    transition: all 0.18s ease;
}

.primary-button {
    border: 0;
    color: #fff;
    background: #356ae6;
    box-shadow: 0 5px 14px rgba(53, 106, 230, 0.18);
}

.primary-button:hover {
    background: #285bd3;
    transform: translateY(-1px);
    box-shadow: 0 7px 18px rgba(53, 106, 230, 0.25);
}

.secondary-button {
    color: #344054;
    background: #fff;
    border: 1px solid #e1e6ef;
}

.secondary-button:hover {
    background: #f8faff;
    border-color: #ccd5e5;
}

/* =========================================================
   TABS
========================================================= */

.user-tabs {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-bottom: 20px;
}

.user-tab {
    min-width: 0;
    min-height: 76px;
    padding: 14px 17px;
    display: flex;
    align-items: center;
    gap: 13px;
    text-align: left;
    border: 1px solid #e3e8f0;
    border-radius: 12px;
    background: #fff;
    cursor: pointer;
    transition: all 0.18s ease;
}

.user-tab:hover {
    border-color: #cbd6ea;
    transform: translateY(-1px);
}

.user-tab.active {
    border-color: #356ae6;
    background: #f8faff;
    box-shadow: 0 5px 16px rgba(40, 75, 140, 0.07);
}

.tab-icon {
    width: 40px;
    height: 40px;
    flex-shrink: 0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f1f4f9;
    color: #6e788a;
}

.user-tab.active .tab-icon {
    background: #e7efff;
    color: #356ae6;
}

.tab-content {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.tab-content strong {
    color: #1a2230;
    font-size: 14px;
}

.tab-content small {
    color: #8992a3;
    font-size: 12px;
}

/* =========================================================
   MAIN MANAGEMENT CARD
========================================================= */

.management-card {
    width: 100%;
    min-width: 0;
    overflow: hidden;
    background: #fff;
    border: 1px solid #e4e8ef;
    border-radius: 14px;
    box-shadow: 0 4px 16px rgba(31, 45, 68, 0.035);
}

/* =========================================================
   LIST HEADER
========================================================= */

.list-header {
    min-height: 80px;
    padding: 19px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border-bottom: 1px solid #edf0f5;
}

.list-header h3 {
    margin: 0;
    color: #18202d;
    font-size: 17px;
}

.list-header p {
    margin: 5px 0 0;
    color: #8992a2;
    font-size: 13px;
}

/* =========================================================
   SEARCH TOOLBAR
========================================================= */

.list-toolbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 15px 22px;
    background: #fafbfd;
    border-bottom: 1px solid #edf0f5;
}

.search-box {
    width: min(360px, 100%);
    min-width: 0;
    height: 40px;
    padding: 0 12px;
    display: flex;
    align-items: center;
    gap: 9px;
    box-sizing: border-box;
    border: 1px solid #dfe4ec;
    border-radius: 8px;
    background: #fff;
    color: #98a1b1;
    transition: all 0.15s ease;
}

.search-box:focus-within {
    border-color: #356ae6;
    box-shadow: 0 0 0 3px rgba(53, 106, 230, 0.08);
}

.search-box input {
    width: 100%;
    min-width: 0;
    border: 0;
    outline: 0;
    background: transparent;
    color: #242b38;
    font-family: inherit;
    font-size: 13px;
}

.search-box input::placeholder {
    color: #a1a9b7;
}

.result-count {
    flex-shrink: 0;
    color: #7d8798;
    font-size: 12px;
    font-weight: 600;
}

/* =========================================================
   USERS TABLE
========================================================= */

.users-table-wrapper {
    width: 100%;
    overflow-x: auto;
    overflow-y: hidden;
    -webkit-overflow-scrolling: touch;
}

.users-table {
    width: 100%;
    min-width: 900px;
    border-collapse: collapse;
}

.users-table th {
    height: 45px;
    padding: 0 20px;
    background: #fafbfd;
    color: #8a94a5;
    font-size: 11px;
    font-weight: 700;
    text-align: left;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    border-bottom: 1px solid #edf0f5;
}

.users-table td {
    padding: 14px 20px;
    color: #424b5b;
    font-size: 13px;
    border-bottom: 1px solid #f0f2f6;
    white-space: nowrap;
}

.users-table tbody tr {
    transition: background 0.15s ease;
}

.users-table tbody tr:hover {
    background: #fafcff;
}

.users-table tbody tr:last-child td {
    border-bottom: 0;
}

/* =========================================================
   USER CELL - FIXED HORIZONTAL LAYOUT
========================================================= */

/* Avatar and user information ALWAYS stay in one row */

.user-cell {
    display: flex !important;
    flex-direction: row !important;
    flex-wrap: nowrap !important;
    align-items: center !important;
    gap: 11px;

    width: 100%;
    min-width: 180px;
    white-space: nowrap;
}

/* Avatar never shrinks or moves */

.user-avatar {
    width: 39px;
    height: 39px;
    min-width: 39px;
    max-width: 39px;

    flex: 0 0 39px;

    border-radius: 50%;

    display: flex;
    align-items: center;
    justify-content: center;

    background: #e9efff;
    color: #356ae6;

    font-size: 12px;
    font-weight: 750;
}

/* User name and email stay beside avatar */

.user-cell > div:last-child {
    display: flex;
    flex-direction: column;
    justify-content: center;

    gap: 3px;

    min-width: 0;
    width: 100%;
    flex: 1 1 auto;

    overflow: hidden;
}

/* Prevent long names from breaking the row */

.user-cell strong,
.user-cell span {
    display: block;

    width: 100%;
    max-width: 100%;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.user-cell strong {
    color: #202735;
    font-size: 13px;
    line-height: 1.4;
}

.user-cell span {
    color: #929baa;
    font-size: 11px;
    line-height: 1.4;
}

.username-text {
    color: #687386;
    font-family: monospace;
    font-size: 12px;
}

.phone-text {
    color: #737d8e;
    font-size: 12px;
}

/* =========================================================
   ROLE BADGE
========================================================= */

.role-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 6px 9px;
    border-radius: 7px;
    background: #f3f5f9;
    color: #536075;
    font-size: 11px;
    font-weight: 650;
    white-space: nowrap;
}

/* =========================================================
   STATUS
========================================================= */

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 9px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 650;
    white-space: nowrap;
}

.status-badge.active {
    background: #ecf9f1;
    color: #23834d;
}

.status-badge.inactive {
    background: #f2f3f5;
    color: #7c8491;
}

.status-dot {
    width: 6px;
    height: 6px;
    flex-shrink: 0;
    border-radius: 50%;
    background: currentColor;
}

/* =========================================================
   TABLE ACTIONS
========================================================= */

.action-column {
    text-align: right !important;
}

.row-actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 6px;
}

.icon-action {
    width: 32px;
    height: 32px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #e4e8ef;
    border-radius: 7px;
    background: #fff;
    cursor: pointer;
    transition: all 0.15s ease;
}

.icon-action.edit {
    color: #356ae6;
}

.icon-action.edit:hover {
    background: #edf3ff;
    border-color: #cddcff;
}

.icon-action.delete {
    color: #e04c4c;
}

.icon-action.delete:hover {
    background: #fff1f1;
    border-color: #ffd2d2;
}

.icon-action.more {
    color: #7d8797;
}

.icon-action.more:hover {
    background: #f4f6f9;
}

/* =========================================================
   ROLE LIST
========================================================= */

.role-list {
    display: flex;
    flex-direction: column;
}

.role-card {
    padding: 20px 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 20px;
    border-bottom: 1px solid #edf0f5;
    transition: background 0.15s ease;
}

.role-card:hover {
    background: #fcfdff;
}

.role-card:last-child {
    border-bottom: 0;
}

.role-card-main {
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: 14px;
}

.role-card-icon {
    width: 43px;
    height: 43px;
    flex-shrink: 0;
    border-radius: 11px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #eef3ff;
    color: #356ae6;
}

.role-card-info {
    min-width: 0;
}

.role-name-row {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 9px;
}

.role-name-row h4 {
    margin: 0;
    color: #202735;
    font-size: 15px;
}

.permission-count {
    padding: 4px 7px;
    border-radius: 6px;
    background: #f1f3f7;
    color: #7b8596;
    font-size: 10px;
    font-weight: 650;
}

.role-card-info > p {
    margin: 5px 0 11px;
    color: #8992a2;
    font-size: 12px;
}

.permission-preview {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.permission-preview span {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 5px 7px;
    border-radius: 6px;
    background: #f7f8fa;
    color: #667084;
    font-size: 10px;
}

.permission-preview span svg {
    color: #39a86a;
}

.permission-preview .more-permissions {
    background: #edf3ff;
    color: #356ae6;
    font-weight: 650;
}

/* =========================================================
   ROLE ACTIONS
========================================================= */

.role-actions {
    display: flex;
    align-items: center;
    gap: 7px;
    flex-shrink: 0;
}

.secondary-icon-button,
.danger-icon-button {
    min-height: 35px;
    padding: 0 11px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border-radius: 7px;
    cursor: pointer;
    font-family: inherit;
    font-size: 11px;
    font-weight: 650;
    transition: all 0.15s ease;
}

.secondary-icon-button {
    color: #356ae6;
    background: #fff;
    border: 1px solid #dce3ef;
}

.secondary-icon-button:hover {
    background: #edf3ff;
    border-color: #cddcff;
}

.danger-icon-button {
    color: #df4e4e;
    background: #fff;
    border: 1px solid #f0d8d8;
}

.danger-icon-button:hover {
    background: #fff3f3;
    border-color: #efc5c5;
}

/* =========================================================
   EMPTY STATE
========================================================= */

.empty-state {
    min-height: 300px;
    padding: 40px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #a0a8b5;
    text-align: center;
}

.empty-state svg {
    margin-bottom: 12px;
}

.empty-state h4 {
    margin: 0 0 5px;
    color: #4a5363;
    font-size: 15px;
}

.empty-state p {
    margin: 0 0 17px;
    color: #929baa;
    font-size: 12px;
}

/* =========================================================
   DIALOG OVERLAY
========================================================= */

.dialog-overlay {
    position: fixed;
    inset: 0;
    z-index: 1000;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(18, 24, 35, 0.48);
    backdrop-filter: blur(3px);
    animation: dialogOverlayIn 0.18s ease;
    overflow-y: auto;
}

@keyframes dialogOverlayIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* =========================================================
   BASE DIALOG
========================================================= */

.dialog {
    width: 100%;
    max-width: 700px;
    max-height: calc(100dvh - 40px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 15px;
    background: #fff;
    box-shadow: 0 25px 70px rgba(17, 25, 39, 0.22),
                0 5px 20px rgba(17, 25, 39, 0.08);
    animation: dialogIn 0.2s ease;
}

@keyframes dialogIn {
    from {
        opacity: 0;
        transform: translateY(10px) scale(0.985);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

/* =========================================================
   DIALOG HEADER
========================================================= */

.dialog-header {
    min-height: 72px;
    flex-shrink: 0;
    padding: 15px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #edf0f5;
    background: #fff;
}

.dialog-title {
    display: flex;
    align-items: center;
    gap: 11px;
    min-width: 0;
}

.dialog-icon {
    width: 39px;
    height: 39px;
    flex-shrink: 0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #edf3ff;
    color: #356ae6;
}

.dialog-icon.role {
    background: #f1efff;
    color: #6b55cf;
}

.dialog-title h3 {
    margin: 0;
    color: #1d2532;
    font-size: 16px;
}

.dialog-title p {
    margin: 4px 0 0;
    color: #8b94a3;
    font-size: 11px;
}

.dialog-close {
    width: 34px;
    height: 34px;
    flex-shrink: 0;
    border: 0;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    color: #8992a1;
    cursor: pointer;
}

.dialog-close:hover {
    background: #f3f5f8;
    color: #3e4756;
}

/* =========================================================
   DIALOG FORM
========================================================= */

.dialog > form,
.role-dialog-form {
    min-height: 0;
    display: flex;
    flex-direction: column;
    flex: 1;
}

/* =========================================================
   DIALOG BODY
========================================================= */

.dialog-body {
    min-height: 0;
    flex: 1;
    padding: 20px;
    overflow-y: auto;
    overflow-x: hidden;
    scrollbar-width: thin;
    scrollbar-color: #cbd4e1 transparent;
    overscroll-behavior: contain;
}

.dialog-body::-webkit-scrollbar,
.role-dialog-body::-webkit-scrollbar {
    width: 6px;
}

.dialog-body::-webkit-scrollbar-thumb,
.role-dialog-body::-webkit-scrollbar-thumb {
    background: #cbd4e1;
    border-radius: 20px;
}

/* =========================================================
   DIALOG SECTION
========================================================= */

.dialog-section-title {
    margin-bottom: 13px;
    color: #333d4d;
    font-size: 12px;
    font-weight: 750;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

/* =========================================================
   FORM
========================================================= */

.form-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 15px;
}

.form-group {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.form-group label {
    color: #4e5868;
    font-size: 11px;
    font-weight: 650;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    box-sizing: border-box;
    border: 1px solid #dfe4ec;
    border-radius: 8px;
    outline: none;
    background: #fff;
    color: #252d3b;
    font-family: inherit;
    font-size: 12px;
    transition: all 0.15s ease;
}

.form-group input,
.form-group select {
    height: 40px;
    padding: 0 11px;
}

.form-group textarea {
    min-height: 80px;
    padding: 10px 11px;
    resize: vertical;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
    color: #a1a9b6;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    border-color: #356ae6;
    box-shadow: 0 0 0 3px rgba(53, 106, 230, 0.08);
}

.required {
    margin-left: 3px;
    color: #e04c4c;
}

.status-field {
    max-width: 50%;
    margin-top: 15px;
}

/* =========================================================
   ROLE DIALOG
========================================================= */

.role-dialog {
    width: min(800px, calc(100vw - 32px));
    max-width: 800px;
    max-height: calc(100dvh - 40px);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 16px;
    background: #fff;
    box-shadow: 0 24px 70px rgba(23, 32, 51, 0.18),
                0 8px 25px rgba(23, 32, 51, 0.08);
}

.role-dialog-body {
    min-height: 0;
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 22px 24px;
    scrollbar-width: thin;
    scrollbar-color: #cbd4e1 transparent;
    overscroll-behavior: contain;
}

/* =========================================================
   ROLE INFORMATION
========================================================= */

.role-form-top {
    display: grid;
    grid-template-columns: 0.85fr 1.15fr;
    gap: 15px;
    margin-bottom: 4px;
}

/* =========================================================
   PERMISSIONS HEADER
========================================================= */

.permissions-dialog-header {
    margin-top: 24px;
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 15px;
}

.permissions-dialog-header h4 {
    margin: 0;
    color: #27303e;
    font-size: 13px;
    font-weight: 700;
}

.permissions-dialog-header p {
    margin: 4px 0 0;
    color: #9098a6;
    font-size: 11px;
    line-height: 1.4;
}

/* =========================================================
   PERMISSION ACTIONS
========================================================= */

.permission-actions {
    display: flex;
    align-items: center;
    gap: 6px;
    flex-shrink: 0;
}

.permission-actions button {
    min-height: 30px;
    padding: 0 10px;
    border: 1px solid #dce3ed;
    border-radius: 6px;
    background: #fff;
    color: #506078;
    font-family: inherit;
    font-size: 10px;
    font-weight: 650;
    cursor: pointer;
}

.permission-actions button:hover {
    background: #f5f8fc;
    border-color: #cbd6e5;
    color: #2f5fca;
}

/* =========================================================
   PERMISSION LIST
========================================================= */

.permissions-dialog-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    padding-bottom: 4px;
}

.permission-dialog-group {
    min-width: 0;
    overflow: hidden;
    border: 1px solid #e6eaf0;
    border-radius: 9px;
    background: #fff;
    transition: all 0.18s ease;
}

.permission-dialog-group:hover {
    border-color: #d9e0ea;
    box-shadow: 0 3px 10px rgba(30, 41, 59, 0.04);
}

.permission-dialog-category {
    padding: 9px 11px;
    background: #f8f9fb;
    border-bottom: 1px solid #e8ebf0;
    color: #586476;
    font-size: 10px;
    font-weight: 750;
    text-transform: uppercase;
    letter-spacing: 0.025em;
}

.permission-dialog-items {
    padding: 6px;
}

.permission-checkbox {
    min-height: 34px;
    padding: 0 7px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-radius: 6px;
    cursor: pointer;
    color: #657084;
    font-size: 11px;
    line-height: 1.3;
    transition: all 0.16s ease;
}

.permission-checkbox:hover {
    background: #f7f9fc;
    color: #475569;
}

.permission-checkbox.checked {
    background: #f1f5ff;
    color: #2f5fca;
}

.permission-checkbox input {
    display: none;
}

.checkbox-ui {
    width: 16px;
    height: 16px;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #cfd6e1;
    border-radius: 4px;
    background: #fff;
    color: #fff;
    font-size: 10px;
    font-weight: 800;
    transition: all 0.16s ease;
}

.permission-checkbox:hover .checkbox-ui {
    border-color: #aebbd0;
}

.permission-checkbox.checked .checkbox-ui {
    border-color: #356ae6;
    background: #356ae6;
    box-shadow: 0 2px 5px rgba(53, 106, 230, 0.18);
}

/* =========================================================
   DIALOG FOOTER
========================================================= */

.dialog-footer {
    min-height: 68px;
    flex-shrink: 0;
    padding: 12px 20px;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 9px;
    border-top: 1px solid #edf0f5;
    background: #fcfdff;
}

.role-dialog .dialog-footer {
    padding: 14px 24px;
    background: #fff;
    border-top: 1px solid #e7ebf0;
}

.dialog-footer-actions {
    display: flex;
    align-items: center;
    gap: 9px;
}

.selected-permissions {
    margin-right: auto;
    color: #7f8998;
    font-size: 11px;
}

/* =========================================================
   DELETE DIALOG
========================================================= */

.delete-dialog {
    width: 100%;
    max-width: 390px;
    padding: 28px;
    align-items: center;
    text-align: center;
}

.delete-icon {
    width: 48px;
    height: 48px;
    margin-bottom: 13px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff0f0;
    color: #df4d4d;
}

.delete-dialog h3 {
    margin: 0;
    color: #252d3a;
    font-size: 17px;
}

.delete-dialog p {
    margin: 9px 0 22px;
    color: #858e9d;
    font-size: 12px;
    line-height: 1.6;
}

.delete-dialog p strong {
    color: #4c5565;
}

.delete-actions {
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 8px;
}

.delete-actions .secondary-button,
.delete-actions .delete-confirm-button {
    min-width: 105px;
}

.delete-confirm-button {
    min-height: 42px;
    padding: 0 15px;
    border: 0;
    border-radius: 9px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 7px;
    background: #df4d4d;
    color: #fff;
    font-family: inherit;
    font-size: 12px;
    font-weight: 650;
    cursor: pointer;
    transition: all 0.15s ease;
}

.delete-confirm-button:hover {
    background: #cc3f3f;
    transform: translateY(-1px);
}

/* =========================================================
   TABLET - 900px
========================================================= */

@media (max-width: 900px) {

    .user-management-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .user-management-header > .primary-button {
        width: 100%;
    }

    .role-card {
        align-items: flex-start;
        flex-direction: column;
        gap: 16px;
    }

    .role-actions {
        width: 100%;
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 10px;
        padding-top: 2px;
    }

    .role-actions button {
        width: 100%;
        min-height: 40px;
        justify-content: center;
        border-radius: 9px;
        font-size: 12px;
    }
}

/* =========================================================
   MOBILE - 700px
========================================================= */

@media (max-width: 700px) {

    .user-management-page {
        padding: 0 0 30px;
    }

    .user-tabs {
        grid-template-columns: 1fr;
    }

    .list-header {
        align-items: flex-start;
        flex-direction: column;
    }

    .list-header .secondary-button {
        width: 100%;
    }

    .list-toolbar {
        align-items: stretch;
        flex-direction: column;
        padding: 14px 16px;
    }

    .search-box {
        width: 100%;
    }

    .form-grid,
    .role-form-top,
    .permissions-dialog-list {
        grid-template-columns: 1fr;
    }

    .status-field {
        max-width: 100%;
    }

    .dialog-overlay {
        padding: 10px;
        align-items: center;
    }

    .dialog {
        max-height: calc(100dvh - 20px);
    }

    .dialog-header {
        padding: 14px 16px;
    }

    .dialog-body {
        padding: 18px 16px;
    }

    .dialog-footer {
        align-items: stretch;
        flex-direction: column;
    }

    .selected-permissions {
        margin-right: 0;
        text-align: center;
    }

    .dialog-footer-actions {
        width: 100%;
    }

    .dialog-footer-actions button {
        flex: 1;
    }

    .role-dialog {
        width: calc(100vw - 20px);
        max-height: calc(100dvh - 20px);
    }

    .role-dialog-body {
        padding: 18px 16px;
    }

    .permissions-dialog-header {
        align-items: flex-start;
        flex-direction: column;
        gap: 10px;
    }

    .permission-actions {
        width: 100%;
    }

    .permission-actions button {
        flex: 1;
    }

    .role-dialog .dialog-footer {
        padding: 12px 16px;
    }
}

/* =========================================================
   SMALL MOBILE - 420px
========================================================= */

@media (max-width: 420px) {

    .user-management-header h2 {
        font-size: 21px;
    }

    .page-title-icon {
        width: 40px;
        height: 40px;
        border-radius: 11px;
    }

    .user-management-header p {
        font-size: 12px;
    }

    .user-tab {
        min-height: 68px;
        padding: 12px;
    }

    .list-header {
        padding: 16px;
    }

    .users-table {
        min-width: 900px;
    }

    .users-table th,
    .users-table td {
        padding-left: 14px;
        padding-right: 14px;
    }

    /* Keep avatar and name horizontal even on small phones */

    .user-cell {
        display: flex !important;
        flex-direction: row !important;
        flex-wrap: nowrap !important;
        align-items: center !important;
        gap: 8px;
        min-width: 180px;
    }

    .user-avatar {
        width: 32px;
        height: 32px;
        min-width: 32px;
        max-width: 32px;
        flex: 0 0 32px;
        font-size: 10px;
    }

    .user-cell > div:last-child {
        min-width: 0;
        flex: 1 1 auto;
    }

    .user-cell strong {
        font-size: 12px;
    }

    .user-cell span {
        font-size: 10px;
    }

    .role-card {
        padding: 16px;
    }

    .role-card-main {
        gap: 10px;
    }

    .role-card-icon {
        width: 39px;
        height: 39px;
    }

    .role-actions {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 8px;
    }

    .role-actions button {
        min-height: 38px;
        border-radius: 8px;
        font-size: 11px;
    }

    .dialog-overlay {
        padding: 8px;
    }

    .dialog {
        max-height: calc(100dvh - 16px);
        border-radius: 13px;
    }

    .dialog-title h3 {
        font-size: 15px;
    }

    .dialog-title p {
        font-size: 10px;
    }

    .dialog-body {
        padding: 16px 13px;
    }

    .role-dialog {
        width: calc(100vw - 16px);
        max-height: calc(100dvh - 16px);
    }

    .role-dialog-body {
        padding: 16px 13px;
    }

    .permissions-dialog-list {
        gap: 8px;
    }

    .permission-dialog-category {
        padding: 8px 10px;
    }

    .permission-checkbox {
        min-height: 32px;
        font-size: 10.5px;
    }

    .delete-dialog {
        padding: 22px 18px;
    }

    .delete-actions {
        flex-direction: column;
    }

    .delete-actions .secondary-button,
    .delete-actions .delete-confirm-button {
        width: 100%;
    }
}

/* =========================================================
   EXTRA SMALL MOBILE - 360px
========================================================= */

@media (max-width: 360px) {

    .page-title-row {
        gap: 10px;
    }

    .user-management-header h2 {
        font-size: 19px;
    }

    .user-tabs {
        gap: 8px;
    }

    .user-tab {
        gap: 10px;
    }

    .user-cell {
        gap: 7px;
    }

    .user-avatar {
        width: 30px;
        height: 30px;
        min-width: 30px;
        max-width: 30px;
        flex-basis: 30px;
    }
}

/* =========================================================
   ACCESSIBILITY
========================================================= */

button:focus-visible,
input:focus-visible,
select:focus-visible,
textarea:focus-visible {
    outline: 2px solid #356ae6;
    outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        scroll-behavior: auto !important;
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
}
