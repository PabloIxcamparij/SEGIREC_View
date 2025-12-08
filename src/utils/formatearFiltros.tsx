// -------------------------------------------------------------
// UTILIDADES PARA NORMALIZAR DATOS EXPORTADOS - EMAIL & TELÉFONO
// -------------------------------------------------------------

/**
 * Normaliza un correo electrónico que provenga de Excel.
 * Excel puede representar un correo como:
 *
 *  1) Un string simple: "correo@example.com"
 *  2) Un objeto: { text: "correo@example.com", hyperlink: undefined, richText: [...] }
 *
 * Esta función detecta ambos casos y siempre retorna un string limpio.
 */
export function normalizarCorreo(valor: any): string {
  if (!valor) return "";

  // Caso 1: El correo ya es un string simple
  if (typeof valor === "string") return valor.trim();

  // Caso 2: ExcelJS devuelve un objeto richText
  if (typeof valor === "object") {
    // Si tiene la propiedad "text" (común en celdas con vínculos)
    if (valor.text) return String(valor.text).trim();

    // Si tiene richText, extraemos sus partes
    if (Array.isArray(valor.richText)) {
      return valor.richText
        .map((t: any) => t.text || "")
        .join("")
        .trim();
    }
  }

  // Valor inesperado → lo convertimos a string
  return String(valor).trim();
}

/**
 * Normaliza un teléfono que venga de Excel en formato extraño.
 * Puede venir como número, string, objeto o incluso con decimales.
 */
export function normalizarTelefono(valor: any): string {
  if (!valor) return "";

  // Si es un número → convertir a string sin formato raro
  if (typeof valor === "number") {
    return Math.trunc(valor).toString(); // elimina decimales tipo 88885555.0
  }

  // Si es string → dejarlo tal cual
  if (typeof valor === "string") return valor.trim();

  // Si Excel lo envía como objeto
  if (typeof valor === "object") {
    if (valor.text) return String(valor.text).trim();
  }

  return String(valor).trim();
}


// =============================================================
//    FUNCIONES AUXILIARES (FORMATEADORES / PARSEADORES)
// =============================================================

/**
 * Formatea el texto de filtros que se guarda como string.
 * Lo convierte en una lista visual.
 */
export const formatearFiltros = (texto?: string) => {
  if (!texto) return "Sin filtros";

  const limpio = texto
    .replace("Se hizo uso de los siguientes filtros:", "")
    .trim();

  const partes = limpio
    .split("•")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <ul className="text-left whitespace-pre-wrap break-words">
      {partes.map((parte, i) => (
        <li key={i} className="leading-snug mb-1">
          • {parte}
        </li>
      ))}
    </ul>
  );
};

/**
 * Formatea el JSON de registros individuales dentro de los envíos.
 * Integra uso de normalización de correo y teléfono.
 */
export function formatearDetalleIndividual(detalles: any) {
  if (!detalles || detalles.length === 0)
    return <p className="text-gray-400 text-sm">Sin registros</p>;

  return (
    <ul className="space-y-1">
      {detalles.map((d: any, i: number) => (
        <li key={i} className="border-b border-gray-200 pb-1">
          {/* Nombre + cédula */}
          <span>Cedula: {d.cedula}</span>
          <br />

          {/* Línea compacta con correo/wa + estado */}
          <span className="text-xs">
            {normalizarCorreo(d.correo)} | {normalizarTelefono(d.telefono)} |{" "}
            {d.correo_ok ? "Correo✓" : "Correo×"} |{" "}
            {d.whatsapp_ok ? "Whatsapp✓" : "Whatsapp×"}
          </span>
        </li>
      ))}
    </ul>
  );
}
