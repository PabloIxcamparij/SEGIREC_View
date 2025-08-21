import { useState } from "react";
import { useSendMessage } from "../hooks/useSendMessage";

const provincias = ["Bagaces", "Fortuna", "Mogote", "Río Naranjo"];
const servicios = ["Electricidad", "Agua", "Internet"];

export default function SendFilteredEmailsView() {
  const {
    ciudad,
    setCiudad,
    servicio,
    setServicio,
    valor,
    setValor,
    valorTipo,
    setValorTipo,
    personas,
    mensaje,
    handleConsultar,
    handleEnviar,
    handleLimpiar,
  } = useSendMessage();

  const [isConsultando, setIsConsultando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsultando(true);
    await handleConsultar(e); // asumimos que tu hook soporta async
    setIsConsultando(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full sm:w-4/5 md:w-3/5 shadow-xl rounded-2xl p-6 space-y-6"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-principal">
          Enviar correos
        </h1>

        {/* Ciudad */}
        <select
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
        >
          <option value="">Seleccione Distrito</option>
          {provincias.map((prov) => (
            <option key={prov} value={prov}>
              {prov}
            </option>
          ))}
        </select>

        {/* Servicio */}
        <select
          value={servicio}
          onChange={(e) => setServicio(e.target.value)}
          className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
        >
          <option value="">Seleccione Servicio</option>
          {servicios.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* Valor */}
        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="border p-2 rounded flex-1 w-full focus:ring-2 focus:ring-principal outline-none"
            placeholder="Valor"
          />
          <select
            value={valorTipo}
            onChange={(e) => setValorTipo(e.target.value as any)}
            className="border p-2 rounded w-full sm:w-32 focus:ring-2 focus:ring-principal outline-none"
          >
            <option value="Nah">Nah</option>
            <option value="Mayor">Mayor</option>
            <option value="Menor">Menor</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex flex-wrap justify-end gap-2">
          <button
            type="submit"
            disabled={isConsultando}
            className="bg-principal text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-60"
          >
            {isConsultando ? "Consultando..." : "Consultar"}
          </button>

          <button
            type="button"
            onClick={handleLimpiar}
            className="border hover:bg-gray-800 hover:text-white px-4 py-2 rounded"
          >
            Limpiar
          </button>

          <button
            type="button"
            disabled={personas.length === 0}
            onClick={handleEnviar}
            className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:text-gray-600"
          >
            Enviar Mensaje
          </button>
        </div>
      </form>

      {/* Tabla */}
      {personas.length > 0 && (
        <div className="flex flex-col mt-10 bg-white shadow-xl rounded-2xl w-full sm:w-4/5 md:w-3/5 p-4 gap-4">
          <h1 className="text-xl font-bold">Resultados</h1>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="p-2 border">Correo</th>
                  <th className="p-2 border">Ciudad</th>
                  <th className="p-2 border">Servicio</th>
                  <th className="p-2 border">Deuda</th>
                </tr>
              </thead>
              <tbody>
                {personas.map((p, idx) => (
                  <tr
                    key={idx}
                    className="text-center hover:bg-gray-50 transition"
                  >
                    <td className="p-2 border">{p.correo}</td>
                    <td className="p-2 border">{p.ciudad}</td>
                    <td className="p-2 border">{p.servicio}</td>
                    <td className="p-2 border">{p.valorDeLaDeuda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            type="button"
            onClick={handleLimpiar}
            className="border hover:bg-gray-800 hover:text-white px-4 py-2 rounded self-end"
          >
            Limpiar
          </button>
        </div>
      )}

      {mensaje && (
        <p className="mt-6 font-medium text-center text-principal">{mensaje}</p>
      )}
    </div>
  );
}
