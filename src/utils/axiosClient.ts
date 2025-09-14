// src/utils/axiosClient.ts
import axios from "axios";

const BASE_URL = "http://localhost:4040/message";

export const axiosClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Añade un interceptor de solicitudes
axiosClient.interceptors.request.use(
    (config) => {
        // Obtén el token del localStorage justo antes de cada solicitud
        const token = localStorage.getItem("AuthToken");

        // Si el token existe, agrégalo al encabezado de la solicitud
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);