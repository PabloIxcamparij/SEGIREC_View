import { axiosClient } from "../utils/axiosClient";
import { errorHandler } from "../utils/errorHandler";

// Inicia la sesión del usuario
// Retorna los datos del usuario y un token de sesión
export async function login(body: { Nombre: string; Clave: string }) {
  try {
    const { data } = await axiosClient.post("/auth/login", body);
    return data;
  } catch (error: any) {
    errorHandler(error, "Inicio de sesión");
  }
}

// Cierra la sesión del usuario
// Se borran las cookies de sesión en el servidor
export async function logout() {
  try {
    const { data } = await axiosClient.post("/auth/logout");
    return data;
  } catch (error: any) {
    errorHandler(error, "Cierre de sesión");
  }
}

export const verifyRol = async (rol: string): Promise<boolean> => {
  try {
    const { data } = await axiosClient.get(`/auth/verifyRol?rol=${rol}`);
    return data;
  } catch (error) {
    errorHandler(error, "Chequeo de administrador");
    return false;
  }
};
