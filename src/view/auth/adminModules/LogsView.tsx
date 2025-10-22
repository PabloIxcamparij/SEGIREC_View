import { useState } from "react";
import { queryActivities } from "../../../service/utilsService";
import type { ConsultaActivity, EnvioActivity } from "../../../types";

export default function LogsView() {
  const [consultas, setConsultas] = useState<ConsultaActivity[]>([]);
  const [envios, setEnvios] = useState<EnvioActivity[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const fetchActivities = async (currentPage: number) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const data = await queryActivities(currentPage);
      if (data) {
        setConsultas((prev) => {
          const nuevos = data.consultas.filter(
            (n: ConsultaActivity) => !prev.some((p) => p.id === n.id)
          );
          return [...prev, ...nuevos];
        });

        setEnvios((prev) => {
          const nuevos = data.envios.filter(
            (n: EnvioActivity) => !prev.some((p) => p.id === n.id)
          );
          return [...prev, ...nuevos];
        });
      }
    } catch (error) {
      console.error("Error cargando actividades:", error);
    } finally {
      setIsLoading(false);
      setIsFirstLoad(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchActivities(nextPage);
  };

  const handleInitialLoad = () => {
    setConsultas([]);
    setEnvios([]);
    setPage(1);
    fetchActivities(1);
  };

  return (
    <div className="flex flex-col items-center gap-8 p-6">
      {isFirstLoad ? (
        <button
          onClick={handleInitialLoad}
          className="mt-4 px-6 py-2 bg-principal text-white rounded-lg hover:bg-principal/80"
        >
          Cargar primeros resultados
        </button>
      ) : (
        <>
          {/* === TABLA DE CONSULTAS === */}
          <div className="w-full md:w-4/5 lg:w-[80%] bg-white border-2 border-principal rounded-2xl shadow-xl p-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Consultas
            </h2>
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-principal/10 text-gray-800">
                  <th className="py-4 px-3">Nombre</th>
                  <th className="py-4 px-3">Detalle</th>
                  <th className="py-4 px-3">Filtros</th>
                  <th className="py-4 px-3">Fecha</th>
                  <th className="py-4 px-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {consultas.length > 0 ? (
                  consultas.map((c) => (
                    <tr
                      key={`consulta-${c.id}`}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3">{c.Usuario.Nombre}</td>
                      <td className="py-3 px-3">{c.Detalle}</td>
                      <td className="py-3 px-3 max-w-[250px] md:max-w-[300px] lg:max-w-[400px] overflow-x-auto">
                        {formatearFiltros(c.Filtros?.FiltrosAplicados)}
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
                      No hay consultas registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* === TABLA DE ENVÍOS === */}
          <div className="w-full md:w-4/5 lg:w-[80%] bg-white border-2 border-principal rounded-2xl shadow-xl p-8 overflow-x-auto">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Envíos de Mensajes
            </h2>
            <table className="w-full text-center border-collapse">
              <thead>
                <tr className="bg-principal/10 text-gray-800">
                  <th className="py-4 px-3">Nombre</th>
                  <th className="py-4 px-3">Detalle</th>
                  <th className="py-4 px-3">Mensajes</th>
                  <th className="py-4 px-3">Correos</th>
                  <th className="py-4 px-3">WhatsApp</th>
                  <th className="py-4 px-3">Fecha</th>
                  <th className="py-4 px-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {envios.length > 0 ? (
                  envios.map((e) => (
                    <tr
                      key={`envio-${e.id}`}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-3">{e.Usuario.Nombre}</td>
                      <td className="py-3 px-3">{e.Detalle}</td>
                      <td className="py-3 px-3">{e.Envios.NumeroDeMensajes}</td>
                      <td className="py-3 px-3">
                        {e.Envios.NumeroDeCorreosEnviadosCorrectamente}
                      </td>
                      <td className="py-3 px-3">
                        {e.Envios.NumeroDeWhatsAppEnviadosCorrectamente}
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
                      No hay envíos registrados.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Botón de paginación */}
          <button
            onClick={handleLoadMore}
            disabled={isLoading}
            className="mt-4 px-6 py-2 bg-principal text-white rounded-lg hover:bg-principal/80 disabled:opacity-50"
          >
            {isLoading ? "Cargando..." : "Cargar más"}
          </button>
        </>
      )}
    </div>
  );
}

// === FUNCIÓN DE FORMATO DE FILTROS ===
const formatearFiltros = (texto?: string) => {
  if (!texto) return "Sin filtros";

  const limpio = texto
    .replace("Se hizo uso de los siguientes filtros:", "")
    .trim();

  const partes = limpio
    .split("•")
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  return (
    <ul className="text-left whitespace-pre-wrap break-words">
      {partes.map((parte, i) => (
        <li key={i} className="leading-snug mb-1">
          • {parte}
        </li>
      ))}
    </ul>
  );
};
