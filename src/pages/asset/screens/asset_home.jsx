import { useEffect, useMemo, useState } from "react";
import {
    Package,
    CheckCircle,
    Wrench,
    AlertTriangle,
    Search,
    Eye,
    Pencil,
    Trash2,
    Plus,
    X,
    Laptop,
    Monitor,
    Printer,
    Armchair,
    Boxes,
    Tag,
    MoreHorizontal,
    ChevronDown,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import "../css/asset_home.css";

function Assets() {

    /* =========================================================
       DEFAULT DATA
    ========================================================= */

    const defaultCategories = [
        {
            id: 1,
            name: "Laptop",
            description: "Portable computers",
        },
        {
            id: 2,
            name: "Desktop",
            description: "Desktop computers",
        },
        {
            id: 3,
            name: "Monitor",
            description: "Computer displays",
        },
        {
            id: 4,
            name: "Printer",
            description: "Printing devices",
        },
        {
            id: 5,
            name: "Furniture",
            description: "Office furniture",
        },
    ];

    const defaultAssets = [
        {
            id: 1,
            code: "AST-001",
            name: "Dell Latitude 5420",
            category: "Laptop",
            location: "IT Department",
            status: "Active",
            value: "1200",
        },
        {
            id: 2,
            code: "AST-002",
            name: "HP LaserJet Pro",
            category: "Printer",
            location: "Finance Department",
            status: "Active",
            value: "450",
        },
        {
            id: 3,
            code: "AST-003",
            name: "Office Desk",
            category: "Furniture",
            location: "HR Department",
            status: "Maintenance",
            value: "280",
        },
        {
            id: 4,
            code: "AST-004",
            name: "MacBook Pro 14",
            category: "Laptop",
            location: "Management",
            status: "Active",
            value: "2100",
        },
        {
            id: 5,
            code: "AST-005",
            name: "Samsung Monitor",
            category: "Monitor",
            location: "IT Department",
            status: "Inactive",
            value: "350",
        },
    ];


    /* =========================================================
       STATE
    ========================================================= */

    const [assets, setAssets] = useState(() => {

        const saved = localStorage.getItem("assets");

        return saved
            ? JSON.parse(saved)
            : defaultAssets;
    });


    const [categories, setCategories] = useState(() => {

        const saved = localStorage.getItem("assetCategories");

        return saved
            ? JSON.parse(saved)
            : defaultCategories;
    });


    const [assetSearch, setAssetSearch] = useState("");
    const [categorySearch, setCategorySearch] = useState("");

    const [activeCategory, setActiveCategory] =
        useState("All");


    /* =========================================================
       MODALS
    ========================================================= */

    const [showAssetModal, setShowAssetModal] =
        useState(false);

    const [showCategoryModal, setShowCategoryModal] =
        useState(false);

    const [showAssetView, setShowAssetView] =
        useState(false);

    const [showCategoryView, setShowCategoryView] =
        useState(false);


    /* =========================================================
       EDIT STATES
    ========================================================= */

    const [editingAsset, setEditingAsset] =
        useState(null);

    const [editingCategory, setEditingCategory] =
        useState(null);


    const [selectedAsset, setSelectedAsset] =
        useState(null);

    const [selectedCategory, setSelectedCategory] =
        useState(null);


    /* =========================================================
       FORM STATES
    ========================================================= */

    const emptyAsset = {
        code: "",
        name: "",
        category: "",
        location: "",
        status: "Active",
        value: "",
    };

    const emptyCategory = {
        name: "",
        description: "",
    };


    const [assetForm, setAssetForm] =
        useState(emptyAsset);

    const [categoryForm, setCategoryForm] =
        useState(emptyCategory);


    /* =========================================================
       SAVE DATA
    ========================================================= */

    useEffect(() => {

        localStorage.setItem(
            "assets",
            JSON.stringify(assets)
        );

    }, [assets]);


    useEffect(() => {

        localStorage.setItem(
            "assetCategories",
            JSON.stringify(categories)
        );

    }, [categories]);


    /* =========================================================
       CATEGORY ICON
    ========================================================= */

    const getCategoryIcon = (category) => {

        const name =
            typeof category === "string"
                ? category.toLowerCase()
                : "";

        if (name.includes("laptop")) {
            return <Laptop size={17} />;
        }

        if (
            name.includes("desktop") ||
            name.includes("computer")
        ) {
            return <Monitor size={17} />;
        }

        if (name.includes("monitor")) {
            return <Monitor size={17} />;
        }

        if (name.includes("printer")) {
            return <Printer size={17} />;
        }

        if (
            name.includes("furniture") ||
            name.includes("desk")
        ) {
            return <Armchair size={17} />;
        }

        return <Boxes size={17} />;
    };


    const getCategoryClass = (category) => {

        const name =
            typeof category === "string"
                ? category.toLowerCase()
                : "other";

        if (name.includes("laptop"))
            return "laptop";

        if (name.includes("desktop"))
            return "desktop";

        if (name.includes("monitor"))
            return "monitor";

        if (name.includes("printer"))
            return "printer";

        if (name.includes("furniture"))
            return "furniture";

        return "other";
    };


    /* =========================================================
       CATEGORY COUNT
    ========================================================= */

    const getCategoryCount = (categoryName) => {

        return assets.filter(
            (asset) =>
                asset.category === categoryName
        ).length;
    };


    /* =========================================================
       ASSET STATISTICS
    ========================================================= */

    const totalAssets = assets.length;

    const activeAssets = assets.filter(
        (asset) =>
            asset.status === "Active"
    ).length;

    const maintenanceAssets = assets.filter(
        (asset) =>
            asset.status === "Maintenance"
    ).length;

    const inactiveAssets = assets.filter(
        (asset) =>
            asset.status === "Inactive"
    ).length;


    /* =========================================================
       FILTER ASSETS
    ========================================================= */

    const filteredAssets = useMemo(() => {

        const search =
            assetSearch
                .toLowerCase()
                .trim();

        return assets.filter((asset) => {

            const matchesSearch =
                asset.name
                    .toLowerCase()
                    .includes(search) ||

                asset.code
                    .toLowerCase()
                    .includes(search) ||

                asset.category
                    .toLowerCase()
                    .includes(search) ||

                asset.location
                    .toLowerCase()
                    .includes(search);

            const matchesCategory =
                activeCategory === "All" ||
                asset.category === activeCategory;

            return (
                matchesSearch &&
                matchesCategory
            );
        });

    }, [
        assets,
        assetSearch,
        activeCategory,
    ]);


    /* =========================================================
       FILTER CATEGORIES
    ========================================================= */

    const filteredCategories =
        categories.filter((category) =>
            category.name
                .toLowerCase()
                .includes(
                    categorySearch
                        .toLowerCase()
                        .trim()
                )
        );


    /* =========================================================
       OPEN ADD ASSET
    ========================================================= */

    const handleAddAsset = () => {

        setEditingAsset(null);

        setAssetForm({
            ...emptyAsset,
            category:
                categories.length > 0
                    ? categories[0].name
                    : "",
        });

        setShowAssetModal(true);
    };


    /* =========================================================
       OPEN EDIT ASSET
    ========================================================= */

    const handleEditAsset = (asset) => {

        setEditingAsset(asset);

        setAssetForm({
            code: asset.code,
            name: asset.name,
            category: asset.category,
            location: asset.location,
            status: asset.status,
            value: asset.value,
        });

        setShowAssetModal(true);
    };


    /* =========================================================
       SAVE ASSET
    ========================================================= */

    const handleAssetSubmit = (e) => {

        e.preventDefault();

        if (
            !assetForm.code.trim() ||
            !assetForm.name.trim() ||
            !assetForm.category ||
            !assetForm.location.trim() ||
            !assetForm.value
        ) {

            alert(
                "Please fill in all asset fields."
            );

            return;
        }


        if (editingAsset) {

            setAssets((prev) =>
                prev.map((asset) =>
                    asset.id === editingAsset.id
                        ? {
                            ...asset,
                            ...assetForm,
                        }
                        : asset
                )
            );

            alert(
                "Asset updated successfully!"
            );

        } else {

            const newAsset = {
                id: Date.now(),
                ...assetForm,
            };

            setAssets((prev) => [
                ...prev,
                newAsset,
            ]);

            alert(
                "Asset created successfully!"
            );
        }

        setShowAssetModal(false);
    };


    /* =========================================================
       DELETE ASSET
    ========================================================= */

    const handleDeleteAsset = (id) => {

        const asset =
            assets.find(
                (item) => item.id === id
            );

        if (!asset) return;

        const confirmed =
            window.confirm(
                `Delete "${asset.name}"?`
            );

        if (!confirmed) return;

        setAssets((prev) =>
            prev.filter(
                (item) =>
                    item.id !== id
            )
        );

        alert(
            "Asset deleted successfully!"
        );
    };


    /* =========================================================
       VIEW ASSET
    ========================================================= */

    const handleViewAsset = (asset) => {

        setSelectedAsset(asset);

        setShowAssetView(true);
    };


    /* =========================================================
       ASSET FORM CHANGE
    ========================================================= */

    const handleAssetChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setAssetForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    /* =========================================================
       OPEN ADD CATEGORY
    ========================================================= */

    const handleAddCategory = () => {

        setEditingCategory(null);

        setCategoryForm(
            emptyCategory
        );

        setShowCategoryModal(true);
    };


    /* =========================================================
       OPEN EDIT CATEGORY
    ========================================================= */

    const handleEditCategory = (
        category
    ) => {

        setEditingCategory(category);

        setCategoryForm({
            name: category.name,
            description:
                category.description,
        });

        setShowCategoryModal(true);
    };


    /* =========================================================
       SAVE CATEGORY
    ========================================================= */

    const handleCategorySubmit = (e) => {

        e.preventDefault();

        const name =
            categoryForm.name.trim();

        const description =
            categoryForm.description.trim();


        if (!name) {

            alert(
                "Category name is required."
            );

            return;
        }


        const duplicate =
            categories.some(
                (category) =>
                    category.name
                        .toLowerCase() ===
                        name.toLowerCase() &&
                    category.id !==
                        editingCategory?.id
            );


        if (duplicate) {

            alert(
                "This category already exists."
            );

            return;
        }


        if (editingCategory) {

            const oldName =
                editingCategory.name;


            setCategories((prev) =>
                prev.map(
                    (category) =>
                        category.id ===
                        editingCategory.id
                            ? {
                                ...category,
                                name,
                                description,
                            }
                            : category
                )
            );


            /* Update asset category names */

            if (oldName !== name) {

                setAssets((prev) =>
                    prev.map((asset) =>
                        asset.category ===
                        oldName
                            ? {
                                ...asset,
                                category: name,
                            }
                            : asset
                    )
                );
            }


            alert(
                "Category updated successfully!"
            );

        } else {

            const newCategory = {
                id: Date.now(),
                name,
                description,
            };

            setCategories((prev) => [
                ...prev,
                newCategory,
            ]);

            alert(
                "Category created successfully!"
            );
        }

        setShowCategoryModal(false);
    };


    /* =========================================================
       DELETE CATEGORY
    ========================================================= */

    const handleDeleteCategory = (
        category
    ) => {

        const usedCount =
            getCategoryCount(
                category.name
            );


        if (usedCount > 0) {

            alert(
                `Cannot delete "${category.name}" because ${usedCount} asset(s) are using this category.`
            );

            return;
        }


        const confirmed =
            window.confirm(
                `Delete category "${category.name}"?`
            );

        if (!confirmed) return;


        setCategories((prev) =>
            prev.filter(
                (item) =>
                    item.id !==
                    category.id
            )
        );


        alert(
            "Category deleted successfully!"
        );
    };


    /* =========================================================
       VIEW CATEGORY
    ========================================================= */

    const handleViewCategory = (
        category
    ) => {

        setSelectedCategory(
            category
        );

        setShowCategoryView(true);
    };


    /* =========================================================
       CATEGORY FORM CHANGE
    ========================================================= */

    const handleCategoryChange = (e) => {

        const {
            name,
            value,
        } = e.target;

        setCategoryForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    return (
        <MainLayout
            activePage="Assets"
            title="Assets"
        >

            <div className="assets-page">

                {/* =================================================
                    PAGE HEADER
                ================================================= */}

                <div className="assets-header">

                    <div className="assets-heading">

                        <div className="page-icon">
                            <Package size={25} />
                        </div>

                        <div>
                            <h2>
                                Asset Management
                            </h2>

                            <p>
                                Manage company assets and
                                asset categories in one place.
                            </p>
                        </div>

                    </div>

                    <button
                        className="primary-btn"
                        onClick={handleAddAsset}
                    >
                        <Plus size={18} />
                        Add Asset
                    </button>

                </div>


                {/* =================================================
                    STATISTICS
                ================================================= */}

                <div className="asset-stat-grid">

                    <div className="stat-card">

                        <div className="stat-icon blue">
                            <Package size={22} />
                        </div>

                        <div>
                            <span>
                                Total Assets
                            </span>

                            <strong>
                                {totalAssets}
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon green">
                            <CheckCircle size={22} />
                        </div>

                        <div>
                            <span>
                                Active Assets
                            </span>

                            <strong>
                                {activeAssets}
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon orange">
                            <Wrench size={22} />
                        </div>

                        <div>
                            <span>
                                Maintenance
                            </span>

                            <strong>
                                {maintenanceAssets}
                            </strong>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon red">
                            <AlertTriangle size={22} />
                        </div>

                        <div>
                            <span>
                                Inactive
                            </span>

                            <strong>
                                {inactiveAssets}
                            </strong>
                        </div>

                    </div>

                </div>


                {/* =================================================
                    MAIN MANAGEMENT GRID
                ================================================= */}

                <div className="management-grid">


                    {/* =================================================
                        ASSETS PANEL
                    ================================================= */}

                    <section className="management-card assets-card">

                        <div className="card-header">

                            <div className="card-header-title">

                                <div className="small-header-icon blue">
                                    <Package size={18} />
                                </div>

                                <div>

                                    <h3>
                                        Assets
                                    </h3>

                                    <p>
                                        Manage all company assets.
                                    </p>

                                </div>

                            </div>


                            <button
                                className="small-primary-btn"
                                onClick={
                                    handleAddAsset
                                }
                            >
                                <Plus size={16} />
                                Add Asset
                            </button>

                        </div>


                        {/* =================================================
                            ASSET FILTER BAR
                        ================================================= */}

                        <div className="asset-toolbar">

                            <div className="search-field">

                                <Search size={17} />

                                <input
                                    type="text"
                                    placeholder="Search assets..."
                                    value={
                                        assetSearch
                                    }
                                    onChange={(e) =>
                                        setAssetSearch(
                                            e.target.value
                                        )
                                    }
                                />

                                {assetSearch && (

                                    <button
                                        onClick={() =>
                                            setAssetSearch("")
                                        }
                                    >
                                        <X size={14} />
                                    </button>

                                )}

                            </div>


                            <div className="category-filter">

                                <Tag size={15} />

                                <select
                                    value={
                                        activeCategory
                                    }
                                    onChange={(e) =>
                                        setActiveCategory(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="All">
                                        All Categories
                                    </option>

                                    {categories.map(
                                        (category) => (

                                            <option
                                                key={
                                                    category.id
                                                }
                                                value={
                                                    category.name
                                                }
                                            >
                                                {
                                                    category.name
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                                <ChevronDown
                                    size={14}
                                />

                            </div>

                        </div>


                        {/* =================================================
                            ASSET TABLE
                        ================================================= */}

                        <div className="asset-table-wrapper">

                            <table className="management-table">

                                <thead>

                                    <tr>
                                        <th>
                                            Asset
                                        </th>

                                        <th>
                                            Category
                                        </th>

                                        <th>
                                            Location
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Value
                                        </th>

                                        <th>
                                            Action
                                        </th>
                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredAssets.length ===
                                    0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="empty-cell"
                                            >

                                                <div className="empty-content">

                                                    <div>
                                                        <Package
                                                            size={
                                                                25
                                                            }
                                                        />
                                                    </div>

                                                    <strong>
                                                        No assets found
                                                    </strong>

                                                    <span>
                                                        Try another
                                                        search or
                                                        category.
                                                    </span>

                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredAssets.map(
                                            (asset) => (

                                                <tr
                                                    key={
                                                        asset.id
                                                    }
                                                >

                                                    {/* ASSET */}

                                                    <td>

                                                        <div className="asset-cell">

                                                            <div className="asset-image-icon">
                                                                <Package
                                                                    size={
                                                                        18
                                                                    }
                                                                />
                                                            </div>

                                                            <div>

                                                                <strong>
                                                                    {
                                                                        asset.name
                                                                    }
                                                                </strong>

                                                                <span>
                                                                    {
                                                                        asset.code
                                                                    }
                                                                </span>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* CATEGORY */}

                                                    <td>

                                                        <div className="table-category">

                                                            <div
                                                                className={`category-icon ${getCategoryClass(
                                                                    asset.category
                                                                )}`}
                                                            >
                                                                {
                                                                    getCategoryIcon(
                                                                        asset.category
                                                                    )
                                                                }
                                                            </div>

                                                            <span>
                                                                {
                                                                    asset.category
                                                                }
                                                            </span>

                                                        </div>

                                                    </td>


                                                    {/* LOCATION */}

                                                    <td>

                                                        <span className="location">
                                                            {
                                                                asset.location
                                                            }
                                                        </span>

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        <span
                                                            className={`status ${asset.status
                                                                .toLowerCase()
                                                                .replace(
                                                                    " ",
                                                                    "-"
                                                                )}`}
                                                        >

                                                            <i />

                                                            {
                                                                asset.status
                                                            }

                                                        </span>

                                                    </td>


                                                    {/* VALUE */}

                                                    <td>

                                                        <strong className="value">
                                                            $
                                                            {Number(
                                                                asset.value
                                                            ).toLocaleString()}
                                                        </strong>

                                                    </td>


                                                    {/* ACTION */}

                                                    <td>

                                                        <div className="table-actions">

                                                            <button
                                                                className="table-btn view"
                                                                title="View"
                                                                onClick={() =>
                                                                    handleViewAsset(
                                                                        asset
                                                                    )
                                                                }
                                                            >
                                                                <Eye
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            </button>

                                                            <button
                                                                className="table-btn edit"
                                                                title="Edit"
                                                                onClick={() =>
                                                                    handleEditAsset(
                                                                        asset
                                                                    )
                                                                }
                                                            >
                                                                <Pencil
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            </button>

                                                            <button
                                                                className="table-btn delete"
                                                                title="Delete"
                                                                onClick={() =>
                                                                    handleDeleteAsset(
                                                                        asset.id
                                                                    )
                                                                }
                                                            >
                                                                <Trash2
                                                                    size={
                                                                        15
                                                                    }
                                                                />
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>


                        <div className="card-footer">

                            Showing{" "}
                            <strong>
                                {
                                    filteredAssets.length
                                }
                            </strong>{" "}
                            of{" "}
                            <strong>
                                {assets.length}
                            </strong>{" "}
                            assets

                        </div>

                    </section>


                    {/* =================================================
                        CATEGORY PANEL
                    ================================================= */}

                    <section className="management-card categories-card">

                        <div className="card-header">

                            <div className="card-header-title">

                                <div className="small-header-icon purple">
                                    <Tag size={18} />
                                </div>

                                <div>

                                    <h3>
                                        Categories
                                    </h3>

                                    <p>
                                        Manage asset categories.
                                    </p>

                                </div>

                            </div>


                            <button
                                className="small-primary-btn"
                                onClick={
                                    handleAddCategory
                                }
                            >
                                <Plus size={16} />
                                Add Category
                            </button>

                        </div>


                        {/* =================================================
                            CATEGORY SEARCH
                        ================================================= */}

                        <div className="category-search">

                            <div className="search-field">

                                <Search size={17} />

                                <input
                                    type="text"
                                    placeholder="Search categories..."
                                    value={
                                        categorySearch
                                    }
                                    onChange={(e) =>
                                        setCategorySearch(
                                            e.target.value
                                        )
                                    }
                                />

                            </div>

                        </div>


                        {/* =================================================
                            CATEGORY LIST
                        ================================================= */}

                        <div className="category-list">

                            {filteredCategories.length ===
                            0 ? (

                                <div className="category-empty">

                                    <Tag size={25} />

                                    <strong>
                                        No categories found
                                    </strong>

                                    <span>
                                        Create your first
                                        category.
                                    </span>

                                </div>

                            ) : (

                                filteredCategories.map(
                                    (category) => (

                                        <div
                                            className="category-row"
                                            key={
                                                category.id
                                            }
                                        >

                                            <div className="category-main">

                                                <div
                                                    className={`category-large-icon ${getCategoryClass(
                                                        category.name
                                                    )}`}
                                                >
                                                    {
                                                        getCategoryIcon(
                                                            category.name
                                                        )
                                                    }
                                                </div>


                                                <div className="category-text">

                                                    <strong>
                                                        {
                                                            category.name
                                                        }
                                                    </strong>

                                                    <span>
                                                        {
                                                            category.description ||
                                                            "No description"
                                                        }
                                                    </span>

                                                </div>

                                            </div>


                                            <div className="category-right">

                                                <div className="asset-count">

                                                    <strong>
                                                        {
                                                            getCategoryCount(
                                                                category.name
                                                            )
                                                        }
                                                    </strong>

                                                    <span>
                                                        assets
                                                    </span>

                                                </div>


                                                <div className="category-actions">

                                                    <button
                                                        className="category-action view"
                                                        title="View"
                                                        onClick={() =>
                                                            handleViewCategory(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        <Eye
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        className="category-action edit"
                                                        title="Edit"
                                                        onClick={() =>
                                                            handleEditCategory(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        <Pencil
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                    <button
                                                        className="category-action delete"
                                                        title="Delete"
                                                        onClick={() =>
                                                            handleDeleteCategory(
                                                                category
                                                            )
                                                        }
                                                    >
                                                        <Trash2
                                                            size={
                                                                15
                                                            }
                                                        />
                                                    </button>

                                                </div>

                                            </div>

                                        </div>

                                    )
                                )

                            )}

                        </div>


                        <div className="category-footer">

                            <span>
                                <strong>
                                    {
                                        categories.length
                                    }
                                </strong>{" "}
                                categories
                            </span>

                            <span>
                                {
                                    assets.length
                                }{" "}
                                total assets
                            </span>

                        </div>

                    </section>

                </div>


                {/* =================================================
                    ASSET CREATE / UPDATE MODAL
                ================================================= */}

                {showAssetModal && (

                    <div
                        className="modal-overlay"
                        onClick={() =>
                            setShowAssetModal(false)
                        }
                    >

                        <div
                            className="modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <div className="modal-title">

                                    <div className="modal-icon blue">
                                        <Package
                                            size={20}
                                        />
                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                editingAsset
                                                    ? "Update Asset"
                                                    : "Add New Asset"
                                            }
                                        </h3>

                                        <p>
                                            {
                                                editingAsset
                                                    ? "Update asset information."
                                                    : "Create a new company asset."
                                            }
                                        </p>

                                    </div>

                                </div>


                                <button
                                    className="close-modal"
                                    onClick={() =>
                                        setShowAssetModal(
                                            false
                                        )
                                    }
                                >
                                    <X size={19} />
                                </button>

                            </div>


                            <form
                                className="modal-form"
                                onSubmit={
                                    handleAssetSubmit
                                }
                            >

                                <div className="form-grid">

                                    <div className="form-group">

                                        <label>
                                            Asset Code *
                                        </label>

                                        <input
                                            name="code"
                                            value={
                                                assetForm.code
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="AST-006"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Asset Name *
                                        </label>

                                        <input
                                            name="name"
                                            value={
                                                assetForm.name
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="Dell Latitude 5520"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Category *
                                        </label>

                                        <div className="select-container">

                                            <select
                                                name="category"
                                                value={
                                                    assetForm.category
                                                }
                                                onChange={
                                                    handleAssetChange
                                                }
                                            >

                                                <option value="">
                                                    Select Category
                                                </option>

                                                {categories.map(
                                                    (
                                                        category
                                                    ) => (

                                                        <option
                                                            key={
                                                                category.id
                                                            }
                                                            value={
                                                                category.name
                                                            }
                                                        >
                                                            {
                                                                category.name
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                            <ChevronDown
                                                size={
                                                    16
                                                }
                                            />

                                        </div>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Location *
                                        </label>

                                        <input
                                            name="location"
                                            value={
                                                assetForm.location
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="IT Department"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Status *
                                        </label>

                                        <div className="select-container">

                                            <select
                                                name="status"
                                                value={
                                                    assetForm.status
                                                }
                                                onChange={
                                                    handleAssetChange
                                                }
                                            >

                                                <option value="Active">
                                                    Active
                                                </option>

                                                <option value="Maintenance">
                                                    Maintenance
                                                </option>

                                                <option value="Inactive">
                                                    Inactive
                                                </option>

                                            </select>

                                            <ChevronDown
                                                size={
                                                    16
                                                }
                                            />

                                        </div>

                                    </div>


                                    <div className="form-group">

                                        <label>
                                            Value ($) *
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            name="value"
                                            value={
                                                assetForm.value
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="1200"
                                        />

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() =>
                                            setShowAssetModal(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="primary-modal-btn"
                                    >
                                        {
                                            editingAsset
                                                ? "Update Asset"
                                                : "Create Asset"
                                        }
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* =================================================
                    CATEGORY CREATE / UPDATE MODAL
                ================================================= */}

                {showCategoryModal && (

                    <div
                        className="modal-overlay"
                        onClick={() =>
                            setShowCategoryModal(
                                false
                            )
                        }
                    >

                        <div
                            className="modal category-modal"
                            onClick={(e) =>
                                e.stopPropagation()
                            }
                        >

                            <div className="modal-header">

                                <div className="modal-title">

                                    <div className="modal-icon purple">
                                        <Tag
                                            size={20}
                                        />
                                    </div>

                                    <div>

                                        <h3>
                                            {
                                                editingCategory
                                                    ? "Update Category"
                                                    : "Add New Category"
                                            }
                                        </h3>

                                        <p>
                                            {
                                                editingCategory
                                                    ? "Update category information."
                                                    : "Create a category for your assets."
                                            }
                                        </p>

                                    </div>

                                </div>


                                <button
                                    className="close-modal"
                                    onClick={() =>
                                        setShowCategoryModal(
                                            false
                                        )
                                    }
                                >
                                    <X size={19} />
                                </button>

                            </div>


                            <form
                                className="modal-form"
                                onSubmit={
                                    handleCategorySubmit
                                }
                            >

                                <div className="category-form-preview">

                                    <div
                                        className={`category-large-icon ${getCategoryClass(
                                            categoryForm.name
                                        )}`}
                                    >
                                        {getCategoryIcon(
                                            categoryForm.name
                                        )}
                                    </div>

                                    <div>

                                        <strong>
                                            Category
                                            Preview
                                        </strong>

                                        <span>
                                            {
                                                categoryForm.name ||
                                                "Category Name"
                                            }
                                        </span>

                                    </div>

                                </div>


                                <div className="form-group">

                                    <label>
                                        Category Name *
                                    </label>

                                    <input
                                        name="name"
                                        value={
                                            categoryForm.name
                                        }
                                        onChange={
                                            handleCategoryChange
                                        }
                                        placeholder="e.g. Mobile Devices"
                                    />

                                </div>


                                <div className="form-group">

                                    <label>
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        value={
                                            categoryForm.description
                                        }
                                        onChange={
                                            handleCategoryChange
                                        }
                                        placeholder="Describe this asset category..."
                                        rows="4"
                                    />

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={() =>
                                            setShowCategoryModal(
                                                false
                                            )
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        className="primary-modal-btn purple-btn"
                                    >
                                        {
                                            editingCategory
                                                ? "Update Category"
                                                : "Create Category"
                                        }
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                )}


                {/* =================================================
                    ASSET VIEW MODAL
                ================================================= */}

                {showAssetView &&
                    selectedAsset && (

                        <div
                            className="modal-overlay"
                            onClick={() =>
                                setShowAssetView(
                                    false
                                )
                            }
                        >

                            <div
                                className="modal view-modal"
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >

                                <div className="modal-header">

                                    <div className="modal-title">

                                        <div className="modal-icon blue">
                                            <Eye
                                                size={
                                                    20
                                                }
                                            />
                                        </div>

                                        <div>

                                            <h3>
                                                Asset Details
                                            </h3>

                                            <p>
                                                View complete
                                                asset information.
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        className="close-modal"
                                        onClick={() =>
                                            setShowAssetView(
                                                false
                                            )
                                        }
                                    >
                                        <X size={19} />
                                    </button>

                                </div>


                                <div className="view-content">

                                    <div
                                        className={`view-large-icon ${getCategoryClass(
                                            selectedAsset.category
                                        )}`}
                                    >
                                        {
                                            getCategoryIcon(
                                                selectedAsset.category
                                            )
                                        }
                                    </div>


                                    <h2>
                                        {
                                            selectedAsset.name
                                        }
                                    </h2>

                                    <span className="view-code">
                                        {
                                            selectedAsset.code
                                        }
                                    </span>


                                    <div className="view-status">

                                        <span
                                            className={`status ${selectedAsset.status
                                                .toLowerCase()
                                                .replace(
                                                    " ",
                                                    "-"
                                                )}`}
                                        >
                                            <i />
                                            {
                                                selectedAsset.status
                                            }
                                        </span>

                                    </div>


                                    <div className="details-grid">

                                        <div>
                                            <span>
                                                Category
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.category
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Location
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.location
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Asset Code
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.code
                                                }
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Value
                                            </span>

                                            <strong>
                                                $
                                                {Number(
                                                    selectedAsset.value
                                                ).toLocaleString()}
                                            </strong>
                                        </div>

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        className="secondary-btn"
                                        onClick={() =>
                                            setShowAssetView(
                                                false
                                            )
                                        }
                                    >
                                        Close
                                    </button>

                                    <button
                                        className="primary-modal-btn"
                                        onClick={() => {
                                            setShowAssetView(
                                                false
                                            );

                                            handleEditAsset(
                                                selectedAsset
                                            );
                                        }}
                                    >
                                        <Pencil
                                            size={
                                                15
                                            }
                                        />
                                        Edit Asset
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                {/* =================================================
                    CATEGORY VIEW MODAL
                ================================================= */}

                {showCategoryView &&
                    selectedCategory && (

                        <div
                            className="modal-overlay"
                            onClick={() =>
                                setShowCategoryView(
                                    false
                                )
                            }
                        >

                            <div
                                className="modal category-view-modal"
                                onClick={(e) =>
                                    e.stopPropagation()
                                }
                            >

                                <div className="modal-header">

                                    <div className="modal-title">

                                        <div className="modal-icon purple">
                                            <Tag
                                                size={
                                                    20
                                                }
                                            />
                                        </div>

                                        <div>

                                            <h3>
                                                Category Details
                                            </h3>

                                            <p>
                                                View category
                                                information.
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        className="close-modal"
                                        onClick={() =>
                                            setShowCategoryView(
                                                false
                                            )
                                        }
                                    >
                                        <X size={19} />
                                    </button>

                                </div>


                                <div className="view-content">

                                    <div
                                        className={`view-large-icon ${getCategoryClass(
                                            selectedCategory.name
                                        )}`}
                                    >
                                        {
                                            getCategoryIcon(
                                                selectedCategory.name
                                            )
                                        }
                                    </div>


                                    <h2>
                                        {
                                            selectedCategory.name
                                        }
                                    </h2>

                                    <span className="view-code">
                                        Category
                                    </span>


                                    <div className="category-view-description">

                                        {
                                            selectedCategory.description ||
                                            "No description provided."
                                        }

                                    </div>


                                    <div className="category-total-box">

                                        <strong>
                                            {
                                                getCategoryCount(
                                                    selectedCategory.name
                                                )
                                            }
                                        </strong>

                                        <span>
                                            Assets in this
                                            category
                                        </span>

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        className="secondary-btn"
                                        onClick={() =>
                                            setShowCategoryView(
                                                false
                                            )
                                        }
                                    >
                                        Close
                                    </button>

                                    <button
                                        className="primary-modal-btn purple-btn"
                                        onClick={() => {
                                            setShowCategoryView(
                                                false
                                            );

                                            handleEditCategory(
                                                selectedCategory
                                            );
                                        }}
                                    >
                                        <Pencil
                                            size={
                                                15
                                            }
                                        />
                                        Edit Category
                                    </button>

                                </div>

                            </div>

                        </div>

                    )}

            </div>

        </MainLayout>
    );
}

export default Assets;