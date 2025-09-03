import { useSendMessageContext } from "../context/SendMessageContext";

export default function TablePeople() {
  const { personas } = useSendMessageContext();

  return (
    <div className="w-full md:w-4/5 lg:w-3/5 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-8">
      <h2 className="text-xl font-bold mb-4 text-principal flex justify-between items-center">
        Resultados
        <span className="text-sm text-black font-normal">
          Cantidad: {personas.length}
        </span>
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full text-center border-collapse">
          <thead>
            <tr className="bg-gray-100 text-cente">
              <th className="p-2 border">Cedula</th>
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Ciudad</th>
              <th className="p-2 border">Servicio</th>
              <th className="p-2 border">Deuda</th>
              <th className="p-2 border">incluir</th>
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
                <td className="p-2 border">
                  <input
                    className="text-blue-500 hover:underline"
                    type="checkbox"
                    value="Incluir"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
