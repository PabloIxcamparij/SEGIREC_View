import { useEffect, useState } from "react";
import Select from "react-select";
import type { AttributesState, QueryBody, ServicesCatalago } from "../../types";

import { showToast } from "../../utils/toastUtils";
import { useSendMessageContext } from "../../context/SendMessageContext";
import { useArchiveRead } from "../../hooks/useArchiveRead";
import { queryServiceCatalogo } from "../../service/utilsService";

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

export default function QueryMorosidad() {
  const {
    distrito,
    setDistrito,
    servicio,
    setServicio,
    deudaMinima,
    setDeudaMinima,
    deudaMaxima,
    setDeudaMaxima,
    personas,
    cedula,
    namePerson,
    handleQueryPropiedadesByName,
    handleQueryMorosidadByFilters,
    handleQueryPropiedadesByCedula,
    handleLimpiar,
  } = useSendMessageContext();

  const {
    archivo,
    nombreArchivo,
    handleFileChange,
    procesarCSV,
    procesarExcel,
  } = useArchiveRead("Morosidad");

  const [isConsulting, setIsConsulting] = useState(false);
  const [activeOption, setActiveOption] = useState<
    "filters" | "attributes" | "archive"
  >("filters");

  const [filters, setFilters] = useState({
    distritos: false,
    servicios: false,
    area: false,
  });

  const [attributes, setAttributes] = useState<AttributesState>({
    cedula: false,
    name: false,
  });

  const [serviciosCatalogo, setServiciosCatalogo] = useState<
    ServicesCatalago[]
  >([]);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsulting(true);

    try {
      if (activeOption === "attributes") {
        if (attributes.name) {
          await handleQueryPropiedadesByName(namePerson, "Morosidad");
        } else {
          await handleQueryPropiedadesByCedula(cedula, "Morosidad");
        }
      } else if (activeOption === "filters") {
        if (
          filters.area &&
          deudaMinima !== "" &&
          deudaMaxima !== "" &&
          Number(deudaMinima) > Number(deudaMaxima)
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
            deudaMinima !== "" && { deudaMinima: Number(deudaMinima) }),
          ...(filters.area &&
            deudaMaxima !== "" && { deudaMaxima: Number(deudaMaxima) }),
        };

        await handleQueryMorosidadByFilters(query);
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

  //
  useEffect(() => {
    if (serviciosCatalogo.length === 0) {
      const fetchServicios = async () => {
        try {
          const data = await queryServiceCatalogo();
          setServiciosCatalogo(data);
        } catch (error) {
          console.error("Error al cargar el catálogo de servicios:", error);
        }
      };

      fetchServicios();
    }
  }, [serviciosCatalogo]);

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

                {/* Servicios */}
                <div>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.servicios}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          servicios: e.target.checked,
                        }))
                      }
                    />
                    Filtrar por Servicios
                  </label>
                  {filters.servicios && (
                    <Select
                      isMulti
                      options={serviciosCatalogo}
                      value={serviciosCatalogo.filter((s: any) =>
                        servicio.includes(s.value)
                      )}
                      onChange={(selected) =>
                        setServicio(selected.map((opt: any) => opt.value))
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
                    Filtrar por Deuda
                  </label>
                  {filters.area && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <input
                        type="number"
                        placeholder="Deuda mínima"
                        value={deudaMinima}
                        onChange={(e: any) => setDeudaMinima(e.target.value)}
                        className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Deuda máxima"
                        value={deudaMaxima}
                        onChange={(e: any) => setDeudaMaxima(e.target.value)}
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
