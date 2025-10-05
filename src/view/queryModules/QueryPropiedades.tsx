import { useEffect, useState } from "react";
import Select from "react-select";
import type { AttributesState, QueryBody, BaseImponibleCatalago } from "../../types";


import { showToast } from "../../utils/toastUtils";
import { useSendMessageContext } from "../../context/SendMessageContext";
import { useArchiveRead } from "../../hooks/useArchiveRead";
import { queryBaseImponibleCatalogo } from "../../service/utilsService";

import TablePeople from "../../components/TablePeople";
import ButtonsSendsMessage from "../../components/ButtonsSendsMessage";
import ContainerQueryArchive from "../../components/ContainerQueryArchive";
import ContainerQueryAttribute from "../../components/ContainerQueryAttribute";

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
    monImponibleMinimo,
    setMonImponibleMinimo,
    monImponibleMaximo,
    setMonImponibleMaximo,
    codigoBaseImponible,
    setCodigoBaseImponible,
    personas,
    handleQueryPropiedadesByFilters,
    cedula,
    namePerson,
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
    baseImponible: false,
    area: false,
    montoImponible: false,
  });

  const [attributes, setAttributes] = useState<AttributesState>({
    cedula: false,
    name: false,
  });

  const [baseImponibleCatalogo, setBaseImponibleCatalogoCatalogo] = useState<
    BaseImponibleCatalago[]
  >([]);

  useEffect(() => {
    if (baseImponibleCatalogo.length === 0) {
      const fetchServicios = async () => {
        try {
          const data = await queryBaseImponibleCatalogo();
          setBaseImponibleCatalogoCatalogo(data);
        } catch (error) {
          console.error("Error al cargar el catálogo de servicios:", error);
        }
      };

      fetchServicios();
    }
  }, [baseImponibleCatalogo]);

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
          ...(filters.montoImponible &&
            monImponibleMinimo !== "" && { monImponibleMinimo: Number(monImponibleMinimo) }),
          ...(filters.montoImponible &&
            monImponibleMaximo !== "" && { monImponibleMaximo: Number(monImponibleMaximo) }),
          ...(filters.baseImponible && { codigoBaseImponible: codigoBaseImponible }),
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

                {/* Base Imponible */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.baseImponible}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          baseImponible: e.target.checked,
                        }))
                      }
                    />
                    Filtrar por Base Imponible
                  </label>
                  {filters.baseImponible && (
                    <Select
                      isMulti
                      options={baseImponibleCatalogo}
                      value={baseImponibleCatalogo.filter((s: any) =>
                        codigoBaseImponible.includes(s.value)
                      )}
                      onChange={(selected) =>
                        setCodigoBaseImponible(selected.map((opt: any) => opt.value))
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

                {/* Monto Imponible */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.montoImponible}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          montoImponible: e.target.checked,
                        }))
                      }
                    />
                    Filtrar por monto imponible
                  </label>
                  {filters.montoImponible && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <input
                        type="number"
                        placeholder="Monto minimo"
                        value={monImponibleMinimo}
                        onChange={(e: any) => setMonImponibleMinimo(e.target.value)}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Monto máximo"
                        value={monImponibleMaximo}
                        onChange={(e: any) => setMonImponibleMaximo(e.target.value)}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                      />
                    </div>
                  )}
                </div>
              </>
            )}

            {activeOption === "attributes" && (
              <ContainerQueryAttribute
                attributes={attributes}
                setAttributes={setAttributes}
              />
            )}

            {activeOption === "archive" && (
              <ContainerQueryArchive
                nombreArchivo={nombreArchivo}
                handleFileChange={handleFileChange}
                archivo={archivo}
              />
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
