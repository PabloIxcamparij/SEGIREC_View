import { showToast } from "./toastUtils";

// Manejador de errores para capturar y mostrar mensajes de error
export function errorHandler(error: any, contexto: string): null {
  const mensaje =
    error.response?.data?.error ||
    error.response?.statusText ||
    error.message ||
    "Error desconocido";

  showToast("error", "Error en consulta", error.response.data.message);
  console.error(`Error en ${contexto}:`, mensaje, error.response?.data);
  return null;
}
