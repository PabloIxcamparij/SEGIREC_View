import { useEffect, useState } from "react";
import { getUsers, deleteUser, getUserById } from "../../service/Admin.service";
import type { User } from "../../types";
import UserCreate from "./UserCreate";
import ModalConfirmacion from "../../components/ModalConfirmacion";

export default function AdminView() {
  const [users, setUsers] = useState<User[]>([]);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  //Modal
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const abrirModal = (id: number) => {
    setUserIdToDelete(id); // Guarda el ID del usuario
    setModalOpen(true);
  };

  // Función para obtener usuarios
  const fetchUsers = async () => {
    const usersData = await getUsers();
    setUsers(usersData);
  };

  // Función para recargar datos y resetear formulario
  const handleUserActionComplete = () => {
    fetchUsers(); // Recarga la lista
    setUserToEdit(null); // Asegura que el formulario esté en modo Creación
  };

  useEffect(() => {
    fetchUsers();
  }, []); // Se ejecuta solo al montar el componente

  //Eliminar usuario
  const handlerDeleteUser = async () => {
    if (userIdToDelete === null) return; // Seguridad

    await deleteUser(userIdToDelete);
    setUsers(users.filter((user) => user.id !== userIdToDelete));
    setUserIdToDelete(null); // Limpiar el estado después de eliminar
  };

  // Editar usuario
  const handlerEditUser = async (id: number) => {
    // 1. Obtener los datos del usuario
    const user = await getUserById(id);
    // 2. Cargar los datos en el estado del formulario de edición
    setUserToEdit(user);
    // Opcional: Desplazarse al formulario
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Función para pasar a UserCreate y que este pueda limpiar su estado de edición
  const handleClearEdit = () => {
    setUserToEdit(null);
  };

  return (
    <>
      <ModalConfirmacion
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handlerDeleteUser}
        titulo="Eliminacion de un usuario"
        mensaje="Confirme la eliminacion del usuario, esta accion no se puede deshacer."
        bottonText="Confirmar eliminacion"
      />
      <div className="flex flex-col items-center gap-6 p-4">
        <div className="bg-white border-2 border-principal overflow-x-auto w-full md:w-4/5 lg:w-[80%] backdrop-blur-md rounded-2xl shadow-xl p-8">
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
              {users && users.length > 0 ? (
                users.map((user) => (
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
                        onClick={() => abrirModal(user.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                // Manejo de estado: si no hay usuarios o está cargando (si añades estado de carga)
                <tr>
                  <td colSpan={5}>
                    No hay usuarios para mostrar o la información está cargando.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <UserCreate
          userToEdit={userToEdit}
          onClearEdit={handleClearEdit}
          onUserAction={handleUserActionComplete}
        />
      </div>
    </>
  );
}
