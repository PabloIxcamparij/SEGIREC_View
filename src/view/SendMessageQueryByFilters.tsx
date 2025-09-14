import { useEffect, useState } from "react";
import type { QueryBody } from "../types";
import TablePeople from "../components/TablePeople";
import ButtonsSendsMessage from "../components/ButtonsSendsMessage";
import { useSendMessageContext } from "../context/SendMessageContext";
import { showToast } from "../utils/toastUtils";
import Select from "react-select";

const distritos = [
  { value: "Bagaces", label: "Bagaces" },
  { value: "Fortuna", label: "Fortuna" },
  { value: "Mogote", label: "Mogote" },
  { value: "Río Naranjo", label: "Río Naranjo" },
];

const servicios = [
  { value: "Electricidad", label: "Electricidad" },
  { value: "Agua", label: "Agua" },
  { value: "Internet", label: "Internet" },
];

export default function SendMessageQueryByFilters() {
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
    handleQueryPeopleFilters,
    handleLimpiar,
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
        showToast("error", "Por favor, ingrese ambos valores de deuda.");
        return;
      }
      if (Number(deudaMinima) > Number(deudaMaxima)) {
        showToast(
          "error",
          "El valor mínimo de deuda no puede ser mayor que el valor máximo."
        );
        return;
      }
    }
    setIsConsultando(true);

    try {
      const filtros: QueryBody = {
        ...(filtrosActivos.distritosList && { distritos: ciudad }),
        ...(filtrosActivos.servicio && { servicios: servicio }),
        ...(filtrosActivos.deuda &&
          deudaMinima !== "" && { deudaMinima: Number(deudaMinima) }),
        ...(filtrosActivos.deuda &&
          deudaMaxima !== "" && { deudaMaxima: Number(deudaMaxima) }),
      };
      await handleQueryPeopleFilters(filtros);
    } catch (error) {
      showToast("error", "Error en lectura", String(error));
    } finally {
      setIsConsultando(false);
    }
  };

  //Limpiar y desmontar al salir de la pagina
  useEffect(() => {
    return () => {
      handleLimpiar();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-10 p-4">
      <div className="flex flex-col w-[90%] lg:w-[50%] xl:w-[40%] text-center text-wrap border-2 border-principal backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-principal ">
          Buscar en la base de datos
        </h1>
        <h2 className="text-1xl mb-4 text-gray-500 ">
          Seleccione los filtros que quiera usar para comenzar la consulta
        </h2>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
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
              <Select
                isMulti
                options={distritos}
                value={distritos.filter((s) => ciudad.includes(s.value))}
                onChange={(selected) => {
                  const values = selected
                    ? selected.map((opt) => opt.value)
                    : [];
                  setCiudad(values);
                }}
                className="w-full text-left"
                placeholder="Seleccione distritos..."
              />
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
              <Select
                isMulti
                options={servicios}
                value={servicios.filter((s) => servicio.includes(s.value))}
                onChange={(selected) => {
                  const values = selected
                    ? selected.map((opt) => opt.value)
                    : [];
                  setServicio(values);
                }}
                className="w-full text-left"
                placeholder="Seleccione servicios..."
              />
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
              Filtrar por Deuda
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
                      setDeudaMinima(value === "" ? "" : Number(value));
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
                      setDeudaMaxima(value === "" ? "" : Number(value));
                    }}
                    className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                  />
                </div>
              </div>
            )}
          </div>
        </form>
      </div>

      <ButtonsSendsMessage
        handleSubmit={handleSubmit}
        isConsultando={isConsultando}
      />

      {personas.length > 0 && <TablePeople />}
    </div>
  );
}
