import axios from "axios";
import BASE_URL from "../../../config/global";

const API_URL = `${BASE_URL}/api/roles`;

const RoleService = {

    // GET ALL ROLES
    getAll: () => {
        return axios.get(API_URL);
    },


    // GET ROLE BY ID
    getById: (id) => {
        return axios.get(`${API_URL}/${id}`);
    },


    // CREATE ROLE
    create: (role) => {
        return axios.post(API_URL, role);
    },


    // UPDATE ROLE
    update: (id, role) => {
        return axios.put(
            `${API_URL}/${id}`,
            role
        );
    },


    // DELETE ROLE
    delete: (id) => {
        return axios.delete(
            `${API_URL}/${id}`
        );
    },

};

export default RoleService;