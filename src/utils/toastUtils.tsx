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

// // 1. Toast de Confirmación de Envío
// export const showToastConfirmSend = (onConfirm: () => void) => {
//   if (!toast) return;

//   toast?.show({
//     severity: "info",
//     summary: "¿Desea enviar los mensajes?",
//     content: (props) => (
//       <div className="flex flex-col gap-3 p-3">
//         <p className="text-lg text-900 font-semibold">
//           Confirme el envío masivo de mensajes
//         </p>
//         <div className="flex gap-2 justify-end">
//           <Button
//             label="Cancelar"
//             className="p-button-text"
//             onClick={() => toast?.remove(props.message)}
//           />
//           <Button
//             label="Enviar"
//             severity="success"
//             onClick={() => {
//               toast?.remove(props.message);
//               onConfirm();
//             }}
//           />
//         </div>
//       </div>
//     ),
//   });
// };
// // En utils/toastUtils.ts

// export const showToastConfirmSendPrioritary = (
//   onRequest: () => Promise<void>,
//   onConfirm: (code: string) => Promise<boolean>,
//   onSend: () => Promise<void>
// ) => {
//   if (!toast) return;

//   const toastId = Math.random().toString();
//   toast.show({
//     id: toastId,
//     severity: "info",
//     summary: "Confirme el envío prioritario",
//     sticky: true,
//     content: (props) => {
//       // Agregamos props para poder usar props.message en removeToast
//       // Estados internos
//       const [verificationCode, setVerificationCode] = useState<string>("");
//       const [isCodeRequested, setIsCodeRequested] = useState<boolean>(false);
//       const [isCodeVerified, setIsCodeVerified] = useState<boolean>(false);
//       const [isVerifying, setIsVerifying] = useState<boolean>(false);
//       const [isRequesting, setIsRequesting] = useState<boolean>(false);
//       // Estado para los intentos de verificación
//       const [attempts, setAttempts] = useState<number>(0);
//       // Número máximo de intentos
//       const MAX_ATTEMPTS = 3; // Función para remover el toast

//       const removeToast = () => toast?.remove(props.message);
//       const handleRequest = async () => {
//         setIsRequesting(true);
//         await onRequest(); // Llama al método para solicitar el código
//         setIsRequesting(false);
//         setIsCodeRequested(true);
//         setAttempts(0); // Reiniciar intentos al solicitar un nuevo código
//         showToast(
//           "info",
//           "Código enviado",
//           "Revise el correo del administrador para el nuevo código."
//         );
//       };

//       const handleVerification = async () => {
//         if (attempts >= MAX_ATTEMPTS) return; // Protección por si acaso

//         setIsVerifying(true);
//         const response = await onConfirm(verificationCode);

//         if (response) {
//           // ÉXITO: El código es correcto
//           setIsCodeVerified(true);
//           setVerificationCode(""); // Limpiar el input visualmente
//           showToast(
//             "success",
//             "Verificación Exitosa",
//             "Ya puede iniciar el envío prioritario."
//           );
//         } else {
//           // FALLO: El código es incorrecto o expiró
//           const newAttempts = attempts + 1;
//           setAttempts(newAttempts);
//           setVerificationCode(""); // Limpiar el input para reintento

//           if (newAttempts >= MAX_ATTEMPTS) {
//             showToast(
//               "error",
//               "Límite de Intentos",
//               `Ha superado el máximo de ${MAX_ATTEMPTS} intentos. Solicite un nuevo código.`
//             );
//             // Dejamos el toast abierto para que el usuario pueda cancelarlo o solicitar uno nuevo.
//           } else {
//             showToast(
//               "warn",
//               "Código Incorrecto",
//               `Intento ${newAttempts}/${MAX_ATTEMPTS}. Verifique el código ingresado.`
//             );
//           }
//         }

//         setIsVerifying(false);
//       };

//       // Lógica de deshabilitación
//       const isInputDisabled = isCodeVerified || attempts >= MAX_ATTEMPTS;
//       const isVerifyButtonDisabled =
//         isCodeVerified ||
//         attempts >= MAX_ATTEMPTS ||
//         isVerifying ||
//         verificationCode.length < 6;
//       const isRequestButtonDisabled = isRequesting || isVerifying;
//       const isSendButtonDisabled = !isCodeVerified;

//       return (
//         <div className="flex flex-col gap-3 p-3 w-80">
//           <p className="text-lg text-900 font-semibold"> Envío Prioritario</p>
//           {!isCodeRequested ? (
//             // Etapa 1: Solicitar Código
//             <p className="text-sm text-gray-700">
//               {" "}
//               Para proceder con el envío prioritario, primero solicite un código
//               de verificación.{" "}
//             </p>
//           ) : (
//             // Etapa 2: Ingresar Código
//             <>
//               <p className="text-sm text-gray-700">
//                 {isCodeVerified
//                   ? "Código verificado exitosamente."
//                   : "Se ha solicitado el código. Ingréselo a continuación:"}
//               </p>
//               {attempts > 0 && attempts < MAX_ATTEMPTS && (
//                 <p className="text-sm text-red-500 font-bold">
//                   Intentos restantes: {MAX_ATTEMPTS - attempts}
//                 </p>
//               )}
//                            {" "}
//               <InputText
//                 value={verificationCode}
//                 onChange={(e) => setVerificationCode(e.target.value)}
//                 placeholder="Código de 6 dígitos"
//                 maxLength={6}
//                 disabled={isInputDisabled} // Deshabilitar si se verifica o se agotan intentos
//               />
//             </>
//           )}
//           <div className="flex flex-col gap-2 justify-end mt-2">
//             <Button
//               label="Cancelar"
//               className="p-button-text p-button-danger"
//               onClick={removeToast}
//               disabled={isRequesting || isVerifying}
//             />
//             {/* BOTÓN INICIAR ENVÍO (Nuevo Requerimiento) */}
//             <Button
//               label="Iniciar Envío"
//               severity="success"
//               onClick={() => {
//                 removeToast(); // Cerrar el toast
//                 onSend(); // Ejecutar la función de envío prioritario
//               }}
//               disabled={isSendButtonDisabled}
//             />
//             {!isCodeRequested || attempts >= MAX_ATTEMPTS ? (
//               // Mostrar "Solicitar Código" si aún no se ha solicitado o si se agotaron los intentos
//               <Button
//                 label={isRequesting ? "Solicitando..." : "Solicitar Código"}
//                 onClick={handleRequest}
//                 disabled={isRequestButtonDisabled}
//               />
//             ) : (
//               // Mostrar "Verificar Código" si se solicitó y aún quedan intentos
//               <Button
//                 label={isVerifying ? "Verificando..." : "Verificar Código"}
//                 onClick={handleVerification}
//                 disabled={isVerifyButtonDisabled}
//               />
//             )}
//           </div>
//         </div>
//       );
//     },
//   });
// };
