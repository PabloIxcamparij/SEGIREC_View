import axios from "axios";

const BASE_URL = "http://localhost:4040/message";
const token = localStorage.getItem("AuthToken");

export const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
});
