// useArchiveRead.ts
import * as ExcelJS from "exceljs";
import { useState, useCallback } from "react";
import { useSendMessageContext } from "../context/SendMessageContext";

import type { Persona } from "../types"; // Importar el tipo Persona
import { showToast } from "../utils/toastUtils";

/**
 * Objeto de mapeo para traducir los nombres de las columnas del archivo Excel
 * a los nombres de las propiedades del objeto Persona.
 * * Clave: Nombre de la columna en el archivo Excel (Header).
 * Valor: Nombre de la propiedad en el objeto Persona.
 */
const COLUMN_TO_PERSONA_MAP: Record<string, keyof Persona> = {
  "cp.CEDULA": "cedula",
  "cp.NUM_PERSON": "numeroDeFinca", // Mapeo de NUM_PERSON a numeroDeFinca (Asunción)
  "cp.NOM_PERSON": "nombre",
  NOM_COMPLE: "nombre", // Usamos NOM_COMPLE como 'nombre' (si existe)
  "cp.CELULAR": "telefono", // Mapeo de CELULAR a telefono
  "cp.CORREO_ELE": "correo",
  "cp.DIRECCION1": "direccion",
  "cp.DOM_LEGAL": "direccion", // Usamos DOM_LEGAL como 'direccion' (si existe)
  DETALLE: "detalle",
};

// Array de las cabeceras que se buscarán en el archivo (las claves del mapa)
const COLUMNAS_BUSQUEDA = Object.keys(COLUMN_TO_PERSONA_MAP);

export function useArchiveRead() {
  const { setPersonas } = useSendMessageContext();
  const [archivo, setArchivo] = useState<File | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState("Seleccionar archivo...");
  const [cargando, setCargando] = useState(false);

  // ... handleFileChange (sin cambios) ...
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivo(file);
      setNombreArchivo(file.name);
      setPersonas([]); // Limpiar personas al cargar un nuevo archivo
    } else {
      setNombreArchivo("Seleccionar archivo...");
      setArchivo(null);
      setPersonas([]);
    }
  };

  const procesarExcel = useCallback(async () => {
    if (!archivo) {
      showToast("error", "No hay archivo para procesar.");
      return;
    }

    setCargando(true);
    setPersonas([]);
    try {
      const data = await archivo.arrayBuffer();
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);
      const sheet = workbook.worksheets[0];

      const personasCargadas: Persona[] = [];
      // Mapea Columna Header (string) a Índice de Columna (number)
      const columnaIndices: Record<string, number> = {};
      const firstRow = sheet.getRow(1); // Cabeceras

      if (firstRow) {
        // 1. Mapear el índice de columna por el nombre esperado
        firstRow.eachCell((cell, colNumber) => {
          const cellValue = String(cell.value).trim();
          if (COLUMNAS_BUSQUEDA.includes(cellValue)) {
            columnaIndices[cellValue] = colNumber;
          }
        });
      }

      // 2. Validar que se encuentren las columnas obligatorias
      const columnasObligatorias = ["cp.CEDULA", "cp.NOM_PERSON"]; // Columnas de Excel obligatorias
      const faltantes = columnasObligatorias.filter(
        (col) => !columnaIndices[col]
      );

      if (faltantes.length > 0) {
        throw new Error(
          `Faltan columnas obligatorias en el archivo: ${faltantes.join(", ")}`
        );
      }

      // 3. Recorrer filas y construir el objeto Persona
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber > 1) {
          // Saltar la fila de cabeceras
          const persona: Partial<Persona> = {};

          COLUMNAS_BUSQUEDA.forEach((excelKey) => {
            const colIndex = columnaIndices[excelKey];
            const personaKey = COLUMN_TO_PERSONA_MAP[excelKey];

            if (colIndex && personaKey) {
              let cellValue = row.getCell(colIndex).value;

              // Normalizar el valor a string, a menos que sea un número que se necesite como tal
              let finalValue: string | number | undefined;

              if (cellValue === null || cellValue === undefined) {
                finalValue = undefined;
              } else if (
                excelKey === "cp.NUM_PERSON" &&
                typeof cellValue === "number"
              ) {
                // Si el valor es numérico y se mapea a 'numeroDeFinca', lo guardamos como string para el type Persona.
                finalValue = String(cellValue);
              } else {
                finalValue = String(cellValue).trim();
              }

              // Asignar el valor
              if (finalValue) {
                // Si la clave de Persona ya tiene un valor (ej: cp.CELULAR vs cp.TELEFONO1), no la sobrescribimos.
                // Esto podría necesitar lógica adicional si quieres que el último gane o si prefieres una jerarquía.
                if (!persona[personaKey]) {
                  (persona as any)[personaKey] = finalValue;
                }
              }
            }
          });

          // 4. Asegurar que solo se agreguen registros con datos esenciales del Type Persona
          if (persona.cedula && persona.nombre) {
            // Se debe asignar un valor por defecto para 'distrito' si no se pudo mapear
            if (!persona.distrito) {
              persona.distrito = persona.direccion || "";
            }
            personasCargadas.push(persona as Persona);
          }
        }
      });

      setPersonas(personasCargadas);
    } catch (error) {
      showToast("error", "Error al procesar el archivo Excel:");
      setPersonas([]);
    } finally {
      setCargando(false);
    }
  }, [archivo]);

  return {
    archivo,
    nombreArchivo,
    handleFileChange,
    procesarExcel,
    cargando,
  };
}
