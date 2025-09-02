import { useSendMessageContext } from "../context/SendMessageContext";

export default function ButtonsSendsMessage({ handleSubmit, isConsultando }: { handleSubmit: any, isConsultando: boolean }) {
    const {
        handleLimpiar,
        handleEnviar,
        personas
    } = useSendMessageContext();

    return (
        <div className="flex flex-wrap w-full sm:w-4/5 md:w-3/5 justify-end gap-2">
            <button
                onClick={handleSubmit}
                disabled={isConsultando}
                className="bg-principal text-white px-4 py-2 rounded hover:opacity-90 disabled:opacity-60"
            >
                {isConsultando ? "Consultando..." : "Consultar"}
            </button>

            <button
                type="button"
                onClick={handleLimpiar}
                className="border hover:bg-gray-800 hover:text-white px-4 py-2 rounded"
            >
                Limpiar
            </button>

            <button
                type="button"
                disabled={personas.length === 0}
                onClick={handleEnviar}
                className="bg-green-600 text-white px-4 py-2 rounded disabled:bg-gray-300 disabled:text-gray-600"
            >
                Enviar Mensaje
            </button>
        </div>
    )
}