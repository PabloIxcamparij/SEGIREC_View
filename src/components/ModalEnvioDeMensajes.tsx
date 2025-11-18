import { useState, useEffect } from "react";
import Modal from "./Modal";
import { ToggleSwitch } from "../components/ContainerInputs";
import { showToast } from "../utils/toastUtils";

export interface ModalEnvioOpcionesProps {
  open: boolean;
  onClose: () => void;
  onRequestCode: (
    sendWhatsApp: boolean,
    prioritario: boolean
  ) => Promise<boolean | null>;
  onVerifyCode: (code: string) => any;
  handleSendMessage: () => Promise<void>;
}

export default function ModalEnvioOpciones({
  open,
  onClose,
  onRequestCode,
  onVerifyCode,
  handleSendMessage,
}: ModalEnvioOpcionesProps) {
  // --- ESTADOS PRINCIPALES ---
  const [sendWhatsApp, setSendWhatsApp] = useState(false);
  const [prioritario, setPrioritario] = useState(false);

  const [requested, setRequested] = useState(false); // Se solicitó código
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isValid, setIsValid] = useState(false); // Código validado
  const [isRequesting, setIsRequesting] = useState(false);

  const [attemptsRemaining, setAttemptsRemaining] = useState<number | null>(
    null
  );

  const switchSelected = sendWhatsApp || prioritario;

  // --- RESET COMPLETO CUANDO SE CIERRA EL MODAL ---
  useEffect(() => {
    if (!open) {
      resetAll();
    }
  }, [open]);

  const resetAll = () => {
    setSendWhatsApp(false);
    setPrioritario(false);
    setRequested(false);
    setVerificationCode("");
    setIsVerifying(false);
    setIsValid(false);
    setIsRequesting(false);
    setAttemptsRemaining(0);
  };

  // --- SOLICITAR CÓDIGO ---
  const solicitarCodigo = async () => {
    try {
      setIsRequesting(true);
      const response = await onRequestCode(sendWhatsApp, prioritario);

      console.log(response);
      if (response) {
        setRequested(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsRequesting(false);
    }
  };

  // --- VERIFICAR CÓDIGO ---
  const verificarCodigo = async () => {
    setIsVerifying(true);
    const result = await onVerifyCode(verificationCode);
    setIsVerifying(false);

    if (result.success) {
      setIsValid(true);
      setRequested(false);
      setVerificationCode("");
      return;
    }

    // Reseteamos campo
    setVerificationCode("");

    // Si backend dice límite superado → cerrar modal
    if (result.attemptsRemaining === 0) {
      showToast(
        "error",
        "Código incorrecto",
        "Ha superado el límite de intentos."
      );
      resetAll();
      onClose();
      return;
    }

    // Mostrar intentos restantes
    if (result.attemptsRemaining != null) {
      showToast(
        "error",
        "Código incorrecto",
        `Intentos restantes: ${result.attemptsRemaining}`
      );
      setAttemptsRemaining(result.attemptsRemaining);
    }
  };

  const handleSend = () => {
    handleSendMessage();
    onClose();
    resetAll();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <h2 className="text-xl font-bold mb-3">Opciones de Envío</h2>
      <p className="text-sm text-gray-700 mb-4">
        Activar alguna opción requiere autorización mediante un código.
      </p>

      {/* --- SWITCHES (solo si no se ha solicitado código) --- */}
      {!requested && !isValid && (
        <div className="flex flex-col gap-3">
          <ToggleSwitch
            label="Enviar también por WhatsApp"
            checked={sendWhatsApp}
            onChange={setSendWhatsApp}
          />

          <ToggleSwitch
            label="Envío prioritario"
            checked={prioritario}
            onChange={setPrioritario}
          />
        </div>
      )}

      <div className="mt-5 flex flex-col gap-3">
        {/* --- BOTÓN SOLICITAR CÓDIGO (solo antes del ciclo) --- */}
        {!requested && !isValid && (
          <button
            onClick={solicitarCodigo}
            disabled={!switchSelected || isRequesting}
            className={`px-4 py-2 rounded text-white ${
              !switchSelected
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isRequesting ? "Solicitando..." : "Solicitar Código"}
          </button>
        )}

        {/* --- BLOQUE DE VERIFICACIÓN --- */}
        {requested && (
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={verificationCode}
              maxLength={6}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="Ingrese el código"
              className="border rounded px-3 py-2"
            />
            <button
              onClick={verificarCodigo}
              disabled={verificationCode.length < 6 || isVerifying}
              className={`px-4 py-2 rounded text-white ${
                verificationCode.length < 6
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {isVerifying ? "Verificando..." : "Verificar Código"}
            </button>
            {requested && (
              <p className="text-xs text-gray-500">
                Intentos restantes: {attemptsRemaining ?? "—"}
              </p>
            )}{" "}
          </div>
        )}

        {/* --- BOTÓN DE CONFIRMAR ENVÍO --- */}
        <button
          onClick={handleSend}
          disabled={switchSelected && !isValid}
          className={`px-4 py-2 rounded text-white ${
            switchSelected && !isValid
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >
          Confirmar envío
        </button>
      </div>
    </Modal>
  );
}
