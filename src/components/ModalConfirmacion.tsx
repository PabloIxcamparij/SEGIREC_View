import { useState } from "react";
import Modal from "./Modal";
import { showToast } from "../utils/toastUtils";

export interface ModalConfirmacionProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  titulo?: string;
  mensaje?: string;
  bottonText?: string;
}

export default function ModalConfirmacion({
  open,
  onClose,
  onConfirm,
  titulo,
  mensaje,
  bottonText,
}: ModalConfirmacionProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  const confirmacionOpcion = async () => {
    try {
      setIsProcessing(true);
      await onConfirm();
      showToast("success", "Acción realizada con éxito");
      onClose();
    } catch (error) {
      showToast("error", "Error al realizar la acción");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-3">{titulo}</h2>
      <p className="text-sm text-gray-700 mb-4">{mensaje}</p>
      <button
        onClick={confirmacionOpcion}
        disabled={isProcessing}
        className={`px-4 py-2 rounded text-white bg-red-400 hover:bg-red-700`}
      >
        {bottonText}
      </button>
    </Modal>
  );
}
