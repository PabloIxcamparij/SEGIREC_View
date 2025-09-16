import { Toast } from "primereact/toast";

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
