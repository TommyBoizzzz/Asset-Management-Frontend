import axios from "axios";
import BASE_URL from "../../../config/global";

const LOGIN_API_URL = `${BASE_URL}/api/users/login`;

const LoginService = {
    login: (credentials) => {
        return axios.post(LOGIN_API_URL, credentials);
    },
};

export default LoginService;