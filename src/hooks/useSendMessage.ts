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
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Estado para consultas por atributos
  const [cedula, setCedula] = useState("");
  const [namePerson, setNamePerson] = useState("");
  const [personas, setPersonas] = useState<Persona[]>([]);

  const [isPrioritarySending, setIsPrioritarySending] = useState(false);

  //Consultar personas por filtros
  const handleQueryPeopleWithProperties = async (filtros: QueryBody) => {
    const body: QueryBody = filtros;
    const response = await queryPeopleWithProperties(body);
    if (response) {
      setPersonas(response.personas);
      showToast("success", "Consulta exitosa", "Cargando Resultados");
    }
  };

  //Consultar personas por filtros
  const handleQueryMorosidadByFilters = async (filtros: QueryBody) => {
    const body: QueryBody = filtros;

    const response = await queryPeopleWithDebt(body);
    if (response) {
      setPersonas(response.personas);
      showToast("success", "Consulta exitosa", "Cargando Resultados");
    }
  };

  // Enviar Mensajes
  const handleSendMessageMorosidad = async () => {
    const response = await sendMessageOfMorosidad(personas, isPrioritarySending);
    setIsPrioritarySending(false);

    if (response) {
      showToast("success", "Mensajes enviados correctamente");
    }
  };

  const handleSendMessagePropiedades = async () => {
    const response = await sendMessageOfPropiedades(personas, isPrioritarySending);
    setIsPrioritarySending(false);
    if (response) {
      showToast("success", "Mensajes enviados correctamente");
    }
  };

  const handleSendMessageMassive = async () => {
    const isTrue = isPrioritarySending;

    setIsPrioritarySending(false);
    
    const response = await sendMessageMassive(personas, mensaje, asunto, isTrue);

    if (response) {
      showToast("success", "Mensajes enviados correctamente");
    }
  };

  // Enviar como prioritario
  const handleRequestCodePrioritaryMessage = async () => {
    await requestCodePrioritaryMessage();
    showToast("success", "Código de mensaje prioritario solicitado", "El codigo sera enviado al correo del administrador");
  };

  const handleConfirmCodePrioritaryMessage = async (code: string) => {

    const response = await confirmCodePrioritaryMessage(code);

    if (response) {
      showToast("success", "Código verificado", "");
      setIsPrioritarySending(true);
    }

    return response;
  };    

  // Limpiar
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

    // Metodo limpiar
    handleLimpiar,

    // Metodos de consulta
    handleQueryMorosidadByFilters,
    handleQueryPeopleWithProperties,

    // Metodo de envio
    handleSendMessageMassive,
    handleSendMessageMorosidad,
    handleSendMessagePropiedades,

    // Metodos para envio prioritario
    handleRequestCodePrioritaryMessage,
    handleConfirmCodePrioritaryMessage,
  };
}
