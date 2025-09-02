import { useSendMessageContext } from "../context/SendMessageContext";

export default function TablePeople() {
  const { personas } = useSendMessageContext();

  return (
    <div className=" w-full md:w-4/5 lg:w-3/5 shadow-xl rounded-2xl p-6">
      <h2 className="text-xl font-bold mb-4 text-principal">Resultados</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-100 text-cente">
              <th className="p-2 border">Cedula</th>
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
                <td className="p-2 border">{p.cedula}</td>
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
  );
}
