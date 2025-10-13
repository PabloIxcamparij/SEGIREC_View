import { useSendMessageContext } from "../context/SendMessageContext";

export default function ButtonsSendsMessage({
  handleSubmit,
  handleSendMessage,
  isConsultando,
  sending,
}: {
  handleSubmit: any;
  handleSendMessage: any;
  isConsultando: boolean;
  sending: boolean;
}) {
  const { handleLimpiar, personas } = useSendMessageContext();

  return (
    <div className="flex flex-wrap w-[90%] lg:w-[50%] justify-end gap-2">
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
        onClick={handleSendMessage}
        disabled={personas.length === 0 || sending}
        className={`px-4 py-2 rounded text-white ${
          sending
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {sending ? "Enviando..." : "Enviar Mensaje"}
      </button>
    </div>
  );
}
