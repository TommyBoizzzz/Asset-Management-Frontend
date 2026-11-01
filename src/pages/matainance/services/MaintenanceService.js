import axios from "axios";
import BASE_URL from "../../../config/global";

const MAINTENANCE_API_URL = `${BASE_URL}/api/maintenance`;

const MaintenanceService = {
    getAll: () => {
        return axios.get(MAINTENANCE_API_URL);
    },

    getById: (id) => {
        return axios.get(`${MAINTENANCE_API_URL}/${id}`);
    },

    getByAsset: (assetId) => {
        return axios.get(`${MAINTENANCE_API_URL}/asset/${assetId}`);
    },

    getByStaff: (staffId) => {
        return axios.get(`${MAINTENANCE_API_URL}/staff/${staffId}`);
    },

    getByStatus: (status) => {
        return axios.get(`${MAINTENANCE_API_URL}/status/${status}`);
    },

    create: (maintenance) => {
        return axios.post(MAINTENANCE_API_URL, maintenance);
    },

    update: (id, maintenance) => {
        return axios.put(`${MAINTENANCE_API_URL}/${id}`, maintenance);
    },

    complete: (id, maintenance) => {
        return axios.put(`${MAINTENANCE_API_URL}/${id}/complete`, maintenance);
    },

    delete: (id) => {
        return axios.delete(`${MAINTENANCE_API_URL}/${id}`);
    },
};

export default MaintenanceService;
