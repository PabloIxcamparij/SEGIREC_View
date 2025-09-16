// src/utils/axiosClient.ts
import axios from "axios";

// Creación de una instancia de axios con configuraciones predeterminadas
export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
