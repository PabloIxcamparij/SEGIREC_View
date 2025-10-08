import { showToast } from "../../../utils/toastUtils";
import { useState } from "react";
import { createUser } from "../../../service/LoginService";
import {
  InputSelect,
  OneInputProps,
} from "../../../components/ContainerInputs"; // Asumiendo que esta es la ruta a tu componente

const roles = [
  { value: "Administrador", label: "Rol de Administrador" },
  { value: "Morosidad", label: "Trabajar exclusivamente morosidad" },
  { value: "Propiedades", label: "Trabajar exclusivamente propiedades" },
  { value: "EnviosDeMensajes", label: "Poder exclusivamente enviar mensajes" },
];

export default function UserCreate() {
  const [isConsulting, setIsConsulting] = useState(false);

  // 1. Estado para los campos del formulario

  const [rol, setRol] = useState<string[]>([]);
  const [nombre, setNombre] = useState<string>("");
  const [correo, setCorreo] = useState<string>("");
  const [clave, setClave] = useState<string>("");

  // 4. Función de validación
  const validateForm = () => {
    // a. Validación de campos vacíos (todos deben estar llenos)
    if (!nombre || !correo || !clave || !rol) {
      showToast(
        "error",
        "Todos los campos son obligatorios. Por favor, llénelos todos."
      );
      return false;
    }

    // c. Validación de Correo BÁSICA
    if (!correo.includes("@") || !correo.includes(".")) {
      showToast("error", "Por favor, ingrese un Correo electrónico válido.");
      return false;
    }

    // d. Validación de un único rol (ya está cubierto por la lógica en handleRoleChange, pero se verifica)
    if (rol.length !== 1) {
      showToast("error", "Debe seleccionar un único Rol.");
      return false;
    }

    return true;
  };

  // 5. Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Detener si la validación falla
    }

    setIsConsulting(true);

    try {
      const response = await createUser({ Nombre: nombre, Clave: clave, Correo: correo, Rol: rol[0] });
      if (response) {
        showToast("success", "Usuario creado exitosamente");
      }
    } catch (error) {
      // Manejo de errores que pudieran no ser capturados en LoginService
      showToast("error", "Ocurrió un error inesperado.");
    } finally {
      setIsConsulting(false);
    }
  };

  return (
    <div className="flex flex-col items-center w-full gap-6 p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col w-[90%] lg:w-[50%] border-2 border-principal rounded-2xl shadow-xl p-6"
      >
        <h1 className="text-xl text-principal font-bold">
          Creación de un nuevo Usuario
        </h1>
        <h2 className="text-sm text-gray-500">
          Ingrese los datos del nuevo usuario
        </h2>
        
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

        {/* --- Campo Clave --- */}
        <OneInputProps
          label="Contraseña"
          value={clave}
          onChange={setClave}
          placeholder="Ingrese la contraseña"
          type="password"
        />

        {/* --- Select de Roles --- */}
        <InputSelect
          label="Rol del Usuario (Seleccione uno)"
          options={roles}
          selectedValues={rol}
          onChangeValues={setRol}
          placeholder="Seleccione un único rol..."
          isMulti={false}
        />

        {/* --- Botón de Enviar --- */}
        <button
          type="submit"
          disabled={isConsulting}
          className={`w-full p-3 text-white rounded-md font-bold transition duration-300 
            ${
              isConsulting
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-principal hover:bg-principal-dark"
            }`}
        >
          {isConsulting ? "Creando Usuario..." : "Crear Usuario"}
        </button>
      </form>
    </div>
  );
}
