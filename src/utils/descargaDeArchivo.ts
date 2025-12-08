// =============================================================
//      EXPORTAR CSV UNIVERSAL (Consultas y Envíos) - MODIFICADO
// =============================================================

import {
  normalizarCorreo,
  normalizarTelefono,
} from "../utils/formatearFiltros";
// Función para aplanar objetos complejos en strings legibles
export function flattenObjectForCSV(obj: any): any {
  if (!obj || typeof obj !== "object") return obj;

  if (Array.isArray(obj)) {
    // Para arrays, crear un string legible
    return obj
      .map((item) => {
        if (typeof item === "object") {
          return JSON.stringify(item).replace(/,/g, "; ");
        }
        return String(item);
      })
      .join(" | ");
  }

  // Para objetos simples, convertirlos a JSON string
  return JSON.stringify(obj);
}

// Función para procesar consultas antes de exportar
export function processConsultaForCSV(consulta: any) {
  return {
    id: consulta.id,
    IdUsuario: consulta.IdUsuario,
    Tipo: consulta.Tipo,
    Detalle: consulta.Detalle,
    Estado: consulta.Estado,
    createdAt: consulta.createdAt,
    updatedAt: consulta.updatedAt,
    // Aplanar objeto Filtros
    Filtros: consulta.Filtros ? JSON.stringify(consulta.Filtros) : "",
    FiltrosAplicados: consulta.Filtros?.FiltrosAplicados || "",
    // Aplanar objeto Usuario
    NombreUsuario: consulta.Usuario?.Nombre || "",
    CorreoUsuario: consulta.Usuario?.Correo || "",
  };
}

// Función para procesar envíos antes de exportar
export function processEnvioForCSV(envio: any) {
  // Formatear DetalleIndividual como string legible
  let detalleIndividualFormatted = "";
  if (
    envio.Envios?.DetalleIndividual &&
    Array.isArray(envio.Envios.DetalleIndividual)
  ) {
    detalleIndividualFormatted = envio.Envios.DetalleIndividual.map(
      (d: any) => {
        const nombre = d.nombre || "Sin nombre";
        const cedula = d.cedula || "Sin cédula";
        const correo = normalizarCorreo(d.correo) || "Sin correo";
        const telefono = normalizarTelefono(d.telefono) || "Sin teléfono";
        const correoOk = d.correo_ok ? "✓" : "✗";
        const whatsappOk = d.whatsapp_ok ? "✓" : "✗";

        return `${nombre} (${cedula}) - ${correo} | ${telefono} | Correo:${correoOk} | WhatsApp:${whatsappOk}`;
      }
    ).join("; ");
  }

  return {
    id: envio.id,
    IdUsuario: envio.IdUsuario,
    Tipo: envio.Tipo,
    Detalle: envio.Detalle,
    Estado: envio.Estado,
    createdAt: envio.createdAt,
    updatedAt: envio.updatedAt,
    // Usar flattenObjectForCSV para objetos complejos
    Envios: flattenObjectForCSV(envio.Envios),
    NumeroDeMensajes: envio.Envios?.NumeroDeMensajes || 0,
    NumeroDeCorreosEnviadosCorrectamente:
      envio.Envios?.NumeroDeCorreosEnviadosCorrectamente || 0,
    NumeroDeWhatsAppEnviadosCorrectamente:
      envio.Envios?.NumeroDeWhatsAppEnviadosCorrectamente || 0,
    DetalleIndividual: detalleIndividualFormatted,
    // Usar flattenObjectForCSV para objetos complejos
    NombreUsuario: envio.Usuario?.Nombre || "",
    CorreoUsuario: envio.Usuario?.Correo || "",
  };
}

export function downloadCSV(
  filename: string,
  rows: any[],
  isConsulta: boolean = false
) {
  if (!rows.length) {
    alert("No hay registros para descargar");
    return;
  }

  // Procesar las filas según el tipo
  const processedRows = rows.map((row) =>
    isConsulta ? processConsultaForCSV(row) : processEnvioForCSV(row)
  );

  const header = Object.keys(processedRows[0]);

  // Crear contenido CSV con encoding adecuado para caracteres especiales
  const csvContent = [
    // Encabezado con BOM para caracteres especiales
    "\uFEFF" + header.join(","),
    ...processedRows.map((row) =>
      header
        .map((key) => {
          const value = (row as any)[key] ?? "";
          // Escapar comillas y saltos de línea para CSV
          const escaped = String(value).replace(/"/g, '""');
          // Poner entre comillas si contiene comas, saltos de línea o comillas
          return /[,"\n\r]/.test(escaped) ? `"${escaped}"` : escaped;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
