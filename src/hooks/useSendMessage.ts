// src/hooks/useSendMessage.ts
import { useState } from "react";
import {
  queryPeopleWithProperties,
  queryPeopleWithDebt,
  sendEmails,
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

  // Enviar correos
  const handleSendMessage = async () => {

    const response = await sendEmails(personas);
    
    if (response) {
      showToast("success", "Correos enviados", "Cargando Resultados");
    }
  };

  // Limpiar
  const handleLimpiar = () => {
    setCedula("");
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

    // Resultados
    personas,

    // Metodo limpiar
    handleLimpiar,

    // Metodos de consulta
    handleQueryMorosidadByFilters,
    handleQueryPeopleWithProperties,

    // Metodo de envio
    handleSendMessage,
  };
}
