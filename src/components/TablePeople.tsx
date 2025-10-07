import { useSendMessageContext } from "../context/SendMessageContext";
import type { Persona } from "../types";

// 1. Definición de la estructura de la columna
interface ColumnDefinition {
  key: keyof Persona;
  header: string;
}

// Columnas base (siempre presentes)
const BASE_COLUMNS: ColumnDefinition[] = [
  { key: "cedula", header: "Cédula" },
  { key: "distrito", header: "Distrito" },
  { key: "nombre", header: "Nombre" },
];

// Columnas para el caso de Servicios
const SERVICE_COLUMNS: ColumnDefinition[] = [
  { key: "numeroDeFinca", header: "N° Finca" },
  { key: "servicio", header: "Servicio" },
  { key: "valorDeLaDeuda", header: "Deuda" },
  { key: "fechaVencimiento", header: "Vencimiento" },
];

// Columnas para el caso de Áreas
const AREA_COLUMNS: ColumnDefinition[] = [
  { key: "apellido", header: "Apellido" },
  { key: "areaDeLaPropiedad", header: "Área" },
  { key: "estadoPropiedad", header: "Estado" },
  { key: "montoImponible", header: "Monto Imponible" },
  { key: "codigoBaseImponible", header: "Código Base Imponible" },
];

/**
 * Determina el conjunto dinámico de columnas
 * según los atributos disponibles en la persona.
 */
function getDynamicColumns(person: Persona): ColumnDefinition[] {
  if (person.servicio !== undefined && person.valorDeLaDeuda !== undefined) {
    return [...BASE_COLUMNS, ...SERVICE_COLUMNS];
  }

  if (person.areaDeLaPropiedad !== undefined) {
    return [...BASE_COLUMNS, ...AREA_COLUMNS];
  }

  return BASE_COLUMNS; // fallback si no hay coincidencia
}

export default function TablePeople() {
  const { personas } = useSendMessageContext();

  if (personas.length === 0) return null;

  // Usamos la primera persona para decidir qué columnas mostrar
  const columns = getDynamicColumns(personas[0]);

  return (
    <div className="w-full md:w-4/5 lg:w-[80%] bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
      <h2 className="text-xl font-bold mb-4 text-principal flex justify-between items-center">
        Resultados
        <span className="text-sm text-black font-normal">
          Cantidad: {personas.length}
        </span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-100 text-center">
              {columns.map((col) => (
                <th key={col.key as string} className="p-2 border">
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {personas.map((p, idx) => (
              <tr
                key={idx}
                className="text-center odd:bg-white even:bg-gray-50"
              >
                {columns.map((col) => (
                  <td
                    key={`${idx}-${col.key as string}`}
                    className="p-2 border"
                  >
                    {p[col.key] !== undefined && p[col.key] !== null
                      ? String(p[col.key])
                      : "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
