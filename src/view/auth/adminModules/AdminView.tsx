import {
  getUsers,
  deleteUser,
  getUserById,
  // Asumiendo que updateUser existe
} from "../../../service/LoginService"; 
import type { User } from "../../../types";
import { useEffect, useState } from "react";
import UserCreate from "./UserCreate";

export default function AdminView() {
  const [users, setUsers] = useState<User[]>([]);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  // Función para obtener usuarios
  const fetchUsers = async () => {
    const usersData = await getUsers();
    setUsers(usersData);
  };
  
  // Función para recargar datos y resetear formulario
  const handleUserActionComplete = () => {
    fetchUsers(); // Recarga la lista
    setUserToEdit(null); // Asegura que el formulario esté en modo Creación
  }

  useEffect(() => {
    fetchUsers();
  }, []); // Se ejecuta solo al montar el componente

  const handlerDeleteUser = async (id: number) => {
    await deleteUser(id);
    setUsers(users.filter((user) => user.id !== id));
  };

  const handlerEditUser = async (id: number) => {
    // 1. Obtener los datos del usuario
    const user = await getUserById(id);
    // 2. Cargar los datos en el estado del formulario de edición
    setUserToEdit(user); 
    // Opcional: Desplazarse al formulario
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Función para pasar a UserCreate y que este pueda limpiar su estado de edición
  const handleClearEdit = () => {
      setUserToEdit(null);
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      
      {/* Pasar el usuario a editar y los handlers */}
      <UserCreate 
        userToEdit={userToEdit}
        onClearEdit={handleClearEdit}
        onUserAction={handleUserActionComplete}
      />
      
      {/* ---------------------------------------------------- */}

      <h2>Administración de Usuarios</h2>
      <div className="overflow-x-auto w-full md:w-4/5 lg:w-[80%] bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
        <table className="w-full text-center border-collapse gap-2">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Activo</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>{user.Nombre}</td>
                <td>{user.Correo}</td>
                <td>{user.Rol}</td>
                <td>{user.Activo ? "Sí" : "No"}</td>
                <td className="flex gap-2 justify-center">
                  <button
                    className="text-blue-500 px-3 py-1 hover:bg-blue-500/20 rounded-2xl cursor-pointer"
                    onClick={() => handlerEditUser(user.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-500 px-3 py-1 hover:bg-red-500/20 rounded-2xl cursor-pointer"
                    onClick={() => handlerDeleteUser(user.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}