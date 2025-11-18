import { showToast } from "./toastUtils";

/**
 * Manejo de errores
 * @param error 
 * @param contexto 
 * @returns 
 */
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

/**
 * Manejo de errrores para uso exclusivo de la confirmacion de codigo
 * @param error 
 * @returns 
 */
export function priorityErrorHandler(
  error: any,
): { message: string; attemptsRemaining: number | null } {

  const message =
    error.response?.data?.error ||
    error.response?.statusText ||
    error.message ||
    "Error desconocido";

  const attemptsRemaining =
    error.response?.data?.attemptsRemaining ?? null;

  showToast("error", "Error en operación de prioridad", message);

  return {
    message,
    attemptsRemaining,
  };
}
