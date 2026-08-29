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
    ChevronDown,
} from "lucide-react";

import MainLayout from "../../../layouts/MainLayout";
import "../css/asset_home.css";

import AssetService from "../services/AssetService";
import AssetCategoryService from "../services/AssetCategoryService";


function Assets() {

    /* =========================================================
       STATE
    ========================================================= */

    const [assets, setAssets] = useState([]);
    const [categories, setCategories] = useState([]);

    const [loadingAssets, setLoadingAssets] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(true);

    const [assetSearch, setAssetSearch] = useState("");
    const [categorySearch, setCategorySearch] = useState("");

    const [activeCategory, setActiveCategory] = useState("All");


    /* =========================================================
       MODALS
    ========================================================= */

    const [showAssetModal, setShowAssetModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const [showAssetView, setShowAssetView] = useState(false);
    const [showCategoryView, setShowCategoryView] = useState(false);


    /* =========================================================
       EDIT STATES
    ========================================================= */

    const [editingAsset, setEditingAsset] = useState(null);
    const [editingCategory, setEditingCategory] = useState(null);

    const [selectedAsset, setSelectedAsset] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);


    /* =========================================================
       FORM STATES
    ========================================================= */

    const emptyAsset = {
        assetCode: "",
        name: "",
        category: "",
        brand: "",
        model: "",
        serialNumber: "",
        purchaseDate: "",
        purchasePrice: "",
        warrantyEndDate: "",
        condition: "",
        location: "",
        status: "Active",
        description: "",
    };

    const emptyCategory = {
        name: "",
        description: "",
        status: "Active",
    };


    const [assetForm, setAssetForm] = useState(emptyAsset);
    const [categoryForm, setCategoryForm] = useState(emptyCategory);


    /* =========================================================
       LOAD ASSETS
    ========================================================= */

    const loadAssets = async () => {

        try {

            setLoadingAssets(true);

            const response = await AssetService.getAll();

            setAssets(response.data || []);

        } catch (error) {

            console.error("Failed to load assets:", error);

            alert(
                error.response?.data?.message ||
                "Failed to load assets."
            );

        } finally {

            setLoadingAssets(false);

        }
    };


    /* =========================================================
       LOAD CATEGORIES
    ========================================================= */

    const loadCategories = async () => {

        try {

            setLoadingCategories(true);

            const response =
                await AssetCategoryService.getAll();

            setCategories(response.data || []);

        } catch (error) {

            console.error(
                "Failed to load categories:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to load categories."
            );

        } finally {

            setLoadingCategories(false);

        }
    };


    /* =========================================================
       INITIAL LOAD
    ========================================================= */

    useEffect(() => {

        loadAssets();
        loadCategories();

    }, []);


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
       GET CATEGORY NAME FROM ASSET
    ========================================================= */

    const getAssetCategoryName = (asset) => {

        if (!asset?.category) {
            return "Other";
        }

        if (typeof asset.category === "string") {
            return asset.category;
        }

        return asset.category.name || "Other";
    };


    /* =========================================================
       CATEGORY COUNT
    ========================================================= */

    const getCategoryCount = (categoryName) => {

        return assets.filter(
            (asset) =>
                getAssetCategoryName(asset) === categoryName
        ).length;
    };


    /* =========================================================
       STATISTICS
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

            const categoryName =
                getAssetCategoryName(asset);

            const matchesSearch =
                (asset.name || "")
                    .toLowerCase()
                    .includes(search) ||

                (asset.assetCode || "")
                    .toLowerCase()
                    .includes(search) ||

                categoryName
                    .toLowerCase()
                    .includes(search) ||

                (asset.location || "")
                    .toLowerCase()
                    .includes(search);

            const matchesCategory =
                activeCategory === "All" ||
                categoryName === activeCategory;

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
            (category.name || "")
                .toLowerCase()
                .includes(
                    categorySearch
                        .toLowerCase()
                        .trim()
                )
        );


    /* =========================================================
       ADD ASSET
    ========================================================= */

    const handleAddAsset = () => {

        setEditingAsset(null);

        setAssetForm({
            ...emptyAsset,

            category:
                categories.length > 0
                    ? categories[0].id
                    : "",

            condition: "GOOD",

            status: "Active",
        });

        setShowAssetModal(true);
    };


    /* =========================================================
       EDIT ASSET
    ========================================================= */

    const handleEditAsset = (asset) => {

        setEditingAsset(asset);

        const categoryId =
            typeof asset.category === "object"
                ? asset.category?.id
                : categories.find(
                    (category) =>
                        category.name === asset.category
                )?.id || "";


        setAssetForm({

            assetCode:
                asset.assetCode || "",

            name:
                asset.name || "",

            category:
                categoryId,

            brand:
                asset.brand || "",

            model:
                asset.model || "",

            serialNumber:
                asset.serialNumber || "",

            purchaseDate:
                asset.purchaseDate || "",

            purchasePrice:
                asset.purchasePrice ?? "",

            warrantyEndDate:
                asset.warrantyEndDate || "",

            condition:
                asset.condition || "GOOD",

            location:
                asset.location || "",

            status:
                asset.status || "Active",

            description:
                asset.description || "",

        });

        setShowAssetModal(true);
    };


    /* =========================================================
       CREATE / UPDATE ASSET
       
       REQUIRED:
       assetCode
       name
       category
       condition
       status

       OPTIONAL:
       brand
       model
       serialNumber
       purchaseDate
       purchasePrice
       warrantyEndDate
       location
       description

       Empty optional fields are NOT sent.
    ========================================================= */

    const handleAssetSubmit = async (e) => {

        e.preventDefault();


        const assetCode =
            assetForm.assetCode?.trim();

        const name =
            assetForm.name?.trim();

        const condition =
            assetForm.condition?.trim();

        const category =
            assetForm.category;


        /* =====================================================
           REQUIRED VALIDATION
        ===================================================== */

        if (!assetCode) {

            alert("Asset Code is required.");

            return;
        }


        if (!name) {

            alert("Asset Name is required.");

            return;
        }


        if (!category) {

            alert("Category is required.");

            return;
        }


        if (!condition) {

            alert("Condition is required.");

            return;
        }


        if (!assetForm.status) {

            alert("Status is required.");

            return;
        }


        try {

            /* =================================================
               REQUIRED FIELDS
            ================================================= */

            const payload = {

                assetCode,

                name,

                category: {
                    id: Number(category),
                },

                condition,

                status:
                    assetForm.status,
            };


            /* =================================================
               OPTIONAL FIELDS

               Only add the property when it has a value.
            ================================================= */

            if (
                assetForm.brand &&
                assetForm.brand.trim()
            ) {

                payload.brand =
                    assetForm.brand.trim();
            }


            if (
                assetForm.model &&
                assetForm.model.trim()
            ) {

                payload.model =
                    assetForm.model.trim();
            }


            if (
                assetForm.serialNumber &&
                assetForm.serialNumber.trim()
            ) {

                payload.serialNumber =
                    assetForm.serialNumber.trim();
            }


            if (assetForm.purchaseDate) {

                payload.purchaseDate =
                    assetForm.purchaseDate;
            }


            if (
                assetForm.purchasePrice !== "" &&
                assetForm.purchasePrice !== null &&
                assetForm.purchasePrice !== undefined
            ) {

                payload.purchasePrice =
                    Number(
                        assetForm.purchasePrice
                    );
            }


            if (assetForm.warrantyEndDate) {

                payload.warrantyEndDate =
                    assetForm.warrantyEndDate;
            }


            if (
                assetForm.location &&
                assetForm.location.trim()
            ) {

                payload.location =
                    assetForm.location.trim();
            }


            if (
                assetForm.description &&
                assetForm.description.trim()
            ) {

                payload.description =
                    assetForm.description.trim();
            }


            /* =================================================
               DEBUG
            ================================================= */

            console.log(
                "Asset payload:",
                payload
            );


            /* =================================================
               CREATE / UPDATE
            ================================================= */

            if (editingAsset) {

                await AssetService.update(
                    editingAsset.id,
                    payload
                );

                alert(
                    "Asset updated successfully!"
                );

            } else {

                await AssetService.create(
                    payload
                );

                alert(
                    "Asset created successfully!"
                );
            }


            /* =================================================
               RESET
            ================================================= */

            setShowAssetModal(false);

            setEditingAsset(null);

            setAssetForm({
                ...emptyAsset
            });


            await loadAssets();


        } catch (error) {

            console.error(
                "Asset save error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to save asset."
            );
        }
    };


    /* =========================================================
       DELETE ASSET
    ========================================================= */

    const handleDeleteAsset = async (id) => {

        const asset =
            assets.find(
                (item) =>
                    item.id === id
            );

        if (!asset) return;


        const confirmed =
            window.confirm(
                `Delete "${asset.name}"?`
            );


        if (!confirmed) return;


        try {

            await AssetService.delete(id);

            alert(
                "Asset deleted successfully!"
            );

            await loadAssets();

        } catch (error) {

            console.error(
                "Delete asset error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete asset."
            );
        }
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
       ADD CATEGORY
    ========================================================= */

    const handleAddCategory = () => {

        setEditingCategory(null);

        setCategoryForm({
            ...emptyCategory,
        });

        setShowCategoryModal(true);
    };


    /* =========================================================
       EDIT CATEGORY
    ========================================================= */

    const handleEditCategory = (
        category
    ) => {

        setEditingCategory(category);

        setCategoryForm({

            name:
                category.name || "",

            description:
                category.description || "",

            status:
                category.status || "Active",
        });

        setShowCategoryModal(true);
    };


    /* =========================================================
       CREATE / UPDATE CATEGORY
       
       Empty description is skipped.
    ========================================================= */

    const handleCategorySubmit = async (e) => {

        e.preventDefault();


        const name =
            categoryForm.name?.trim();

        const description =
            categoryForm.description?.trim();


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


        try {

            /* ================================================
               REQUIRED CATEGORY FIELD
            ================================================= */

            const payload = {
                name,

                status:
                    categoryForm.status ||
                    "Active",
            };


            /* ================================================
               OPTIONAL DESCRIPTION
            ================================================= */

            if (description) {

                payload.description =
                    description;
            }


            console.log(
                "Category payload:",
                payload
            );


            /* ================================================
               CREATE / UPDATE
            ================================================= */

            if (editingCategory) {

                await AssetCategoryService.update(
                    editingCategory.id,
                    payload
                );

                alert(
                    "Category updated successfully!"
                );

            } else {

                await AssetCategoryService.create(
                    payload
                );

                alert(
                    "Category created successfully!"
                );
            }


            setShowCategoryModal(false);

            setEditingCategory(null);

            setCategoryForm({
                ...emptyCategory
            });


            await loadCategories();

            await loadAssets();


        } catch (error) {

            console.error(
                "Category save error:",
                error
            );

            console.error(
                "Backend response:",
                error.response?.data
            );

            alert(
                error.response?.data?.message ||
                "Failed to save category."
            );
        }
    };


    /* =========================================================
       DELETE CATEGORY
    ========================================================= */

    const handleDeleteCategory = async (
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


        try {

            await AssetCategoryService.delete(
                category.id
            );

            alert(
                "Category deleted successfully!"
            );

            await loadCategories();

        } catch (error) {

            console.error(
                "Delete category error:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Failed to delete category."
            );
        }
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


    /* =========================================================
       CLOSE ASSET MODAL
    ========================================================= */

    const closeAssetModal = () => {

        setShowAssetModal(false);

        setEditingAsset(null);

        setAssetForm({
            ...emptyAsset
        });
    };


    /* =========================================================
       CLOSE CATEGORY MODAL
    ========================================================= */

    const closeCategoryModal = () => {

        setShowCategoryModal(false);

        setEditingCategory(null);

        setCategoryForm({
            ...emptyCategory
        });
    };


    /* =========================================================
       LOADING
    ========================================================= */

    if (
        loadingAssets &&
        loadingCategories
    ) {

        return (
            <MainLayout
                activePage="Assets"
                title="Assets"
            >

                <div className="assets-page">

                    <div className="page-loading">

                        <div className="loading-spinner" />

                        <h3>
                            Loading Asset Management...
                        </h3>

                        <p>
                            Please wait while we load your assets and categories.
                        </p>

                    </div>

                </div>

            </MainLayout>
        );
    }


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
                        onClick={
                            handleAddAsset
                        }
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
                    MANAGEMENT GRID
                ================================================= */}

                <div className="management-grid">


                    {/* =================================================
                        ASSETS
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


                        {/* SEARCH */}

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


                        {/* TABLE */}

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

                                    {loadingAssets ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="empty-cell"
                                            >
                                                Loading assets...
                                            </td>

                                        </tr>

                                    ) : filteredAssets.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="6"
                                                className="empty-cell"
                                            >

                                                <div className="empty-content">

                                                    <div>
                                                        <Package size={25} />
                                                    </div>

                                                    <strong>
                                                        No assets found
                                                    </strong>

                                                    <span>
                                                        Try another search or category.
                                                    </span>

                                                </div>

                                            </td>

                                        </tr>

                                    ) : (

                                        filteredAssets.map(
                                            (asset) => {

                                                const categoryName =
                                                    getAssetCategoryName(
                                                        asset
                                                    );

                                                return (

                                                    <tr
                                                        key={
                                                            asset.id
                                                        }
                                                    >

                                                        <td>

                                                            <div className="asset-cell">

                                                                <div>

                                                                    <strong>
                                                                        {
                                                                            asset.name
                                                                        }
                                                                    </strong>

                                                                    <span>
                                                                        {
                                                                            asset.assetCode
                                                                        }
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <div className="table-category">

                                                                <div
                                                                    className={`category-icon ${getCategoryClass(
                                                                        categoryName
                                                                    )}`}
                                                                >
                                                                    {
                                                                        getCategoryIcon(
                                                                            categoryName
                                                                        )
                                                                    }
                                                                </div>

                                                                <span>
                                                                    {
                                                                        categoryName
                                                                    }
                                                                </span>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <span className="location">

                                                                {
                                                                    asset.location ||
                                                                    "-"
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <span
                                                                className={`status ${(asset.status || "Inactive")
                                                                    .toLowerCase()
                                                                    .replace(
                                                                        " ",
                                                                        "-"
                                                                    )}`}
                                                            >

                                                                <i />

                                                                {
                                                                    asset.status ||
                                                                    "-"
                                                                }

                                                            </span>

                                                        </td>


                                                        <td>

                                                            <strong className="value">

                                                                $
                                                                {Number(
                                                                    asset.purchasePrice || 0
                                                                ).toLocaleString()}

                                                            </strong>

                                                        </td>


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
                                                                    <Eye size={15} />
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
                                                                    <Pencil size={15} />
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
                                                                    <Trash2 size={15} />
                                                                </button>

                                                            </div>

                                                        </td>

                                                    </tr>

                                                );
                                            }
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
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {assets.length}
                            </strong>

                            {" "}assets

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


                        <div className="category-list">

                            {loadingCategories ? (

                                <div className="category-empty">

                                    <div className="loading-spinner" />

                                    <strong>
                                        Loading categories...
                                    </strong>

                                </div>

                            ) : filteredCategories.length === 0 ? (

                                <div className="category-empty">

                                    <Tag size={25} />

                                    <strong>
                                        No categories found
                                    </strong>

                                    <span>
                                        Create your first category.
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
                                                        <Eye size={15} />
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
                                                        <Pencil size={15} />
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
                                                        <Trash2 size={15} />
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
                                </strong>

                                {" "}categories

                            </span>


                            <span>

                                {
                                    assets.length
                                }

                                {" "}total assets

                            </span>

                        </div>

                    </section>

                </div>


                {/* =================================================
                    ASSET MODAL
                ================================================= */}

                {showAssetModal && (

                    <div
                        className="modal-overlay"
                        onClick={closeAssetModal}
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
                                        <Package size={20} />
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
                                    type="button"
                                    className="close-modal"
                                    onClick={closeAssetModal}
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


                                    {/* ASSET CODE */}

                                    <div className="form-group">

                                        <label>
                                            Asset Code <span className="required">*</span>
                                        </label>

                                        <input
                                            name="assetCode"
                                            value={
                                                assetForm.assetCode
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="AST-006"
                                            required
                                        />

                                    </div>


                                    {/* ASSET NAME */}

                                    <div className="form-group">

                                        <label>
                                            Asset Name <span className="required">*</span>
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
                                            required
                                        />

                                    </div>


                                    {/* CATEGORY */}

                                    <div className="form-group">

                                        <label>
                                            Category <span className="required">*</span>
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
                                                required
                                            >

                                                <option value="">
                                                    Select Category
                                                </option>

                                                {categories.map(
                                                    (category) => (

                                                        <option
                                                            key={
                                                                category.id
                                                            }
                                                            value={
                                                                category.id
                                                            }
                                                        >
                                                            {
                                                                category.name
                                                            }
                                                        </option>

                                                    )
                                                )}

                                            </select>

                                            <ChevronDown size={16} />

                                        </div>

                                    </div>


                                    {/* BRAND */}

                                    <div className="form-group">

                                        <label>
                                            Brand
                                        </label>

                                        <input
                                            name="brand"
                                            value={
                                                assetForm.brand
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="Dell"
                                        />

                                    </div>


                                    {/* MODEL */}

                                    <div className="form-group">

                                        <label>
                                            Model
                                        </label>

                                        <input
                                            name="model"
                                            value={
                                                assetForm.model
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="Latitude 5420"
                                        />

                                    </div>


                                    {/* SERIAL NUMBER */}

                                    <div className="form-group">

                                        <label>
                                            Serial Number
                                        </label>

                                        <input
                                            name="serialNumber"
                                            value={
                                                assetForm.serialNumber
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="SN123456"
                                        />

                                    </div>


                                    {/* LOCATION */}

                                    <div className="form-group">

                                        <label>
                                            Location
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


                                    {/* VALUE */}

                                    <div className="form-group">

                                        <label>
                                            Value ($)
                                        </label>

                                        <input
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            name="purchasePrice"
                                            value={
                                                assetForm.purchasePrice
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="1200"
                                        />

                                    </div>


                                    {/* PURCHASE DATE */}

                                    <div className="form-group">

                                        <label>
                                            Purchase Date
                                        </label>

                                        <input
                                            type="date"
                                            name="purchaseDate"
                                            value={
                                                assetForm.purchaseDate
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                        />

                                    </div>


                                    {/* WARRANTY END DATE */}

                                    <div className="form-group">

                                        <label>
                                            Warranty End Date
                                        </label>

                                        <input
                                            type="date"
                                            name="warrantyEndDate"
                                            value={
                                                assetForm.warrantyEndDate
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                        />

                                    </div>


                                    {/* CONDITION */}

                                    <div className="form-group">

                                        <label>
                                            Condition <span className="required">*</span>
                                        </label>

                                        <div className="select-container">

                                            <select
                                                name="condition"
                                                value={
                                                    assetForm.condition
                                                }
                                                onChange={
                                                    handleAssetChange
                                                }
                                                required
                                            >

                                                <option value="">
                                                    Select Condition
                                                </option>

                                                <option value="GOOD">
                                                    Good
                                                </option>

                                                <option value="FAIR">
                                                    Fair
                                                </option>

                                                <option value="POOR">
                                                    Poor
                                                </option>

                                                <option value="DAMAGED">
                                                    Damaged
                                                </option>

                                            </select>

                                            <ChevronDown size={16} />

                                        </div>

                                    </div>


                                    {/* STATUS */}

                                    <div className="form-group">

                                        <label>
                                            Status <span className="required">*</span>
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
                                                required
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

                                            <ChevronDown size={16} />

                                        </div>

                                    </div>


                                    {/* DESCRIPTION */}

                                    <div className="form-group form-full">

                                        <label>
                                            Description
                                        </label>

                                        <textarea
                                            name="description"
                                            value={
                                                assetForm.description
                                            }
                                            onChange={
                                                handleAssetChange
                                            }
                                            placeholder="Asset description..."
                                            rows="3"
                                        />

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={closeAssetModal}
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
                    CATEGORY MODAL
                ================================================= */}

                {showCategoryModal && (

                    <div
                        className="modal-overlay"
                        onClick={closeCategoryModal}
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
                                        <Tag size={20} />
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
                                    type="button"
                                    className="close-modal"
                                    onClick={closeCategoryModal}
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
                                        {
                                            getCategoryIcon(
                                                categoryForm.name
                                            )
                                        }
                                    </div>

                                    <div>

                                        <strong>
                                            Category Preview
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
                                        Category Name <span className="required">*</span>
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
                                        required
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


                                <div className="form-group">

                                    <label>
                                        Status
                                    </label>

                                    <div className="select-container">

                                        <select
                                            name="status"
                                            value={
                                                categoryForm.status
                                            }
                                            onChange={
                                                handleCategoryChange
                                            }
                                        >

                                            <option value="Active">
                                                Active
                                            </option>

                                            <option value="Inactive">
                                                Inactive
                                            </option>

                                        </select>

                                        <ChevronDown size={16} />

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
                                        className="secondary-btn"
                                        onClick={closeCategoryModal}
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
                    ASSET VIEW
                ================================================= */}

                {showAssetView &&
                    selectedAsset && (

                        <div
                            className="modal-overlay"
                            onClick={() =>
                                setShowAssetView(false)
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
                                            <Eye size={20} />
                                        </div>

                                        <div>

                                            <h3>
                                                Asset Details
                                            </h3>

                                            <p>
                                                View complete asset information.
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
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
                                            getAssetCategoryName(
                                                selectedAsset
                                            )
                                        )}`}
                                    >
                                        {
                                            getCategoryIcon(
                                                getAssetCategoryName(
                                                    selectedAsset
                                                )
                                            )
                                        }
                                    </div>


                                    <h2>
                                        {
                                            selectedAsset.name ||
                                            "-"
                                        }
                                    </h2>

                                    <span className="view-code">
                                        {
                                            selectedAsset.assetCode ||
                                            "-"
                                        }
                                    </span>


                                    <div className="view-status">

                                        <span
                                            className={`status ${(selectedAsset.status || "")
                                                .toLowerCase()
                                                .replace(
                                                    " ",
                                                    "-"
                                                )}`}
                                        >

                                            <i />

                                            {
                                                selectedAsset.status ||
                                                "-"
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
                                                    getAssetCategoryName(
                                                        selectedAsset
                                                    )
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Location
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.location ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Brand
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.brand ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Model
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.model ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Serial Number
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.serialNumber ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Condition
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.condition ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Purchase Date
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.purchaseDate ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Warranty End
                                            </span>

                                            <strong>
                                                {
                                                    selectedAsset.warrantyEndDate ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Value
                                            </span>

                                            <strong>
                                                {selectedAsset.purchasePrice !== null &&
                                                    selectedAsset.purchasePrice !== undefined &&
                                                    selectedAsset.purchasePrice !== ""
                                                    ? `$${Number(
                                                        selectedAsset.purchasePrice
                                                    ).toLocaleString()}`
                                                    : "-"
                                                }
                                            </strong>

                                        </div>

                                    </div>


                                    {selectedAsset.description && (

                                        <div className="category-view-description">

                                            <strong>
                                                Description
                                            </strong>

                                            <p>
                                                {
                                                    selectedAsset.description
                                                }
                                            </p>

                                        </div>

                                    )}

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
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
                                        type="button"
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

                                        <Pencil size={15} />

                                        Edit Asset

                                    </button>

                                </div>

                            </div>

                        </div>

                    )}


                {/* =================================================
                    CATEGORY VIEW
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
                                            <Tag size={20} />
                                        </div>

                                        <div>

                                            <h3>
                                                Category Details
                                            </h3>

                                            <p>
                                                View category information.
                                            </p>

                                        </div>

                                    </div>


                                    <button
                                        type="button"
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
                                            selectedCategory.name ||
                                            "-"
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
                                            Assets in this category
                                        </span>

                                    </div>


                                    <div className="details-grid">

                                        <div>

                                            <span>
                                                Status
                                            </span>

                                            <strong>
                                                {
                                                    selectedCategory.status ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>


                                        <div>

                                            <span>
                                                Category ID
                                            </span>

                                            <strong>
                                                {
                                                    selectedCategory.id ||
                                                    "-"
                                                }
                                            </strong>

                                        </div>

                                    </div>

                                </div>


                                <div className="modal-footer">

                                    <button
                                        type="button"
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
                                        type="button"
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

                                        <Pencil size={15} />

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