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

// Crea un nuevo usuario
export async function createUser(body: { Nombre: string; Correo: string; Clave: string; Rol: string; }) {
  try {
    const { data } = await axiosClient.post("/auth/register", body);
    return data;
  } catch (error: any) {
    errorHandler(error, "Registro de usuario");
  }
}

// Elimina un usuario por su ID
export async function deleteUser(id: number) {
  try {
    const { data } = await axiosClient.delete("/auth/deleteUser", { data: { id } });
    return data;
  } catch (error: any) {
    errorHandler(error, "Eliminación de usuario");
  }
}

// Obtiene la lista de usuarios del sistema
export async function getUsers() {
  try {
    const { data } = await axiosClient.get("/auth/getUsers");
    return data.users;
  } catch (error: any) {
    errorHandler(error, "Obtención de usuarios");
  }
}

// Obtiene un usuario por su ID
export async function getUserById(id: number) {
  try {
    const { data } = await axiosClient.get(`/auth/getUserById/${id}`);
    return data.user; // <- ya que en el backend devuelves { user }
  } catch (error: any) {
    errorHandler(error, "Obtención de usuario por ID");
  }
}

// Actualiza un usuario por su ID
export async function updateUser(body: { id: number; Nombre: string; Correo: string; Rol: string; Activo: boolean; }) {
  try {
    const { data } = await axiosClient.put(`/auth/updateUser/${body.id}`, body);
    return data;
  } catch (error: any) {
    errorHandler(error, "Actualización de usuario");
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

// Verifica si el usuario tiene una sesión activa
// Retorna true si la sesión es válida, false en caso contrario
export async function checkAuth() {
  try {
    const { data } = await axiosClient.get("/auth/verify");
    return data;
  } catch (error) {
    errorHandler(error, "Chequeo de sesión");
    return false;
  }
}
