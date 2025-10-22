import { useEffect, useState } from "react";
import { queryActivities } from "../../../service/utilsService";
import type { Activities } from "../../../types";

export default function LogsView() {
  const [activities, SetActivities] = useState<Activities[]>([]);

  const fetchActivities = async () => {
    console.log("first")
    const data = await queryActivities();
    SetActivities(data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);
  return (
    <div className="flex flex-col items-center gap-6 p-4">
      <div className="bg-white border-2 border-principal overflow-x-auto w-full md:w-4/5 lg:w-[80%] backdrop-blur-md rounded-2xl shadow-xl p-8">
        <table className="w-full text-center border-collapse gap-2">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Detalle</th>
              {/* <th>Filtros aplicados</th> */}
              <th>Mensajes</th>
              <th>Correos</th>
              <th>WhatsApp</th>
              <th>Fecha</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {activities && activities.length > 0 ? (
              activities.map((activities) => (
                <tr key={activities.id}>
                  <td>{activities.Nombre}</td>
                  <td>{activities.Tipo}</td>
                  <td>{activities.Detalle}</td>
                  {/* <td>{activities.FiltrosAplicados}</td> */}
                  <td>{activities.NumeroDeMensajes}</td>
                  <td>{activities.NumeroDeCorreosEnviadosCorrectamente}</td>
                  <td>{activities.NumeroDeWhatsAppEnviadosCorrectamente}</td>
                  <td>{activities.createdAt}</td>
                  <td>{activities.Estado}</td>
                </tr>
              ))
            ) : (
              // Manejo de estado: si no hay datos
              <tr>
                <td colSpan={5}>
                  No hay usuarios para mostrar o la información está cargando.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
