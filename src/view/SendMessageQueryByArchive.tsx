import { useEffect, useState } from "react";
import { useArchiveRead } from "../hooks/useArchiveRead";
import { useSendMessageContext } from "../context/SendMessageContext";
import ButtonsSendsMessage from "../components/ButtonsSendsMessage";
import TablePeople from "../components/TablePeople";
import { showToast } from "../utils/toastUtils";

export default function SendMessageQueryByArchive() {
  const { personas, handleLimpiar } = useSendMessageContext();
  const { archivo, nombreArchivo, handleFileChange, procesarCSV, procesarExcel } = useArchiveRead();

  const [isConsultando, setIsConsultando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultando(true);

    try {
      if (!archivo) {
      showToast("warn", "Advertencia", "No se ha cargado un archivo");
      return;
    }
      const extension = archivo.name.split(".").pop()?.toLowerCase();

      if (extension === "csv") {
        procesarCSV(archivo);
      } else if (extension === "xlsx" || extension === "xls") {
        await procesarExcel(archivo);
      } else {
      showToast("error", "Error", "Formato de archivo no soportado");
      }
    } catch (error) {
    showToast("error", "Error en lectura", String(error));
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
