import axios from "axios";

const BASE_URL = "https://silver-tribble-9779qq49gwjr276w4-4040.app.github.dev/auth";

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
