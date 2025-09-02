import { showToast } from "./toastUtils";

export function errorHandler(error: any, contexto: string): null {
  const mensaje =
    error.response?.data?.error ||
    error.response?.statusText ||
    error.message ||
    "Error desconocido";

  showToast("error", "Error en consulta", mensaje);
  console.error(`Error en ${contexto}:`, mensaje, error.response?.data);

  return null;
}
