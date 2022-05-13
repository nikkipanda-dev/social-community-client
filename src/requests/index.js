import axios from "axios";

export const axiosInstance = axios.create({
    // timeout: 1000,
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'multipart/form-data',
    },
});