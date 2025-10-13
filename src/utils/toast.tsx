import { Toast } from "primereact/toast";
import { Button } from "primereact/button"; 
import { ProgressBar } from "primereact/progressbar"; 

let toast: Toast | null = null;
let toastConfirm: Toast | null = null; // Referencia para el toast de confirmación/acciones

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
export const showConfirmToast = (
    cantidadPersonas: number,
    onAccept: () => void,
) => {
    const clear = () => toastConfirm?.clear();

    toastConfirm?.show({
        severity: 'warn', // Usamos 'warn' o 'info' para confirmación
        summary: 'Confirmación de Envío Masivo',
        detail: `Se enviarán mensajes a ${cantidadPersonas} personas. ¿Desea continuar?`,
        sticky: true, // Se mantiene hasta que se interactúa
        life: 999999,
        closable: false,
        content: (
            <div className="flex flex-col gap-3 w-full p-2" style={{ flex: '1' }}>
                <div className="font-medium text-lg my-2 text-900">
                    {`¿Confirmar envío a ${cantidadPersonas} personas?`}
                </div>
                <div className="flex gap-3 justify-end">
                    <button 
                        label="Cancelar" 
                        severity="secondary" 
                        outlined
                        onClick={clear} 
                        className="p-button-sm" 
                    />
                    <button 
                        label="Enviar Ahora" 
                        severity="success" 
                        onClick={() => { clear(); onAccept(); }} 
                        className="p-button-sm" 
                    />
                </div>
            </div>
        ),
    });
};