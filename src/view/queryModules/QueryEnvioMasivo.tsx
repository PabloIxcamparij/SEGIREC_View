import { useArchiveRead } from "../../hooks/useArchiveRead";

export default function QueryEnvioMasivo() {
  const { handleFileChange, nombreArchivo, archivo } = useArchiveRead();
  return (
    <div className="flex flex-col items-center w-full gap-6 p-4">
      <form
        // onSubmit={handleSubmit}
        className="space-y-4 flex flex-col w-[90%] lg:w-[50%] xl:w-[40%] border-2 border-principal rounded-2xl shadow-xl p-6"
      >
        <h1 className="text-xl text-principal font-bold">
          Cargar Archivo para Envío Masivo
        </h1>
        <h2 className="text-sm text-gray-500">
          Arrastre o seleccione el archivo que contiene los datos para el envío
          masivo de mensajes.
        </h2>
        <div
          className={`relative w-full p-2 border-2 border-dashed border-black rounded-xl 
                ${archivo ? "bg-principal" : "bg-gray-400"}`}
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
            <p className="text-xs text-white/60 mt-1">
              Arrastre y suelte un archivo aquí o haga clic para seleccionar
            </p>
          </label>
        </div>
      </form>
    </div>
  );
}
