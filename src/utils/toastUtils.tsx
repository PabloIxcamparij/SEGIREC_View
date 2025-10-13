import { Toast } from "primereact/toast";
import { Button } from "primereact/button"; 

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
