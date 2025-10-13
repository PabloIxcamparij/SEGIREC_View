// src/hooks/useSendMessage.ts
import { useState } from "react";
import {
  queryPeopleWithProperties,
  queryPeopleWithDebt,
  sendMessageOfMorosidad,
  sendMessageOfPropiedades,
  sendMessageMassive,
} from "../service/QueryService";
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

  // Estados para el envio masivo
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");

  // Estado para consultas por atributos
  const [cedula, setCedula] = useState("");
  const [namePerson, setNamePerson] = useState("");
  const [personas, setPersonas] = useState<Persona[]>([]);

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
    const response =  await sendMessageOfMorosidad(personas);
    
    if (response) {
      showToast("success", "Mensajes enviados");
    } 
  }

  const handleSendMessagePropiedades = async () => {
    const response =  await sendMessageOfPropiedades(personas);
    
    if (response) {
      showToast("success", "Mensajes enviados");
    } 
  }

  const handleSendMessageMassive = async (mensaje : string, asunto :string) => {
    const response =  await sendMessageMassive(personas, mensaje, asunto);
    
    if (response) {
      showToast("success", "Mensajes enviados");
    } 
  }

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
  };
}
