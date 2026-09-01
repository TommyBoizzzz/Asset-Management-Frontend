import React, { useMemo, useState } from "react";
import {
  Search,
  RefreshCw,
  Plus,
  MoreHorizontal,
  Laptop,
  Armchair,
  Car,
  Monitor,
  Wrench,
  X,
  Pencil,
  Save,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import "./setting.css";

const INITIAL_CATEGORIES = [
  { id: "CAT-001", icon: "laptop", name: "IT Equipment", description: "Computers, laptops, servers...", assets: 42, status: "ACTIVE" },
  { id: "CAT-002", icon: "furniture", name: "Office Furniture", description: "Desks, chairs, cabinets...", assets: 35, status: "ACTIVE" },
  { id: "CAT-003", icon: "vehicle", name: "Vehicles", description: "Company cars, motorcycles...", assets: 12, status: "ACTIVE" },
  { id: "CAT-004", icon: "electronics", name: "Electronics", description: "Projectors, TVs, cameras...", assets: 28, status: "ACTIVE" },
  { id: "CAT-005", icon: "tools", name: "Tools & Equipment", description: "Hand tools, power tools...", assets: 18, status: "ACTIVE" },
];

const DEFAULT_PROFILE = {
  name: "Sarah Jenkins",
  email: "s.jenkins@bams.corp",
  phone: "+855 12 345 678",
  department: "Systems Control",
  role: "Administrator",
};

function CategoryIcon({ type }) {
  const icons = {
    laptop: Laptop,
    furniture: Armchair,
    vehicle: Car,
    electronics: Monitor,
    tools: Wrench,
  };
  const Icon = icons[type] || Laptop;
  return <div className="category-icon"><Icon size={18} /></div>;
}

/* =========================
   EDIT PROFILE MODAL
========================= */
function EditProfileModal({ profile, onClose, onSave }) {
  const [draft, setDraft] = useState(profile);

  const change = (key, value) =>
    setDraft((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();
    onSave(draft);
  };

  return (
    <div className="profile-modal-backdrop" onMouseDown={onClose}>
      <div
        className="profile-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="profile-modal-header">
          <div>
            <span>EDIT PROFILE</span>
            <h2>Edit Profile</h2>
            <p>Update your personal information and account details.</p>
          </div>

          <button
            type="button"
            className="profile-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="profile-modal-body">
            <div className="profile-modal-grid">
              <label>
                <span>FULL NAME</span>
                <input
                  value={draft.name}
                  onChange={(e) => change("name", e.target.value)}
                />
              </label>

              <label>
                <span>EMAIL ADDRESS</span>
                <input
                  type="email"
                  value={draft.email}
                  onChange={(e) => change("email", e.target.value)}
                />
              </label>

              <label>
                <span>PHONE NUMBER</span>
                <input
                  value={draft.phone}
                  onChange={(e) => change("phone", e.target.value)}
                />
              </label>

              <label>
                <span>DEPARTMENT</span>
                <select
                  value={draft.department}
                  onChange={(e) => change("department", e.target.value)}
                >
                  <option>Systems Control</option>
                  <option>IT Support</option>
                  <option>Operations</option>
                  <option>Finance</option>
                  <option>Human Resources</option>
                </select>
              </label>
            </div>

            <label className="profile-role-field">
              <span>ROLE</span>
              <input value={draft.role} disabled />
              <small>Your role and permissions cannot be changed.</small>
            </label>
          </div>

          <div className="profile-modal-footer">
            <button
              type="button"
              className="profile-cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="profile-save-btn">
              <Save size={16} />
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   CATEGORY MODAL
========================= */
function CategoryModal({ category, onClose, onSave }) {
  const editing = Boolean(category);
  const [form, setForm] = useState({
    id: category?.id || "",
    name: category?.name || "",
    description: category?.description || "",
    icon: category?.icon || "laptop",
    status: category?.status || "ACTIVE",
  });

  const set = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Please enter Category Name.");
      return;
    }

    onSave({
      ...form,
      id: form.id.trim() || `CAT-${String(Date.now()).slice(-3)}`,
      description: form.description.trim() || "No description provided.",
      assets: category?.assets || 0,
    });
  };

  return (
    <div className="category-modal-backdrop" onMouseDown={onClose}>
      <div
        className="category-modal"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="category-modal-header">
          <div>
            <span>SETTINGS / CATEGORIES</span>
            <h2>{editing ? "Edit Category" : "Add Category"}</h2>
            <p>
              {editing
                ? "Update category information and settings."
                : "Create a new asset category for your company."}
            </p>
          </div>

          <button type="button" onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit}>
          <div className="category-modal-body">
            <div className="category-form-grid">
              <label>
                <span>CATEGORY ID</span>
                <input
                  placeholder="CAT-006"
                  value={form.id}
                  onChange={(e) => set("id", e.target.value)}
                />
              </label>

              <label>
                <span>CATEGORY NAME <b>*</b></span>
                <input
                  placeholder="e.g. IT Equipment"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                />
              </label>
            </div>

            <label>
              <span>DESCRIPTION</span>
              <textarea
                rows="4"
                placeholder="Describe this asset category..."
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
              />
            </label>

            <label>
              <span>CATEGORY ICON</span>
              <div className="icon-picker">
                {[
                  ["laptop", <Laptop size={19} />],
                  ["furniture", <Armchair size={19} />],
                  ["vehicle", <Car size={19} />],
                  ["electronics", <Monitor size={19} />],
                  ["tools", <Wrench size={19} />],
                ].map(([id, icon]) => (
                  <button
                    type="button"
                    key={id}
                    className={form.icon === id ? "selected" : ""}
                    onClick={() => set("icon", id)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </label>

            <label>
              <span>STATUS</span>
              <select
                value={form.status}
                onChange={(e) => set("status", e.target.value)}
              >
                <option>ACTIVE</option>
                <option>INACTIVE</option>
              </select>
            </label>
          </div>

          <div className="category-modal-footer">
            <button type="button" className="profile-cancel-btn" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="profile-save-btn">
              <Plus size={17} />
              {editing ? "Save Changes" : "Add Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* =========================
   SETTINGS
========================= */
export default function Settings() {
  const [categories, setCategories] = useState(INITIAL_CATEGORIES);
  const [search, setSearch] = useState("");
  const [menuId, setMenuId] = useState(null);

  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [profileModalOpen, setProfileModalOpen] = useState(false);

  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return categories;

    return categories.filter((item) =>
      `${item.id} ${item.name} ${item.description}`
        .toLowerCase()
        .includes(q)
    );
  }, [categories, search]);

  const saveCategory = (item) => {
    setCategories((prev) => {
      const exists = prev.some((x) => x.id === item.id);
      return exists
        ? prev.map((x) => (x.id === item.id ? item : x))
        : [...prev, item];
    });

    setCategoryModalOpen(false);
    setEditingCategory(null);
    setMenuId(null);
  };

  const toggleStatus = (id) => {
    setCategories((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
            }
          : item
      )
    );
    setMenuId(null);
  };

  const handleHeaderProfile = () => {
    setProfileModalOpen(true);
  };

  return (
    <MainLayout
      activePage="Settings"
      title="ASSIGNMENTS"
      onProfileClick={handleHeaderProfile}
    >
      <main className="settings-page">

        {/* SMALL PROFILE CARD */}
        <section className="profile-card">
          <div className="profile-card-person">
            <div className="profile-photo">
              <span>SJ</span>
              <i />
            </div>

            <div className="profile-card-name">
              <h2>{profile.name}</h2>
              <strong>{profile.role.toUpperCase()}</strong>
              <span>{profile.email}</span>
            </div>
          </div>

          <div className="profile-card-detail">
            <small>PHONE</small>
            <b>{profile.phone}</b>
          </div>

          <div className="profile-card-detail">
            <small>DEPARTMENT</small>
            <b>{profile.department}</b>
          </div>

          <div className="profile-card-detail">
            <small>ROLE</small>
            <b>{profile.role}</b>
          </div>

          <button
            type="button"
            className="profile-edit-button"
            onClick={() => setProfileModalOpen(true)}
          >
            <Pencil size={15} />
            Edit Profile
          </button>
        </section>

        {/* SETTINGS HEADER */}
        <div className="settings-heading">
          <div>
            <span>CONFIGURATION</span>
            <h1>Settings</h1>
            <p>Manage system configuration and asset categories.</p>
          </div>

          <div className="settings-heading-actions">
            <button type="button"><Search size={18} /></button>
            <button type="button"><RefreshCw size={17} /></button>
          </div>
        </div>

        {/* CATEGORIES ONLY */}
        <section className="categories-card">
          <div className="categories-top">
            <div>
              <h2>Categories</h2>
              <p>Organize asset types into meaningful categories.</p>
            </div>

            <button
              type="button"
              className="add-category-btn"
              onClick={() => {
                setEditingCategory(null);
                setCategoryModalOpen(true);
              }}
            >
              <Plus size={18} />
              Add Category
            </button>
          </div>

          <div className="category-search">
            <Search size={18} />
            <input
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>ICON</th>
                  <th>NAME</th>
                  <th>DESCRIPTION</th>
                  <th>ASSET COUNT</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((item) => (
                  <tr key={item.id}>
                    <td><b className="green">{item.id}</b></td>
                    <td><CategoryIcon type={item.icon} /></td>
                    <td><strong>{item.name}</strong></td>
                    <td className="muted">{item.description}</td>
                    <td><b className="green">{item.assets} Assets</b></td>
                    <td>
                      <button
                        type="button"
                        className={`status ${item.status.toLowerCase()}`}
                        onClick={() => toggleStatus(item.id)}
                      >
                        {item.status}
                      </button>
                    </td>
                    <td>
                      <div className="row-action">
                        <button
                          type="button"
                          className="more"
                          onClick={() =>
                            setMenuId(menuId === item.id ? null : item.id)
                          }
                        >
                          <MoreHorizontal size={19} />
                        </button>

                        {menuId === item.id && (
                          <div className="row-menu">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingCategory(item);
                                setCategoryModalOpen(true);
                                setMenuId(null);
                              }}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleStatus(item.id)}
                            >
                              {item.status === "ACTIVE"
                                ? "Set Inactive"
                                : "Set Active"}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {!filtered.length && (
                  <tr>
                    <td colSpan="7" className="empty">
                      No categories found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* PROFILE MODAL */}
      {profileModalOpen && (
        <EditProfileModal
          profile={profile}
          onClose={() => setProfileModalOpen(false)}
          onSave={(newProfile) => {
            setProfile(newProfile);
            setProfileModalOpen(false);
          }}
        />
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <CategoryModal
          category={editingCategory}
          onClose={() => {
            setCategoryModalOpen(false);
            setEditingCategory(null);
          }}
          onSave={saveCategory}
        />
      )}
    </MainLayout>
  );
}
