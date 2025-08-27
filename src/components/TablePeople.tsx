import { useSendMessageContext } from "../context/SendMessageContext";

export default function TablePeople() {
    const { personas } = useSendMessageContext();

    return (
        <div className="w-full sm:w-4/5 md:w-3/5 bg-white shadow-xl rounded-2xl p-6">
            <h2 className="text-xl font-bold mb-4 text-principal">Resultados</h2>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-100 text-left">
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
    )
}