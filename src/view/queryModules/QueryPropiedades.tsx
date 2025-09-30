import { useEffect, useState } from "react";
import Select from "react-select";
import type { QueryBody } from "../../types";

import TablePeople from "../../components/TablePeople";
import ButtonsSendsMessage from "../../components/ButtonsSendsMessage";

import { showToast } from "../../utils/toastUtils";
import { useSendMessageContext } from "../../context/SendMessageContext";
import { useArchiveRead } from "../../hooks/useArchiveRead";

const distritos = [
  { value: "Bagaces", label: "Bagaces" },
  { value: "Fortuna", label: "Fortuna" },
  { value: "Mogote", label: "Mogote" },
  { value: "Río Naranjo", label: "Río Naranjo" },
];

export default function QueryPropiedades() {
  const {
    distrito,
    setDistrito,
    areaMinima,
    setAreaMinima,
    areaMaxima,
    setAreaMaxima,
    personas,
    handleQueryPropiedadesByFilters,
    cedula,
    setCedula,
    namePerson,
    setNamePerson,
    handleQueryPropiedadesByName,
    handleQueryPropiedadesByCedula,
    handleLimpiar,
  } = useSendMessageContext();

  const {
    archivo,
    nombreArchivo,
    handleFileChange,
    procesarCSV,
    procesarExcel,
  } = useArchiveRead("Propiedades");

  const [isConsulting, setIsConsulting] = useState(false);
  const [activeOption, setActiveOption] = useState<
    "filters" | "attributes" | "archive"
  >("filters");

  const [filters, setFilters] = useState({
    distritos: false,
    area: false,
  });

  const [attributes, setAttributes] = useState({
    cedula: false,
    name: false,
  });

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsulting(true);

    try {
      if (activeOption === "attributes") {
        if (attributes.name) {
          await handleQueryPropiedadesByName(namePerson, "Propiedades");
        } else {
          await handleQueryPropiedadesByCedula(cedula, "Propiedades");
        }
      } else if (activeOption === "filters") {
        if (
          filters.area &&
          areaMinima !== "" &&
          areaMaxima !== "" &&
          Number(areaMinima) > Number(areaMaxima)
        ) {
          showToast(
            "error",
            "El valor mínimo de área no puede ser mayor que el valor máximo."
          );
          return;
        }

        const query: QueryBody = {
          ...(filters.distritos && { distritos: distrito }),
          ...(filters.area &&
            areaMinima !== "" && { areaMinima: Number(areaMinima) }),
          ...(filters.area &&
            areaMaxima !== "" && { areaMaxima: Number(areaMaxima) }),
        };

        await handleQueryPropiedadesByFilters(query);
      } else if (activeOption === "archive") {
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
      }
    } catch (error) {
      showToast("error", "Error en lectura", String(error));
    } finally {
      setIsConsulting(false);
    }
  };

  // Reset al desmontar
  useEffect(() => {
    return () => handleLimpiar();
  }, [activeOption]);

  return (
    <div className="flex flex-col items-center w-full gap-6 p-4">
      {/* Selector de opciones */}
      <div className="flex gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activeOption === "filters"}
            onChange={() => setActiveOption("filters")}
          />
          Buscar por filtros
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activeOption === "attributes"}
            onChange={() => setActiveOption("attributes")}
          />
          Buscar por atributos
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={activeOption === "archive"}
            onChange={() => setActiveOption("archive")}
          />
          Buscar por archivo
        </label>
      </div>

      {/* Contenedor dinámico */}
      {activeOption && (
        <div
          key={activeOption}
          className="flex flex-col w-[90%] lg:w-[50%] xl:w-[40%] border-2 border-principal rounded-2xl shadow-xl p-6"
        >
          <h1 className="text-2xl font-bold mb-2 text-principal">
            {activeOption === "filters"
              ? "Buscar en la base de datos"
              : activeOption === "attributes"
              ? "Buscar a una persona"
              : "Buscar por archivo"}
          </h1>
          <p className="text-gray-500 mb-4">
            {activeOption === "filters"
              ? "Seleccione los filtros que quiera usar para comenzar la consulta"
              : activeOption === "attributes"
              ? "Seleccione una opción e ingrese los datos para comenzar la consulta"
              : "Suba un archivo (.csv o .xlsx) para realizar la consulta a la base de datos"}
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeOption === "filters" && (
              <>
                {/* Distritos */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.distritos}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          distritos: e.target.checked,
                        }))
                      }
                    />
                    Filtrar por Distritos
                  </label>
                  {filters.distritos && (
                    <Select
                      isMulti
                      options={distritos}
                      value={distritos.filter((s) =>
                        distrito.includes(s.value)
                      )}
                      onChange={(selected) =>
                        setDistrito(selected.map((opt) => opt.value))
                      }
                      className="mt-2 text-left"
                      placeholder="Seleccione distritos..."
                    />
                  )}
                </div>

                {/* Área */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.area}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          area: e.target.checked,
                        }))
                      }
                    />
                    Filtrar por área
                  </label>
                  {filters.area && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <input
                        type="number"
                        placeholder="Área mínima"
                        value={areaMinima}
                        onChange={(e: any) => setAreaMinima(e.target.value)}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Área máxima"
                        value={areaMaxima}
                        onChange={(e: any) => setAreaMaxima(e.target.value)}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {activeOption === "attributes" && (
              <>
                {/* Cedula */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={attributes.cedula}
                      onChange={(e) =>
                        setAttributes({ cedula: e.target.checked, name: false })
                      }
                    />
                    Buscar por cédula
                  </label>
                  {attributes.cedula && (
                    <input
                      type="text"
                      placeholder="ej. 5044507..."
                      value={cedula}
                      onChange={(e) => setCedula(e.target.value)}
                      className="mt-2 border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                    />
                  )}
                </div>

                {/* Nombre */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={attributes.name}
                      onChange={(e) =>
                        setAttributes({ name: e.target.checked, cedula: false })
                      }
                    />
                    Buscar por nombre
                  </label>
                  {attributes.name && (
                    <input
                      type="text"
                      placeholder="ej. Pablo Sorto"
                      value={namePerson}
                      onChange={(e) => setNamePerson(e.target.value)}
                      className="mt-2 border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                    />
                  )}
                </div>
              </>
            )}

            {activeOption === "archive" && (
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
                    Arrastre y suelte un archivo aquí o haga clic para
                    seleccionar
                  </p>
                </label>
              </div>
            )}
          </form>
        </div>
      )}

      {/* Botón enviar */}
      <ButtonsSendsMessage
        handleSubmit={handleSubmit}
        isConsultando={isConsulting}
      />

      {personas.length > 0 && <TablePeople />}
    </div>
  );
}
