import { showToast } from "../../../utils/toastUtils";
import { useState, useEffect } from "react"; // Importar useEffect
import { createUser, updateUser } from "../../../service/LoginService"; // Asumir que existe updateUser
import {
  InputSelect,
  OneInputProps,
} from "../../../components/ContainerInputs"; 
import type { User } from "../../../types"; // Importar el tipo User

const roles = [
  { value: "Administrador", label: "Rol de Administrador" },
  { value: "Morosidad", label: "Trabajar exclusivamente morosidad" },
  { value: "Propiedades", label: "Trabajar exclusivamente propiedades" },
  { value: "EnviosDeMensajes", label: "Poder exclusivamente enviar mensajes" },
];

const activoOptions = [
  { value: "true", label: "Activo" },
  { value: "false", label: "Inactivo" },
];

// Definición de Props extendida
interface UserCreateProps {
  userToEdit: User | null;
  onClearEdit: () => void; // Función para notificar a AdminView que borre el usuario a editar
  onUserAction: () => void; // Función para recargar la lista de usuarios después de crear/editar
}

// Cambiamos 'label' por el objeto completo 'UserToEdit' y la función de limpiar
export default function UserCreate({ userToEdit, onClearEdit, onUserAction }: UserCreateProps) {
  const [isConsulting, setIsConsulting] = useState(false);

  // Determinar el modo: true si se está editando un usuario
  const isEditing = !!userToEdit;

  // 1. Estados iniciales (Función para limpiar)
  const cleanState = () => {
    setNombre("");
    setCorreo("");
    setClave("");
    setRol([]);
    setActivo([]);
    // Si estamos editando, también notificamos al padre (AdminView) para que regrese al modo Crear
    if (isEditing) {
      onClearEdit();
    }
  };

  const [rol, setRol] = useState<string[]>([]);
  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [activo, setActivo] = useState<string[]>([]);


  // 2. useEffect para cargar los datos del usuario a editar
  useEffect(() => {
    if (userToEdit) {
      // Modo Edición: Cargar datos
      setNombre(userToEdit.Nombre);
      setCorreo(userToEdit.Correo);
      setClave(""); // La clave casi nunca se precarga por seguridad. El usuario debe ingresarla al editar si es necesario.
      setRol([userToEdit.Rol]);
      // Convertir el booleano 'Activo' a string para el Select
      setActivo([userToEdit.Activo ? "true" : "false"]);
    } else {
      // Modo Creación: Limpiar campos
      cleanState();
    }
  }, [userToEdit]); // Ejecutar cuando userToEdit cambie

  // 3. Modificación de la función de validación
  const validateForm = () => {
    // a. Validación de campos vacíos. La clave solo es obligatoria en modo CREACIÓN.
    if (!nombre || !correo || rol.length === 0 || (!isEditing && !clave)) {
      showToast(
        "error",
        "Todos los campos son obligatorios (Nombre, Correo y Rol). La Contraseña es obligatoria en Creación."
      );
      return false;
    }
    
    // El campo Activo es obligatorio en modo EDICIÓN.
    if (isEditing && activo.length === 0) {
        showToast("error", "Debe seleccionar un estado (Activo/Inactivo) al editar.");
        return false;
    }

    // c. Validación de Correo BÁSICA
    if (!correo.includes("@") || !correo.includes(".")) {
      showToast("error", "Por favor, ingrese un Correo electrónico válido.");
      return false;
    }

    // d. Validación de un único rol
    if (rol.length !== 1) {
      showToast("error", "Debe seleccionar un único Rol.");
      return false;
    }

    return true;
  };

  // 4. Modificación del Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; 
    }

    setIsConsulting(true);

    try {
      if (isEditing && userToEdit) {
        // --- Modo Edición ---
        const body = { 
          // Asumimos que la función de edición requiere el ID y el nuevo estado Activo
          id: userToEdit.id, 
          Nombre: nombre, 
          Correo: correo, 

          // Si clave no está vacía, la enviamos para cambiarla, sino, la omitimos (o enviamos la antigua si el backend lo requiere). 
          // Por simplicidad, la incluimos si no está vacía. Si está vacía, asumimos que no cambia.
          Clave: clave || userToEdit.Clave, 
          Rol: rol[0],
          Activo: activo[0] === 'true', // Enviar Activo como booleano
        };

        // Asume que updateUser existe en tu servicio
        const response = await updateUser(body);
        if (response) {
          showToast("success", "Usuario actualizado exitosamente");
        }
      } else {
        // --- Modo Creación ---
        const body = { 
          Nombre: nombre, 
          Correo: correo, 
          Clave: clave, 
          Rol: rol[0] 
        };
        const response = await createUser(body);
        if (response) {
          showToast("success", "Usuario creado exitosamente");
        }
      }
      
      cleanState(); // Limpiar formulario y resetear a modo Creación
      onUserAction(); // Recargar la lista en AdminView

    } catch (error) {
      showToast("error", "Ocurrió un error al procesar la acción.");
    } finally {
      setIsConsulting(false);
    }
  };
  
  // 5. Textos dinámicos
  const title = isEditing ? `Editando Usuario: ${userToEdit?.Nombre}` : "Creación de un nuevo Usuario";
  const subtitle = isEditing ? "Modifique los campos necesarios para actualizar el usuario" : "Ingrese los datos del nuevo usuario";
  const buttonText = isEditing ? "Guardar Cambios" : "Crear Usuario";
  const clearButtonText = isEditing ? "Cancelar Edición / Crear Nuevo" : "Limpiar Campos";

  return (
    <div className=" flex flex-col items-center w-full gap-6 p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col w-[90%] lg:w-[50%] border-2 border-principal rounded-2xl shadow-xl p-6"
      >
        <h1 className="text-xl text-principal font-bold">
          {title} 
        </h1>
        <h2 className="text-sm text-gray-500">
          {subtitle}
        </h2>

        {/* --- Select de Roles --- */}
        <InputSelect
          label="Rol del Usuario (Seleccione uno)"
          options={roles}
          selectedValues={rol}
          onChangeValues={setRol}
          placeholder="Seleccione un único rol..."
          isMulti={false}
        />
        
        {/* --- Campo Nombre --- */}
        <OneInputProps
          label="Nombre del usuario"
          value={nombre}
          onChange={setNombre}
          placeholder="Ingrese el nombre del usuario"
        />

        {/* --- Campo Correo --- */}
        <OneInputProps
          label="Correo Electrónico"
          value={correo}
          onChange={setCorreo}
          placeholder="Ingrese el correo electrónico"
        />

        {/* --- Campo Clave (Se mantiene el tipo password) --- */}
        <OneInputProps
          label={`Contraseña ${isEditing ? "(Dejar vacío para no cambiar)" : ""}`}
          value={clave}
          onChange={setClave}
          placeholder={isEditing ? "Ingrese nueva clave o deje vacío" : "Ingrese la contraseña"}
          type="password"
        />


        {/* --- Select de Estado (Solo visible/habilitado en modo Edición) --- */}
        {isEditing && (
            <InputSelect
                label="Estado del Usuario"
                options={activoOptions}
                selectedValues={activo}
                onChangeValues={setActivo}
                placeholder="Seleccione un estado..."
                isMulti={false}
            />
        )}

        {/* --- Botones --- */}
        <div className="flex items-center justify-end w-full gap-5">
          <button
            type="submit"
            disabled={isConsulting}
            className={`p-3 text-white rounded-md font-bold transition duration-300
              ${isConsulting ? "bg-gray-400 cursor-not-allowed" : "bg-principal hover:bg-principal-dark"}`}
          >
            {isConsulting ? (isEditing ? "Guardando..." : "Creando Usuario...") : buttonText}
          </button>

          <button
            type="button"
            className="p-3 text-principal rounded-md font-bold hover:bg-gray-300 transition duration-300"
            onClick={cleanState} // Llama a la nueva función cleanState
          >
            {clearButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}