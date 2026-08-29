import axios from "axios";
import BASE_URL from "../../../config/global";

const ASSET_API_URL = `${BASE_URL}/api/assets`;

const AssetService = {
    getAll: () => {
        return axios.get(ASSET_API_URL);
    },

    getById: (id) => {
        return axios.get(`${ASSET_API_URL}/${id}`);
    },

    getByStatus: (status) => {
        return axios.get(`${ASSET_API_URL}/status/${status}`);
    },

    getByCategory: (categoryId) => {
        return axios.get(`${ASSET_API_URL}/category/${categoryId}`);
    },

    create: (asset) => {
        return axios.post(ASSET_API_URL, asset);
    },

    update: (id, asset) => {
        return axios.put(`${ASSET_API_URL}/${id}`, asset);
    },

    delete: (id) => {
        return axios.delete(`${ASSET_API_URL}/${id}`);
    },
};

export default AssetService;