import Papa from "papaparse";
import * as ExcelJS from "exceljs";
import { useState } from "react";
import { useSendMessageContext } from "../context/SendMessageContext";

export function useArchiveRead() {
  const { handleQueryPropiedadesByArchive } = useSendMessageContext();  
  const [archivo, setArchivo] = useState<File | null>(null);
  const [nombreArchivo, setNombreArchivo] = useState("Seleccionar archivo...");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setArchivo(file);

      setNombreArchivo(file.name);
    } else {
      setNombreArchivo("Seleccionar archivo...");
    }
  };

  const procesarCSV = (file: File) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        const datos = result.data as Record<string, string>[];
        const Cedulas = datos
          .map((row) => row["Cedula"] || row["cedula"])
          .filter(Boolean);
        handleQueryPropiedadesByArchive(Cedulas);
      },
    });
  };

  const procesarExcel = async (file: File) => {
    const data = await file.arrayBuffer();
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.load(data);
    const sheet = workbook.worksheets[0];

    const Cedulas: string[] = [];

    let cedulaColumnIndex: number | null = null;
    const firstRow = sheet.getRow(1); // Asume que la primera fila son las cabeceras

    if (firstRow) {
      firstRow.eachCell((cell, colNumber) => {
        const cellValue = String(cell.value).trim().toLowerCase();
        if (cellValue === "cedula") {
          cedulaColumnIndex = colNumber;
        }
      });
    }

    if (cedulaColumnIndex === null) {
      console.error("No se encontró la columna 'Cedula' en el archivo.");
      return;
    }

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber > 1) {
        const cedulaCell = row.getCell(cedulaColumnIndex!);
        const cedulaValue = String(cedulaCell.value);
        if (cedulaValue) {
          Cedulas.push(cedulaValue);
        }
      }
    });

    handleQueryPropiedadesByArchive(Cedulas);
  };

  return {
    archivo,
    nombreArchivo,
    handleFileChange,
    procesarCSV,
    procesarExcel,
  };
}
