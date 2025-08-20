// src/view/SendFilteredEmailsView.tsx
import { useSendMessage } from "../hooks/useSendMessage";

const provincias = ["Bagaces", "Fortuna", "Mogote", "Río Naranjo"];
const servicios = ["Electricidad", "Agua", "Internet"];

export default function SendFilteredEmailsView() {
  const {
    ciudad,
    setCiudad,
    servicio,
    setServicio,
    valor,
    setValor,
    valorTipo,
    setValorTipo,
    personas,
    mensaje,
    handleConsultar,
    handleEnviar,
    handleLimpiar,
  } = useSendMessage();

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Enviar correos</h1>
      
      <form onSubmit={handleConsultar} className="space-y-4">
        {/* Ciudad */}
        <select value={ciudad} onChange={(e) => setCiudad(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Seleccione Distrito</option>
          {provincias.map((prov) => (
            <option key={prov} value={prov}>{prov}</option>
          ))}
        </select>

        {/* Servicio */}
        <select value={servicio} onChange={(e) => setServicio(e.target.value)} className="border p-2 rounded w-full">
          <option value="">Seleccione Servicio</option>
          {servicios.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Valor */}
        <div className="flex gap-2 items-center">
          <input
            type="number"
            value={valor}
            onChange={(e) => setValor(e.target.value)}
            className="border p-2 rounded flex-1"
            placeholder="Valor"
          />
          <select value={valorTipo} onChange={(e) => setValorTipo(e.target.value as any)} className="border p-2 rounded">
            <option value="Nah">Nah</option>
            <option value="Mayor">Mayor</option>
            <option value="Menor">Menor</option>
          </select>
        </div>

        <div className="flex justify-end gap-2">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Consultar</button>
          <button
            type="button"
            disabled={personas.length === 0}
            onClick={handleEnviar}
            className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Enviar correos
          </button>
          <button type="button" onClick={handleLimpiar} className="bg-gray-400 text-white px-4 py-2 rounded">
            Limpiar
          </button>
        </div>
      </form>

      {/* Tabla */}
      {personas.length > 0 && (
        <table className="mt-6 w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Correo</th>
              <th className="p-2 border">Ciudad</th>
              <th className="p-2 border">Servicio</th>
              <th className="p-2 border">Deuda</th>
            </tr>
          </thead>
          <tbody>
            {personas.map((p, idx) => (
              <tr key={idx} className="text-center">
                <td className="p-2 border">{p.correo}</td>
                <td className="p-2 border">{p.ciudad}</td>
                <td className="p-2 border">{p.servicio}</td>
                <td className="p-2 border">{p.valorDeLaDeuda}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {mensaje && <p className="mt-4 font-medium">{mensaje}</p>}
    </div>
  );
}
