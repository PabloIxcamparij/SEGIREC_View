// src/hooks/useSendMessage.ts
import { useState } from "react";
import {
  queryPropiedadesByFilters,
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
  const handleQueryPropiedadesByFilters = async (filtros: QueryBody) => {
    const body: QueryBody = filtros;
    const response = await queryPropiedadesByFilters(body);
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
    const correos = personas.map((p) => p.correo);
    const response = await sendEmails(correos);
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

    // Estados para consulta por atributos
    cedula,
    setCedula,
    namePerson,
    setNamePerson,

    // Resultados
    personas,

    // Metodo limpiar
    handleLimpiar,

    // Metodos de consulta
    handleQueryMorosidadByFilters,
    handleQueryPropiedadesByFilters,

    // Metodo de envio
    handleSendMessage,
  };
}
