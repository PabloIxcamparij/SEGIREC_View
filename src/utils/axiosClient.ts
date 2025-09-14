// src/utils/axiosClient.ts
import axios from "axios";

const BASE_URL = "http://localhost:4040/message";

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});