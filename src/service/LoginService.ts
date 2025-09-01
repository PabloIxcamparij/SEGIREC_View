import axios from "axios";

const BASE_URL = "http://localhost:4040/auth";

// Body esperado: { correo: string, password: string }
export async function login(body: { correo: string; password: string }) {
  try {
    const { data } = await axios.post(`${BASE_URL}/login`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return data; // { message: "Login successful" }
  } catch (error: any) {
    console.error("Error en login:", error.response?.data || error.message);
    throw error;
  }
}
