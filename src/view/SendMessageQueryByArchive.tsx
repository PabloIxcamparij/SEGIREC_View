import { useEffect, useState } from "react";
import Papa from "papaparse";
import * as ExcelJS from "exceljs";
import { useSendMessageContext } from "../context/SendMessageContext";
import ButtonsSendsMessage from "../components/ButtonsSendsMessage";
import TablePeople from "../components/TablePeople";

export default function SendMessageQueryByArchive() {
  const { personas, handleQueryPersonByArchive, handleLimpiar } =
    useSendMessageContext();

  const [archivo, setArchivo] = useState<File | null>(null);
  const [isConsultando, setIsConsultando] = useState(false);

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
        handleQueryPersonByArchive(Cedulas);
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

    handleQueryPersonByArchive(Cedulas);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultando(true);

    try {
      if (!archivo) {
        console.warn("No se ha cargado un archivo.");
        return;
      }

      const extension = archivo.name.split(".").pop()?.toLowerCase();

      if (extension === "csv") {
        procesarCSV(archivo);
      } else if (extension === "xlsx" || extension === "xls") {
        await procesarExcel(archivo);
      } else {
        console.error("Formato de archivo no soportado");
      }
    } catch (error) {
      console.error("Error en handleSubmit:", error);
    } finally {
      setIsConsultando(false);
    }
  };

  // Limpiar y desmontar al salir de la pagina
  useEffect(() => {
    return () => {
      handleLimpiar();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-10 p-4">
      <div className="flex flex-col justify-center items-center text-wrap p-4 w-full sm:w-4/5 md:w-3/5 shadow-xl bg-gray-200 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-principal">
          Buscar por archivo
        </h1>
        <h2 className="text-1xl mb-4 text-center text-gray-500">
          Suba un archivo (.csv o .xlsx) para realizar la consulta a la base de
          datos
        </h2>

        <div
          className={`relative w-4/5 xl:w-3/5 p-2 border-2 border-dashed border-white rounded-xl 
    ${archivo ? "bg-principal" : "bg-black/60"}
  `}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center p-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-18 w-18 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mt-2 text-xl text-white font-semibold">
              {nombreArchivo}
            </span>
            <p className="text-xs text-gray-300 mt-1">
              Arrastre y suelte un archivo aquí o haga clic para seleccionar
            </p>
          </label>
        </div>
      </div>

      <ButtonsSendsMessage
        handleSubmit={handleSubmit}
        isConsultando={isConsultando}
      />

      {personas.length > 0 && <TablePeople />}
    </div>
  );
}
