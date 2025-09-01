// src/view/SendFilteredEmailsView.tsx
import { useState } from "react";
import type { QueryBody } from "../types";
import TablePeople from "../components/TablePeople";
import ButtonsSendsMessage from "../components/ButtonsSendsMessage";
import { useSendMessageContext } from "../context/SendMessageContext";

const distritos = ["Bagaces", "Fortuna", "Mogote", "Río Naranjo"];
const servicios = ["Electricidad", "Agua", "Internet"];

export default function SendMessageQueryFilters() {
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
  } = useSendMessageContext();

  const [isConsultando, setIsConsultando] = useState(false);

  const [filtrosActivos, setFiltrosActivos] = useState({
    distritosList: false,
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
      ...(filtrosActivos.distritosList && { ciudad }),
      ...(filtrosActivos.servicio && { servicio }),
      ...(filtrosActivos.deuda && deudaMinima !== "" && { deudaMinima: Number(deudaMinima) }),
      ...(filtrosActivos.deuda && deudaMaxima !== "" && { deudaMaxima: Number(deudaMaxima) }),
    };

    setIsConsultando(true);
    await handleConsultar(filtros);
    setIsConsultando(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-10 p-4">

      <div className="flex flex-col w-full sm:w-4/5 md:w-3/5 shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-principal ">
          Búsqueda de personas por filtros
        </h1>
        <h2 className="text-1xl mb-4 text-center text-gray-500 ">
          Seleccione los filtros que quiera usar para comenzar la consulta
        </h2>
        <form
          onSubmit={handleSubmit}
          className="p-6 space-y-6"
        >

          {/* Distritos */}
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filtrosActivos.distritosList}
                onChange={(e) =>
                  setFiltrosActivos((prev) => ({
                    ...prev,
                    distritosList: e.target.checked,
                  }))
                }
              />
              Filtrar por Distritos
            </label>
            {filtrosActivos.distritosList && (
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
        </form>
      </div>

      <ButtonsSendsMessage handleSubmit={handleSubmit} isConsultando={isConsultando} />

      {personas.length > 0 && (
        <TablePeople />
      )}

    </div>
  );
}
