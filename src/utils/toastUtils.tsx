import { useState } from 'react';

import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext'; // Necesitas importar el InputText o un componente de input similar

let toast: Toast | null = null;

// Metodo para establecer la referencia del Toast
// Esto permite que el Toast pueda ser utilizado en cualquier parte de la aplicacion
// Toast es un componente de PrimeReact para mostrar mensajes emergentes

export const setToastRef = (ref: Toast | null) => {
  toast = ref;
};

// El metodo puede recibir 3 atributos:
// severity: el nivel de severidad del mensaje (success, info, warn, error)
// summary: el titulo del mensaje
// detail: el detalle del mensaje (opcional)
export const showToast = (
  severity: "success" | "info" | "warn" | "error",
  summary: string,
  detail?: string
) => {
  toast?.show({ severity, summary, detail });
};


// 1. Toast de Confirmación de Envío
export const showToastConfirmSend = (onConfirm: () => void) => {
  if (!toast) return;

  toast?.show({
    severity: "info",
    summary: "¿Desea enviar los mensajes?",
    content: (props) => (
        <div className="flex flex-col gap-3 p-3">
        <p className="text-lg text-900 font-semibold">
          Confirme el envío masivo de mensajes
        </p>
        <div className="flex gap-2 justify-end">
          <Button
            label="Cancelar"
            className="p-button-text"
            onClick={() => toast?.remove(props.message)}
          />
          <Button
            label="Enviar"
            severity="success"
            onClick={() => {
              toast?.remove(props.message);
              onConfirm();
            }}
          />
        </div>
      </div>
    ),
  });
};

export const showToastConfirmSendPrioritary = (

  // Ahora onConfirm recibe el código y el toast?.remove
  onRequest: () => Promise<void>, 
  onConfirm: (code: string) => Promise<boolean>,
  onSend: () => Promise<void>,
) => {
  if (!toast) return;

  // Creamos un ID único para poder remover este toast específico
  const toastId = Math.random().toString(); 
  toast.show({
    id: toastId, // Asignamos un ID al mensaje
    severity: "info",
    summary: "Confirme el envío prioritario",
    sticky: true, // Hacemos el toast persistente (como un modal)
    content: () => {
      // Usamos un estado interno para el input del código
      const [verificationCode, setVerificationCode] = useState<string>('');
      const [isCodeRequested, setIsCodeRequested] = useState<boolean>(false);
      const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
      const [isVerifying, setIsVerifying] = useState<boolean>(false);
      const [isRequesting, setIsRequesting] = useState<boolean>(false);
      
      const handleRequest = async () => {
        setIsRequesting(true);
        await onRequest(); // Llama al método para solicitar el código (ej. por email/SMS)
        setIsRequesting(false);
        setIsCodeRequested(true);
      };

      const handleVerification = async () => {
        setIsVerifying(true);
        // Llama a la función de confirmación con el código y la función para remover
        const response = await onConfirm(verificationCode);

        if (response) {
          setIsCodeVerified(true);
        }

        setIsVerifying(false);
      };

      return (
        <div className="flex flex-col gap-3 p-3 w-80">
          <p className="text-lg text-900 font-semibold">
            Envío Prioritario
          </p>

          {!isCodeRequested ? (
            // Etapa 1: Solicitar Código
            <p className="text-sm text-gray-700">
              Para proceder con el envío prioritario, primero solicite un código de verificación.
            </p>
          ) : (
            // Etapa 2: Ingresar Código
            <>
              <p className="text-sm text-gray-700">
                Se ha solicitado el código. Ingréselo a continuación:
              </p>
              <InputText 
                value={verificationCode} 
                onChange={(e) => setVerificationCode(e.target.value)} 
                placeholder="Código de 6 dígitos"
                maxLength={6}
              />
            </>
          )}

          <div className="flex gap-2 justify-end mt-2">
            <Button
              label="Comenzar envio"
              className="p-button-text"
              onClick={onSend}
              disabled={!isCodeVerified}
            />
            
            {!isCodeRequested ? (
              <Button
                label={isRequesting ? "Solicitando..." : "Solicitar Código"}
                onClick={handleRequest}
                disabled={isRequesting}
              />
            ) : (
              <Button
                label={isVerifying ? "Verificando..." : "Verificar Código"}
                onClick={handleVerification}
                disabled={isVerifying || verificationCode.length < 6}
              />
            )}
          </div>
        </div>
      );
    },
  });
};