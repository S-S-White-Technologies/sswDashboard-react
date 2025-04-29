import axios from "axios";
import config from "../config"; // adjust if path different

const api = axios.create({
    baseURL: config.api.API_URL, // ✅ pulling your API_URL
    headers: {
        "Content-Type": "application/json",
    },
});

export default api;