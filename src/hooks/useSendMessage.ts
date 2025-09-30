// src/hooks/useSendMessage.ts
import { useState } from "react";
import {
  queryPropiedadesByFilters,
  queryPeopleWithDebt,
  queryPropiedadesByCedula,
  queryPropiedadesByName,
  queryPropiedadesByArchive,
  sendEmails,
} from "../service/QueryService";
import type { Persona, QueryBody } from "../types";
import { showToast } from "../utils/toastUtils";

export function useQueryPropiedades() {
  // Estados para los filtros
  const [distrito, setDistrito] = useState<string[]>([]);
  const [servicio, setServicio] = useState<string[]>([]);
  const [areaMinima, setAreaMinima] = useState<number | "">("");
  const [areaMaxima, setAreaMaxima] = useState<number | "">("");

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

  //Consultar a una persona por Cedula
  const handleQueryPropiedadesByCedula = async (cedula: string) => {
    const body: any = { cedula };

    const response = await queryPropiedadesByCedula(body);

    if (response) {
      setPersonas([response]);
      showToast("success", "Consulta exitosa", "Cargando Resultados");
    }
  };

  //Consultar a una persona por Nombre
  const handleQueryPropiedadesByName = async (nombre: string) => {
    const body: any = { nombre };
    const response: any = await queryPropiedadesByName(body);
    if (response) {
      setPersonas(response.personas);
      showToast("success", "Consulta exitosa", "Cargando Resultados");
    }
  };

  //Consultar a una persona por Archivo
  const handleQueryPropiedadesByArchive = async (cedulas: string[]) => {
    const body: any = { cedulas };

    const response = await queryPropiedadesByArchive(body);

    if (response) {
      setPersonas(response.personas);
      showToast("success", "Archivo procesado", "Cargando Resultados");
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
    setDistrito([]);
    setServicio([]);
    setPersonas([]);
  };

  return {
    distrito,
    setDistrito,
    areaMinima,
    setAreaMinima,
    areaMaxima,
    setAreaMaxima,

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
    handleQueryPropiedadesByName,
    handleQueryMorosidadByFilters,
    handleQueryPropiedadesByCedula,
    handleQueryPropiedadesByArchive,
    handleQueryPropiedadesByFilters,

    // Metodo de envio
    handleSendMessage,
  };
}
