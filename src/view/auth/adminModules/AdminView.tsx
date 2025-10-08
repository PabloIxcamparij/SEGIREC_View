import { getUsers, deleteUser } from "../../../service/LoginService";
import type { User } from "../../../types";
import { useEffect, useState } from "react";
import UserCreate from "./UserCreate";

export default function AdminView() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersData = await getUsers();
      setUsers(usersData);
    };

    fetchUsers();
  }, []);

  const handlerDeleteUser = async (id: number) => {
    await deleteUser(id);
    // Actualizar la lista de usuarios después de la eliminación
    setUsers(users.filter((user) => user.id !== id));
  };

  const handlerEditUser = (id: number) => {
    // Lógica para editar usuario (pendiente de implementar)
  }

  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <h2>Administración de Usuarios</h2>
      <UserCreate />
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
                  <button className="text-blue-500 px-3 py-1 hover:bg-blue-500/20 rounded-2xl cursor-pointer">
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
