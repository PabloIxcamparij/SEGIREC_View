import { showToast } from "../../utils/toastUtils";
import { useState, useEffect } from "react"; 
import { createUser, updateUser } from "../../service/Admin.service";
import {
  InputSelect,
  OneInputProps,
} from "../../components/ContainerInputs";
import type { User } from "../../types";

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
  onClearEdit: () => void;
  onUserAction: () => void;
}

export default function UserCreate({
  userToEdit,
  onClearEdit,
  onUserAction,
}: UserCreateProps) {
  const [isConsulting, setIsConsulting] = useState(false);

  const isEditing = !!userToEdit;

  // ESTADOS
  const [rol, setRol] = useState<string[]>([]); // Sigue siendo un array para el Select
  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [clave, setClave] = useState<string>("");
  const [activo, setActivo] = useState<string[]>([]);

  // 1. FUNCIÓN DE LIMPIEZA
  const cleanState = () => {
    setNombre("");
    setCorreo("");
    setClave("");
    setRol([]); // Limpiar roles seleccionados
    setActivo([]);
    if (isEditing) {
      onClearEdit();
    }
  };

  // 2. useEffect para cargar los datos del usuario a editar
  useEffect(() => {
    if (userToEdit) {
      // Modo Edición: Cargar datos
      setNombre(userToEdit.Nombre);
      setCorreo(userToEdit.Correo);
      setClave(""); 
      
      // CAMBIO CLAVE: Cargar roles desde el string (separado por ';')
      const userRolesArray = userToEdit.Rol.split(';').filter(r => r.trim() !== '');
      setRol(userRolesArray);
      
      setActivo([userToEdit.Activo ? "true" : "false"]);
    } else {
      // Modo Creación: Limpiar campos
      cleanState();
    }
  }, [userToEdit]);

  // FUNCIÓN PARA MANEJAR EL CAMBIO DE ROL CON LÓGICA DE EXCEPCIÓN
  const handleRolChange = (newRoles: string[]) => {
    // Si la nueva selección incluye 'Administrador', el array final solo debe contener 'Administrador'.
    if (newRoles.includes("Administrador")) {
      setRol(["Administrador"]);
      showToast("info", "El rol 'Administrador' otorga acceso total y es exclusivo.");
    } else {
      // Si no se seleccionó 'Administrador', se acepta la selección completa.
      setRol(newRoles);
    }
  };

  // 3. Modificación de la función de validación
  const validateForm = () => {
    // Validación de campos vacíos.
    if (!nombre || !correo || rol.length === 0 || (!isEditing && !clave)) {
      showToast(
        "error",
        "Todos los campos son obligatorios (Nombre, Correo y Rol). La Contraseña es obligatoria en Creación."
      );
      return false;
    }

    // El campo Activo es obligatorio en modo EDICIÓN.
    if (isEditing && activo.length === 0) {
      showToast(
        "error",
        "Debe seleccionar un estado (Activo/Inactivo) al editar."
      );
      return false;
    }

    // Validación de Correo BÁSICA
    if (!correo.includes("@") || !correo.includes(".")) {
      showToast("error", "Por favor, ingrese un Correo electrónico válido.");
      return false;
    }

    // Validación de longitud de Clave (solo si se ingresó o es Creación)
    if (clave) {
      if (clave.length < 6) {
        showToast("error", "La Contraseña debe tener al menos 6 caracteres.");
        return false;
      }
      if (clave.length > 12) {
        showToast("error", "La Contraseña no debe exceder los 12 caracteres.");
        return false;
      }
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

    // CAMBIO CLAVE: Convertir el array de roles a un string separado por ;
    const rolString = rol.join(';');

    try {
      if (isEditing && userToEdit) {
        // --- Modo Edición ---
        const body = {
          id: userToEdit.id,
          Nombre: nombre,
          Correo: correo,
          Clave: clave || userToEdit.Clave,
          // CAMBIO: Enviar el string de roles
          Rol: rolString, 
          Activo: activo[0] === "true", 
        };

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
          // CAMBIO: Enviar el string de roles
          Rol: rolString, 
        };
        const response = await createUser(body);
        if (response) {
          showToast("success", "Usuario creado exitosamente");
        }
      }

      cleanState(); 
      onUserAction(); 
    } catch (error) {
      showToast("error", "Ocurrió un error al procesar la acción.");
    } finally {
      setIsConsulting(false);
    }
  };

  // 5. Textos dinámicos (Sin cambios)
  const title = isEditing
    ? `Editando Usuario: ${userToEdit?.Nombre}`
    : "Creación de un nuevo Usuario";
  const subtitle = isEditing
    ? "Modifique los campos necesarios para actualizar el usuario"
    : "Ingrese los datos del nuevo usuario";
  const buttonText = isEditing ? "Guardar Cambios" : "Crear Usuario";
  const clearButtonText = isEditing
    ? "Cancelar Edición / Crear Nuevo"
    : "Limpiar Campos";

  return (
    <div className=" flex flex-col items-center w-full gap-6 p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col w-[90%] lg:w-[50%] border-2 border-principal rounded-2xl shadow-xl p-6"
      >
        <h1 className="text-xl text-principal font-bold">{title}</h1>
        <h2 className="text-sm text-gray-500">{subtitle}</h2>

        {/* --- Select de Roles (CAMBIADO) --- */}
        <InputSelect
          label="Rol(es) del Usuario"
          options={roles}
          selectedValues={rol}
          // CAMBIO: Usar la función de manejo con lógica de exclusividad
          onChangeValues={handleRolChange} 
          placeholder="Seleccione uno o más roles..."
          isMulti={true} // AGREGADO: Habilitar selección múltiple
        />

        {/* ... Resto de Inputs (Sin cambios) ... */}
        
        <OneInputProps
          label="Nombre del usuario"
          value={nombre}
          onChange={setNombre}
          placeholder="Ingrese el nombre del usuario"
        />

        <OneInputProps
          label="Correo Electrónico"
          value={correo}
          onChange={setCorreo}
          placeholder="Ingrese el correo electrónico"
        />

        <OneInputProps
          label={`Contraseña ${
            isEditing ? "(Dejar vacío para no cambiar)" : ""
          }`}
          value={clave}
          onChange={setClave}
          placeholder={
            isEditing
              ? "Ingrese nueva clave o deje vacío"
              : "Ingrese la contraseña"
          }
          type="password"
        />

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
              ${
                isConsulting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-principal hover:bg-principal-dark"
              }`}
          >
            {isConsulting
              ? isEditing
                ? "Guardando..."
                : "Creando Usuario..."
              : buttonText}
          </button>

          <button
            type="button"
            className="p-3 text-principal rounded-md font-bold hover:bg-gray-300 transition duration-300"
            onClick={cleanState}
          >
            {clearButtonText}
          </button>
        </div>
      </form>
    </div>
  );
}