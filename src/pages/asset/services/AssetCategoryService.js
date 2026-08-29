import axios from "axios";
import BASE_URL from "../../../config/global";

const CATEGORY_API_URL = `${BASE_URL}/api/asset-categories`;

const AssetCategoryService = {
    getAll: () => {
        return axios.get(CATEGORY_API_URL);
    },

    getById: (id) => {
        return axios.get(`${CATEGORY_API_URL}/${id}`);
    },

    create: (category) => {
        return axios.post(CATEGORY_API_URL, category);
    },

    update: (id, category) => {
        return axios.put(`${CATEGORY_API_URL}/${id}`, category);
    },

    delete: (id) => {
        return axios.delete(`${CATEGORY_API_URL}/${id}`);
    },
};

export default AssetCategoryService;