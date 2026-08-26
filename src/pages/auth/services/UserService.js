import axios from "axios";
import BASE_URL from "../../../config/global";

const API_URL = `${BASE_URL}/api/users`;

const UserService = {

    // GET ALL USERS
    getAll: () => {
        return axios.get(API_URL);
    },


    // GET USER BY ID
    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },

    // CREATE USER
    create: (user) => {
        return axios.post(API_URL, user);
    },


    // UPDATE USER
    update: (id, user) => {
        return axios.put(`${API_URL}/${id}`, user);
    },


    // DELETE USER
    delete: (id) => {
        return axios.delete(`${API_URL}/${id}`);
    },

};

export default UserService;