import { useState } from "react";
import { useSendMessageContext } from "../context/SendMessageContext";
import ModalEnvioOpciones from "../components/ModalEnvioDeMensajes";

export interface ButtonsSendsMessageProps {
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  handleSendMessage: () => Promise<void>;
  isConsultando: boolean;
  sending: boolean;
}


export default function ButtonsSendsMessage({
  handleSubmit,
  handleSendMessage,
  isConsultando,
  sending,
}: ButtonsSendsMessageProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const abrirModal = () => {
    setModalOpen(true);
  };

  const {
    handleLimpiar,
    personas,
    handleRequestCodePrioritaryMessage,
    handleConfirmCodePrioritaryMessage,
  } = useSendMessageContext();

  return (
    <>
      <ModalEnvioOpciones
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onRequestCode={handleRequestCodePrioritaryMessage}
        onVerifyCode={handleConfirmCodePrioritaryMessage}
        handleSendMessage={handleSendMessage}
      />
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
          onClick={abrirModal}
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
    </>
  );
}
