// ============================================================================
// useArchiveRead.ts
// Hook para leer archivos XLSX y CSV, mapear sus columnas y convertirlos en
// un arreglo de objetos Persona. Compatible con ExcelJS y PapaParse.
// ============================================================================

import * as ExcelJS from "exceljs";
import Papa from "papaparse";
import { useState, useCallback } from "react";
import { useSendMessageContext } from "../context/SendMessageContext";

import type { Persona } from "../types";
import { showToast } from "../utils/toastUtils";

/**
 * Mapeo entre las cabeceras del archivo y las propiedades del tipo Persona.
 * La clave es el nombre EXACTO de la columna en el archivo.
 * El valor es el nombre de la propiedad en Persona.
 */
const COLUMN_TO_PERSONA_MAP: Record<string, keyof Persona> = {
  "cp.CEDULA": "cedula",
  "cp.NUM_PERSON": "numeroDeFinca",
  "cp.NOM_PERSON": "nombre",
  NOM_COMPLE: "nombre",
  "cp.CELULAR": "telefono",
  "cp.CORREO_ELE": "correo",
  "cp.DIRECCION1": "direccion",
  "cp.DOM_LEGAL": "direccion",
  DETALLE: "detalle",
};

// Cabeceras que buscamos en ambos archivos
const COLUMNAS_BUSQUEDA = Object.keys(COLUMN_TO_PERSONA_MAP);

// Columnas mínimas para aceptar un registro
const COLUMNAS_OBLIGATORIAS = ["cp.CEDULA", "cp.NOM_PERSON"];

// ============================================================================
// Detectores de tipo de archivo
// ============================================================================

const esExcel = (file: File) => file.name.toLowerCase().endsWith(".xlsx");

const esCSV = (file: File) => file.name.toLowerCase().endsWith(".csv");

// ============================================================================
// Hook principal
// ============================================================================

export function useArchiveRead() {
  const { setPersonas } = useSendMessageContext();

  const [archivo, setArchivo] = useState<File | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState("Seleccionar archivo...");
  const [cargando, setCargando] = useState(false);

  // Maneja el input type="file"
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivo(file);
      setNombreArchivo(file.name);
      setPersonas([]); // Limpia datos previos al cargar un archivo nuevo
    } else {
      setNombreArchivo("Seleccionar archivo...");
      setArchivo(null);
      setPersonas([]);
    }
  };

  // ==========================================================================
  //  Procesamiento de archivo XLSX
  // ==========================================================================

  const procesarExcel = useCallback(async () => {
    if (!archivo) {
      showToast("error", "No hay archivo para procesar.");
      return;
    }

    setCargando(true);
    setPersonas([]);

    try {
      // Leer como ArrayBuffer
      const data = await archivo.arrayBuffer();

      // Cargar workbook Excel
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(data);
      const sheet = workbook.worksheets[0];

      const personasCargadas: Persona[] = [];

      // Mapeo de nombre de columna → índice en Excel
      const columnaIndices: Record<string, number> = {};

      const firstRow = sheet.getRow(1); // Cabeceras

      // Detectar columnas presentes
      if (firstRow) {
        firstRow.eachCell((cell, colNumber) => {
          const cellValue = String(cell.value).trim();
          if (COLUMNAS_BUSQUEDA.includes(cellValue)) {
            columnaIndices[cellValue] = colNumber;
          }
        });
      }

      // Validar columnas obligatorias
      const faltantes = COLUMNAS_OBLIGATORIAS.filter(
        (col) => !columnaIndices[col]
      );

      if (faltantes.length > 0) {
        throw new Error(
          `Faltan columnas obligatorias: ${faltantes.join(", ")}`
        );
      }

      // Recorrer filas del Excel
      sheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Saltar cabecera

        const persona: Partial<Persona> = {};

        COLUMNAS_BUSQUEDA.forEach((excelKey) => {
          const colIndex = columnaIndices[excelKey];
          const personaKey = COLUMN_TO_PERSONA_MAP[excelKey];

          if (colIndex && personaKey) {
            let cellValue = row.getCell(colIndex).value;
            let finalValue: string | number | undefined;

            // --- Normalizar valores especiales de ExcelJS ---
            if (cellValue === null || cellValue === undefined) {
              finalValue = undefined;
            }
            // Si Excel devuelve un correo como Hyperlink
            else if (typeof cellValue === "object") {
              if ("text" in cellValue) {
                finalValue = String(cellValue.text).trim();
              } else if (
                "richText" in cellValue &&
                Array.isArray(cellValue.richText)
              ) {
                finalValue = cellValue.richText
                  .map((t: any) => t.text)
                  .join("")
                  .trim();
              } else {
                finalValue = String(cellValue.toString()).trim();
              }
            }
            // Si es un número (solo para NUM_PERSON)
            else if (typeof cellValue === "number") {
              finalValue = String(cellValue);
            }
            // Valor normal
            else {
              finalValue = String(cellValue).trim();
            }

            if (finalValue && !persona[personaKey]) {
              (persona as any)[personaKey] = finalValue;
            }
          }
        });

        if (persona.cedula && persona.nombre) {
          persona.distrito ||= persona.direccion || "";
          personasCargadas.push(persona as Persona);
        }
      });

      setPersonas(personasCargadas);

    } catch (error) {
      console.error(error);
      showToast("error", "Error al procesar el archivo Excel.");
      setPersonas([]);
    } finally {
      setCargando(false);
    }
  }, [archivo]);

  // ==========================================================================
  //  Procesamiento de archivo CSV
  // ==========================================================================

  const procesarCSV = useCallback(async () => {
    if (!archivo) {
      showToast("error", "No hay archivo para procesar.");
      return;
    }

    setCargando(true);
    setPersonas([]);

    try {
      // Leer archivo como texto
      const text = await archivo.text();

      // Parseo CSV con cabeceras
      const resultado = Papa.parse(text, {
        header: true,
        skipEmptyLines: true,
      });

      const personasCargadas: Persona[] = [];

      resultado.data.forEach((row: any) => {
        const persona: Partial<Persona> = {};

        // Mapear columnas
        COLUMNAS_BUSQUEDA.forEach((excelKey) => {
          if (row[excelKey] !== undefined && row[excelKey] !== null) {
            const personaKey = COLUMN_TO_PERSONA_MAP[excelKey];
            const valor = String(row[excelKey]).trim();

            if (!persona[personaKey]) {
              (persona as any)[personaKey] = valor;
            }
          }
        });

        if (persona.cedula && persona.nombre) {
          persona.distrito ||= persona.direccion || "";
          personasCargadas.push(persona as Persona);
        }
      });

      setPersonas(personasCargadas);
    } catch (error) {
      console.error(error);
      showToast("error", "Error al procesar el archivo CSV.");
      setPersonas([]);
    } finally {
      setCargando(false);
    }
  }, [archivo]);

  // ==========================================================================
  // Router: decide cómo procesar según extensión
  // ==========================================================================

  const procesarArchivo = useCallback(async () => {
    if (!archivo) {
      showToast("error", "No hay archivo para procesar.");
      return;
    }

    if (esExcel(archivo)) {
      await procesarExcel();
    } else if (esCSV(archivo)) {
      await procesarCSV();
    } else {
      showToast("error", "Formato no soportado. Solo .xlsx o .csv");
    }
  }, [archivo, procesarExcel, procesarCSV]);

  // ==========================================================================
  // Retorno del hook
  // ==========================================================================

  return {
    archivo,
    nombreArchivo,
    handleFileChange,
    procesarArchivo, // <<-- la función que procesará XLSX o CSV
    cargando,
  };
}
