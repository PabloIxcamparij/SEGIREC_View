// src/hooks/useSendMessage.ts
import { useState } from "react";
import {
  queryPeopleWithProperties,
  queryPeopleWithDebt,
} from "../service/QueryPeople.service";
import {
  sendMessageMassive,
  sendMessageOfMorosidad,
  sendMessageOfPropiedades,
  requestCodePrioritaryMessage,
  confirmCodePrioritaryMessage,
} from "../service/SendMessage.service";
import type { Persona, QueryBody } from "../types";
import { showToast } from "../utils/toastUtils";

/**
 * Hook personalizado para gestionar consultas y envíos de mensajes relacionados con propiedades y morosidad.
 * @returns Un objeto con estados y métodos para manejar consultas y envíos de mensajes.
 */

export function useQueryPropiedades() {
  // Estados para los filtros
  const [distrito, setDistrito] = useState<string[]>([]);
  const [servicio, setServicio] = useState<string[]>([]);

  const [codigoBaseImponible, setCodigoBaseImponible] = useState<string[]>([]);

  const [areaMinima, setAreaMinima] = useState<number | "">("");
  const [areaMaxima, setAreaMaxima] = useState<number | "">("");

  const [monImponibleMinimo, setMonImponibleMinimo] = useState<number | "">("");
  const [monImponibleMaximo, setMonImponibleMaximo] = useState<number | "">("");

  const [deudaMinima, setDeudaMinima] = useState<number | "">("");
  const [deudaMaxima, setDeudaMaxima] = useState<number | "">("");

  const [numeroDerecho, setNumeroDerecho] = useState("");
  const [numeroFinca, setNumeroFinca] = useState("");

  // Estados para el envio masivo
  const [asunto, setAsunto] = useState<string>("");
  const [mensaje, setMensaje] = useState("");

  // Estado para consultas por atributos
  const [cedula, setCedula] = useState("");
  const [namePerson, setNamePerson] = useState("");
  const [personas, setPersonas] = useState<Persona[]>([]);

  let priorityToken = "";

  /**
   * Método para consultar personas por Propiedades
   * @param filtros Filtros para la consulta.
   */
  const handleQueryPeopleWithProperties = async (filtros: QueryBody) => {
    const body: QueryBody = filtros;
    const response = await queryPeopleWithProperties(body);
    if (response) {
      setPersonas(response.personas);
      showToast("success", "Consulta exitosa", "Cargando Resultados");
    }
  };

  /**
   * Método para consultar personas por Morosidad
   * @param filtros Filtros para la consulta.
   */
  const handleQueryMorosidadByFilters = async (filtros: QueryBody) => {
    const body: QueryBody = filtros;

    const response = await queryPeopleWithDebt(body);
    if (response) {
      setPersonas(response.personas);
      showToast("success", "Consulta exitosa", "Cargando Resultados");
    }
  };

  /**
   * Método para enviar mensajes de Propiedades
   */
  const handleSendMessagePropiedades = async () => {
    const tokenToSend = priorityToken;
    priorityToken = "";

    const response = await sendMessageOfPropiedades(personas, tokenToSend);

    if (response) {
      showToast("success", "Mensajes enviados correctamente");
    }
  };

  /**
   * Método para enviar mensajes de Morosidad
   */
  const handleSendMessageMorosidad = async () => {
    const tokenToSend = priorityToken;
    priorityToken = "";

    const response = await sendMessageOfMorosidad(personas, tokenToSend);

    if (response) {
      showToast("success", "Mensajes enviados correctamente");
    }
  };

  /**
   * Método para enviar mensajes masivos
   */
  const handleSendMessageMassive = async () => {
    const tokenToSend = priorityToken;
    priorityToken = "";

    const response = await sendMessageMassive(
      personas,
      mensaje,
      asunto,
      tokenToSend
    );

    if (response) {
      showToast("success", "Mensajes enviados correctamente");
    }
  };

  //-----------------------------------------------------------
  // Métodos para el manejo de mensajes prioritarios
  //-----------------------------------------------------------

  /**
   * Peticion de codigo para envio prioritario
   * @param whatsApp valor booleano que indica si el mensaje es por WhatsApp
   * @param priority valor booleano que indica si el mensaje es prioritario
   * @returns Regresa true si se logro el envio del mensaje correctamente
   */
  const handleRequestCodePrioritaryMessage = async (
    whatsApp: boolean,
    priority: boolean
  ): Promise<boolean | null> => {
    const response = await requestCodePrioritaryMessage({ whatsApp, priority });
    if (response) {
      showToast(
        "success",
        "Código de mensaje prioritario solicitado",
        "El código será enviado al correo del administrador"
      );
      return true;
    }
    return false;
  };

  /**
   * Confirma el código para el envío prioritario
   * @param code Código de verificación recibido por correo.
   * @returns Regresa true si el código es válido, false en caso contrario. Ademas de el token si es exitoso.
   */
const handleConfirmCodePrioritaryMessage = async (code: string) => {
  const response = await confirmCodePrioritaryMessage(code);

  if (response.success && response.token) {
    showToast("success", "Código verificado", "Permiso otorgado.");
    priorityToken = response.token;
    return response;
  }

  priorityToken = "";

  return response; // <-- siempre retorna el mismo tipo
};

  /**
   * Método para limpiar todos los estados
   */
  const handleLimpiar = () => {
    setCedula("");
    setAsunto("");
    setMensaje("");
    setNamePerson("");
    setAreaMaxima("");
    setAreaMinima("");
    setDeudaMinima("");
    setDeudaMaxima("");
    setNumeroFinca("");
    setNumeroDerecho("");
    setMonImponibleMinimo("");
    setMonImponibleMaximo("");
    setDistrito([]);
    setServicio([]);
    setPersonas([]);
    setCodigoBaseImponible([]);
    priorityToken = "";
  };

  return {
    distrito,
    setDistrito,
    cedula,
    setCedula,
    namePerson,
    setNamePerson,
    numeroDerecho,
    setNumeroDerecho,
    numeroFinca,
    setNumeroFinca,

    // Estados para la consulta por propiedades
    areaMinima,
    setAreaMinima,
    areaMaxima,
    setAreaMaxima,
    monImponibleMinimo,
    setMonImponibleMinimo,
    monImponibleMaximo,
    setMonImponibleMaximo,
    codigoBaseImponible,
    setCodigoBaseImponible,

    //Estados para la consulta por morosidad
    deudaMinima,
    setDeudaMinima,
    deudaMaxima,
    setDeudaMaxima,
    servicio,
    setServicio,

    // Estados para el envio masivo
    asunto,
    setAsunto,
    mensaje,
    setMensaje,

    // Resultados
    personas,
    setPersonas,

    // Método  limpiar
    handleLimpiar,

    // Método s de consulta
    handleQueryMorosidadByFilters,
    handleQueryPeopleWithProperties,

    // Métodos  de envio
    handleSendMessageMassive,
    handleSendMessageMorosidad,
    handleSendMessagePropiedades,

    // Métodos para envio prioritario
    handleRequestCodePrioritaryMessage,
    handleConfirmCodePrioritaryMessage,
  };
}
