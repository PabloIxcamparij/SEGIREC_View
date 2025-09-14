import axios from "axios";
import { showToast } from "../utils/toastUtils";

const BASE_URL = "http://localhost:4040/auth";

  // Body esperado: { Nombre: string; Clave: string }
export async function login(body: { Nombre: string; Clave: string }) {
  try {
    const { data } = await axios.post(`${BASE_URL}/login`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return data; // { message: "Login successful" }
  } catch (error: any) {
    showToast("error", "Error en login", String(error));
    throw error;
  }
}
