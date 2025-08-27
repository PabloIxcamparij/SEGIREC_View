// src/view/SendFilteredEmailsView.tsx
import { useState } from "react";
import { useSendMessage } from "../hooks/useSendMessage";
import type { QueryBody } from "../types";

const distritos = ["Bagaces", "Fortuna", "Mogote", "Río Naranjo"];
const servicios = ["Electricidad", "Agua", "Internet"];

export default function SendFilteredEmailsView() {
  const {
    ciudad,
    setCiudad,
    servicio,
    setServicio,
    deudaMinima,
    setDeudaMinima,
    deudaMaxima,
    setDeudaMaxima,
    personas,
    handleConsultar,
    handleEnviar,
    handleLimpiar,
  } = useSendMessage();

  const [isConsultando, setIsConsultando] = useState(false);

  const [filtrosActivos, setFiltrosActivos] = useState({
    ciudad: false,
    servicio: false,
    deuda: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (filtrosActivos.deuda) {
      if (deudaMinima === "" || deudaMaxima === "") {
        alert("Por favor, ingrese ambos valores de deuda.");
        return;
      }
      if (Number(deudaMinima) > Number(deudaMaxima)) {
        alert("El valor mínimo de deuda no puede ser mayor que el valor máximo.");
        return;
      }
    }

    const filtros: QueryBody = {
      ...(filtrosActivos.ciudad && { ciudad }),
      ...(filtrosActivos.servicio && { servicio }),
      ...(filtrosActivos.deuda && deudaMinima !== "" && { deudaMinima: Number(deudaMinima) }),
      ...(filtrosActivos.deuda && deudaMaxima !== "" && { deudaMaxima: Number(deudaMaxima) }),
    };

    setIsConsultando(true);
    await handleConsultar(filtros);
    setIsConsultando(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full sm:w-4/5 md:w-3/5 shadow-xl rounded-2xl p-6 space-y-6"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-principal">
          Envio de Mensajes
        </h1>

        {/* Distritos */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filtrosActivos.ciudad}
              onChange={(e) =>
                setFiltrosActivos((prev) => ({
                  ...prev,
                  ciudad: e.target.checked,
                }))
              }
            />
            Filtrar por Distritos
          </label>
          {filtrosActivos.ciudad && (
            <select
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
            >
              <option value="">Seleccione Distrito</option>
              {distritos.map((prov) => (
                <option key={prov} value={prov}>
                  {prov}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Servicio */}
        <div className="space-y-2">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filtrosActivos.servicio}
              onChange={(e) =>
                setFiltrosActivos((prev) => ({
                  ...prev,
                  servicio: e.target.checked,
                }))
              }
            />
            Filtrar por Servicio
          </label>
          {filtrosActivos.servicio && (
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
          )}
        </div>

        {/* Valor de Deuda */}
        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filtrosActivos.deuda}
              onChange={(e) =>
                setFiltrosActivos((prev) => ({
                  ...prev,
                  deuda: e.target.checked,
                }))
              }
            />
            Filtrar por Valor de Deuda
          </label>
          {filtrosActivos.deuda && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="deuda-min">Valor Mínimo (₡)</label>
                <input
                  id="deuda-min"
                  type="number"
                  value={deudaMinima}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDeudaMinima(value === '' ? '' : Number(value));
                  }}
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="deuda-max">Valor Máximo (₡)</label>
                <input
                  id="deuda-max"
                  type="number"
                  value={deudaMaxima}
                  onChange={(e) => {
                    const value = e.target.value;
                    setDeudaMaxima(value === '' ? '' : Number(value));
                  }}
                  className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                />
              </div>
            </div>
          )}
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
      {personas.length > 0 && (
        <div className="mt-8 w-full sm:w-4/5 md:w-3/5 bg-white shadow-xl rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 text-principal">Resultados</h2>

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
                    className="text-center odd:bg-white even:bg-gray-50"
                  >
                    <td className="p-2 border">{p.correo}</td>
                    <td className="p-2 border">{p.ciudad}</td>
                    <td className="p-2 border">{p.servicio}</td>
                    <td className="p-2 border">₡{p.valorDeLaDeuda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
