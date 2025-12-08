import { useEffect } from "react";
import { useLogActivity } from "../../hooks/useLogsActiviti";
import TableActivity from "../../components/TableActiviti";
import { FilterInput } from "../../components/ContainerInputs";
import {formatearFiltros, formatearDetalleIndividual} from "../../utils/formatearFiltros";
import { downloadCSV } from "../../utils/descargaDeArchivo";


// ===============================
//           COMPONENTE VIEW
// ===============================
export default function LogsView() {
  const {
    // Filtros de consultas
    queryFilters,
    handleQueryFilterChange,
    handleClearQueryFilters,
    filteredConsultas,
    allConsultas,

    // Filtros de envíos
    messageFilters,
    handleMessageFilterChange,
    handleClearMessageFilters,
    filteredEnvios,
    allEnvios,

    // Carga y paginación
    fetchQueries,
    fetchMessages,
    handleLoadMoreQueries,
    handleLoadMoreMessages,
    isQueryLoading,
    isMessageLoading,
    hasMoreMessages,
  } = useLogActivity();

  // =============================================================
  //   CARGA INICIAL DE INFORMACIÓN (consultas y envíos)
  // =============================================================
  useEffect(() => {
    fetchQueries(1);
    fetchMessages(1);
  }, []);

  const handleDownloadConsultas = () => {
    downloadCSV("consultas_filtradas.csv", filteredConsultas, true);
  };

  const handleDownloadEnvios = () => {
    downloadCSV("envios_filtrados.csv", filteredEnvios, false);
  };

  // =============================================================
  //                        RENDER
  // =============================================================
  return (
    <div className="flex flex-col items-center gap-8 p-6">
      {/* =========================================================
          TABLA DE CONSULTAS
      ============================================================*/}
      <TableActivity
        title="Registro de consultas a las tablas"
        isLoading={isQueryLoading}
        loadMoreText="Cargar Más Consultas"
        onLoadMore={handleLoadMoreQueries}
        onDownload={handleDownloadConsultas}
        onClearFilters={handleClearQueryFilters}
        tableContent={
          <div className="max-h-150 overflow-y-auto overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                {/* CABECERA */}
                <tr className="bg-principal/10 text-gray-800  top-0 z-10">
                  <th className="py-4 px-3 min-w-[120px]">Nombre</th>
                  <th className="py-4 px-3 min-w-[150px]">Detalle</th>
                  <th className="py-4 px-3 min-w-[120px]">Filtros Aplicados</th>
                  <th className="py-4 px-3 min-w-[150px]">Fecha</th>
                  <th className="py-4 px-3 min-w-[100px]">Estado</th>
                </tr>

                {/* FILA DE FILTROS */}
                <tr>
                  <td className="py-2 px-3">
                    <FilterInput
                      type="text"
                      placeholder="Filtrar Nombre"
                      value={queryFilters.nombre}
                      onChange={(v) => handleQueryFilterChange("nombre", v)}
                    />
                  </td>

                  <td className="py-2 px-3">
                    <FilterInput
                      type="text"
                      placeholder="Filtrar Detalle"
                      value={queryFilters.detalle}
                      onChange={(v) => handleQueryFilterChange("detalle", v)}
                    />
                  </td>

                  <td className="py-2 px-3">
                    <FilterInput
                      type="text"
                      placeholder="Filtrar Filtros"
                      value={queryFilters.filtros}
                      onChange={(v) => handleQueryFilterChange("filtros", v)}
                    />
                  </td>

                  <td className="py-2 px-3">
                    <div className="flex flex-col gap-1">
                      <FilterInput
                        type="date"
                        placeholder="Desde"
                        value={queryFilters.fechaInicio}
                        onChange={(v) =>
                          handleQueryFilterChange("fechaInicio", v)
                        }
                      />
                      <FilterInput
                        type="date"
                        placeholder="Hasta"
                        value={queryFilters.fechaFin}
                        onChange={(v) => handleQueryFilterChange("fechaFin", v)}
                      />
                    </div>
                  </td>

                  <td className="py-2 px-3">
                    <FilterInput
                      type="select"
                      value={queryFilters.estado}
                      options={["Éxito", "Error"]}
                      onChange={(v) => handleQueryFilterChange("estado", v)}
                    />
                  </td>
                </tr>
              </thead>

              <tbody>
                {filteredConsultas.length > 0 ? (
                  filteredConsultas.map((c) => (
                    <tr
                      key={`consulta-${c.id}`}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3">{c.Usuario.Nombre}</td>

                      <td className="py-3 px-3">{c.Detalle}</td>

                      <td className="py-3 px-3 max-w-[250px] md:max-w-[300px] lg:max-w-[400px] overflow-x-auto text-left">
                        <div className="max-h-60 overflow-y-auto pr-2">
                          {formatearFiltros(c.Filtros?.FiltrosAplicados)}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {new Date(c.createdAt).toLocaleString()}
                      </td>

                      <td className="py-3 px-3">{c.Estado}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-gray-500">
                      {allConsultas.length === 0 && isQueryLoading
                        ? "Cargando primeras consultas..."
                        : "No hay consultas que coincidan con los filtros aplicados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        }
      />

      {/* =========================================================
          TABLA DE ENVÍOS
      ============================================================*/}
      <TableActivity
        title="Registro de los Envíos de Mensajes"
        isLoading={isMessageLoading}
        hasMore={hasMoreMessages}
        loadMoreText="Cargar Más Envíos"
        onLoadMore={handleLoadMoreMessages}
        onDownload={handleDownloadEnvios}
        onClearFilters={handleClearMessageFilters}
        tableContent={
          <div className="max-h-150 overflow-y-auto overflow-x-auto">
            <table className="w-full text-center border-collapse">
              <thead>
                {/* CABECERA */}
                <tr className="bg-principal/10 text-gray-800 top-0 z-10">
                  <th className="py-4 px-3 min-w-[120px]">
                    Nombre del responsable
                  </th>
                  <th className="py-4 px-3 min-w-[100px]">Detalle del envío</th>
                  <th className="py-4 px-3 min-w-[150px]">Resumen del envío</th>
                  <th className="py-4 px-3 min-w-[350px]">
                    Registros individuales
                  </th>
                  <th className="py-4 px-3 min-w-[150px]">Fecha</th>
                  <th className="py-4 px-3 min-w-[100px]">Estado</th>
                </tr>

                {/* FILA DE FILTROS */}
                <tr>
                  <td className="py-2 px-3">
                    <FilterInput
                      type="text"
                      placeholder="Filtrar Nombre"
                      value={messageFilters.nombre}
                      onChange={(v) => handleMessageFilterChange("nombre", v)}
                    />
                  </td>

                  <td className="py-2 px-3">
                    <FilterInput
                      type="text"
                      placeholder="Filtrar Detalle"
                      value={messageFilters.detalle}
                      onChange={(v) => handleMessageFilterChange("detalle", v)}
                    />
                  </td>

                  <td className="py-2 px-3">{/* No filtrable */}</td>
                  <td className="py-2 px-3">{/* No filtrable */}</td>

                  <td className="py-2 px-3">
                    <div className="flex flex-col gap-1">
                      <FilterInput
                        type="date"
                        placeholder="Desde"
                        value={queryFilters.fechaInicio}
                        onChange={(v) =>
                          handleQueryFilterChange("fechaInicio", v)
                        }
                      />
                      <FilterInput
                        type="date"
                        placeholder="Hasta"
                        value={queryFilters.fechaFin}
                        onChange={(v) => handleQueryFilterChange("fechaFin", v)}
                      />
                    </div>
                  </td>

                  <td className="py-2 px-3">
                    <FilterInput
                      type="select"
                      value={messageFilters.estado}
                      options={["Éxito", "Error"]}
                      onChange={(v) => handleMessageFilterChange("estado", v)}
                    />
                  </td>
                </tr>
              </thead>

              <tbody>
                {filteredEnvios.length > 0 ? (
                  filteredEnvios.map((e) => (
                    <tr
                      key={`envio-${e.id}`}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3">{e.Usuario.Nombre}</td>

                      <td className="py-3 px-3">{e.Detalle}</td>

                      <td className="py-3 px-3 text-left text-sm leading-tight">
                        <ul>
                          <li>• Total: {e.Envios.NumeroDeMensajes}</li>
                          <li>
                            • Correos:{" "}
                            {e.Envios.NumeroDeCorreosEnviadosCorrectamente}
                          </li>
                          <li>
                            • WhatsApp:{" "}
                            {e.Envios.NumeroDeWhatsAppEnviadosCorrectamente}
                          </li>
                        </ul>
                      </td>

                      <td className="py-3 px-3 max-w-[250px] md:max-w-[300px] lg:max-w-[400px] text-left overflow-x-auto">
                        <div className="max-h-60 overflow-y-auto pr-2">
                          {formatearDetalleIndividual(
                            e.Envios.DetalleIndividual
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {new Date(e.createdAt).toLocaleString()}
                      </td>

                      <td className="py-3 px-3">{e.Estado}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-4 text-gray-500">
                      {allEnvios.length === 0 && isMessageLoading
                        ? "Cargando primeros envíos..."
                        : "No hay envíos que coincidan con los filtros aplicados."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        }
      />
    </div>
  );
}