import axios from "axios";
import BASE_URL from "../../../config/global";

const API_URL = `${BASE_URL}/api/staff`;

const StaffService = {
    // Get all staff
    getAll: () => {
        return axios.get(API_URL);
    },

    // Get staff by ID
    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    // Create staff
    create: (staff) => {
        return axios.post(API_URL, staff);
    },

    // Update staff
    update: (id, staff) => {
        return axios.put(`${API_URL}/${id}`, staff);
    },

    // Delete staff
    delete: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },
};

export default StaffService;