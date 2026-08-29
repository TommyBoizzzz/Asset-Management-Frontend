import axios from "axios";
import BASE_URL from "../../../config/global";

const API_URL = `${BASE_URL}/api/asset-assignments`;

const AssetAssignmentService = {
    // Get all assignments
    getAll: () => {
        return axios.get(API_URL);
    },

    // Get assignment by ID
    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    // Get assignments by asset
    getByAsset: (assetId) => {
        return axios.get(`${API_URL}/asset/${assetId}`);
    },

    // Get assignments by staff
    getByStaff: (staffId) => {
        return axios.get(`${API_URL}/staff/${staffId}`);
    },

    // Get assignments by status (e.g. ACTIVE, RETURNED)
    getByStatus: (status) => {
        return axios.get(`${API_URL}/status/${status}`);
    },

    // Create assignment
    create: (assignment) => {
        return axios.post(API_URL, assignment);
    },

    // Update assignment
    update: (id, assignment) => {
        return axios.put(`${API_URL}/${id}`, assignment);
    },

    // Return asset (conditionAfter / notes are query params on the backend)
    returnAsset: (id, conditionAfter, notes) => {
        const params = new URLSearchParams();

        if (conditionAfter) {
            params.append("conditionAfter", conditionAfter);
        }

        if (notes) {
            params.append("notes", notes);
        }

        const query = params.toString();

        return axios.put(
            `${API_URL}/${id}/return${query ? `?${query}` : ""}`
        );
    },

    // Delete assignment
    delete: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
};

export default AssetAssignmentService;