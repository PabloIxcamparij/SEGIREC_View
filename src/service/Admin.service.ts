import { axiosClient } from "../utils/axiosClient";
import { errorHandler } from "../utils/errorHandler";

// Crea un nuevo usuario
export async function createUser(body: {
  Nombre: string;
  Correo: string;
  Clave: string;
  Rol: string;
}) {
  try {
    const { data } = await axiosClient.post("/admin/createUser", body);
    return data;
  } catch (error: any) {
    errorHandler(error, "Registro de usuario");
  }
}

// Elimina un usuario por su ID
export async function deleteUser(id: number) {
  try {
    const { data } = await axiosClient.delete("/admin/deleteUser", {
      data: { id },
    });
    return data;
  } catch (error: any) {
    errorHandler(error, "Eliminación de usuario");
  }
}

// Obtiene la lista de usuarios del sistema
export async function getUsers() {
  try {
    const { data } = await axiosClient.get("/admin/getUsers");
    return data.users;
  } catch (error: any) {
    errorHandler(error, "Obtención de usuarios");
  }
}

// Obtiene un usuario por su ID
export async function getUserById(id: number) {
  try {
    const { data } = await axiosClient.get(`/admin/getUserById/${id}`);
    return data.user;
  } catch (error: any) {
    errorHandler(error, "Obtención de usuario por ID");
  }
}

// Actualiza un usuario por su ID
export async function updateUser(body: {
  id: number;
  Nombre: string;
  Correo: string;
  Rol: string;
  Activo: boolean;
}) {
  try {
    const { data } = await axiosClient.put(
      `/admin/updateUser/${body.id}`,
      body
    );
    return data;
  } catch (error: any) {
    errorHandler(error, "Actualización de usuario");
  }
}

export async function getReports() {
  try {
    const data = await axiosClient.get("/admin/reporte");
    return data;
  } catch (error: any) {
    errorHandler(error, "Actualización de usuario");
  }
}
