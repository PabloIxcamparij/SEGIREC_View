// import { useState } from "react";

import { Toast } from "primereact/toast";
// import { Button } from "primereact/button";
// import { InputText } from "primereact/inputtext"; // Necesitas importar el InputText o un componente de input similar

let toast: Toast | null = null;

// Metodo para establecer la referencia del Toast
// Esto permite que el Toast pueda ser utilizado en cualquier parte de la aplicacion
// Toast es un componente de PrimeReact para mostrar mensajes emergentes

export const setToastRef = (ref: Toast | null) => {
  toast = ref;
};

/**
 * Metodo para mostrar un toast (Notificacion emergente)
 * Seguir fielmente el orden de los parametros
 * @param severity Tipo de notificacion: "success" | "info" | "warn" | "error"
 * @param summary  Titulo del mensaje
 * @param detail Detalle del mensaje (opcional)

 */
export const showToast = (
  severity: "success" | "info" | "warn" | "error",
  summary: string,
  detail?: string
) => {
  toast?.show({ severity, summary, detail });
};
