import axios from "axios";
import BASE_URL from "../../../config/global";

const API_URL = `${BASE_URL}/api/users`;

const UserService = {
    // Get all users
    getAll: () => {
        return axios.get(API_URL);
    },

    // Get user by ID
    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    // Create user
    create: (user) => {
        return axios.post(API_URL, user);
    },

    // Update user
    update: (id, user) => {
        return axios.put(`${API_URL}/${id}`, user);
    },

    // Delete user
    delete: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },

    // Login
    login: (credentials) => {
        return axios.post(`${API_URL}/login`, credentials);
    },
};

export default UserService;