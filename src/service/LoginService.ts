import axios from "axios";
import { showToast } from "../utils/toastUtils";

const BASE_URL = "http://localhost:4040/auth";

// Body esperado: { Nombre: string; Clave: string }
export async function login(body: { Nombre: string; Clave: string }) {
  try {
    const { data } = await axios.post(`${BASE_URL}/login`, body, {
      headers: { "Content-Type": "application/json" },
      withCredentials: true,
    });
    return data;
  } catch (error: any) {
    showToast("error", "Error en login", String(error));
    throw error;
  }
}

export async function logout() {
  try {
    await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      }
    );
    showToast("info", "Cierre de sesión exitoso");
  } catch (error: any) {
    showToast("error", "Error en logout", String(error));
    throw error;
  }
}

export async function checkAuth() {
  try {
    const response = await axios.get(`${BASE_URL}/verify`, {
      withCredentials: true,
    });
    return response.status === 200;
  } catch (error) {
    console.log("checkAuth error:", error);
    return false;
  }
}
