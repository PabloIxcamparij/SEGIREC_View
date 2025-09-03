// src/hooks/useSendMessage.ts
import { useState } from "react";
import {
  queryPeopleFilters,
  queryPersonByCedula,
  queryPersonByName,
  queryPersonByArchive,
  sendEmails,
} from "../service/SendMessajeService";
import type { Persona, QueryBody } from "../types";
import { showToast } from "../utils/toastUtils";

export function useSendMessage() {
  const [ciudad, setCiudad] = useState("");
  const [servicio, setServicio] = useState([]);
  const [deudaMinima, setDeudaMinima] = useState<number | "">("");
  const [deudaMaxima, setDeudaMaxima] = useState<number | "">("");
  const [idCard, setIdCard] = useState("");
  const [namePerson, setNamePerson] = useState("");

  const [personas, setPersonas] = useState<Persona[]>([]);

  //Consultar personas por filtros
  const handleQueryPeopleFilters = async (filtros: QueryBody) => {
    const body: QueryBody = {
      ...(filtros.ciudad && { ciudad: filtros.ciudad }),
      ...(filtros.servicio && { servicio: filtros.servicio }),
      ...(filtros.deudaMinima !== "" &&
        filtros.deudaMinima !== undefined && {
          deudaMinima: filtros.deudaMinima,
        }),
      ...(filtros.deudaMaxima !== "" &&
        filtros.deudaMaxima !== undefined && {
          deudaMaxima: filtros.deudaMaxima,
        }),
    };

    const response = await queryPeopleFilters(body);

    if (response) {
      setPersonas(response.personas);
      showToast("success", "Consulta exitosa", "Cargando Resultados");
    }
  };

  //Consultar a una persona por Cedula
  const handleQueryPersonByCedula = async (cedula: string) => {
    const body: any = { cedula };
    const response = await queryPersonByCedula(body);

    if (response) {
      setPersonas([response]);
      showToast("success", "Consulta exitosa", "Cargando Resultados");
    }
  };

  //Consultar a una persona por Nombre
  const handleQueryPersonByName = async (nombre: string) => {
    const body: any = { nombre };
    const response: any = await queryPersonByName(body);
    if (response) {
      setPersonas(response.personas);
      showToast("success", "Consulta exitosa", "Cargando Resultados");
    }
  };

  //Consultar a una persona por Archivo
  const handleQueryPersonByArchive = async (cedulas: string[]) => {
    const body: any = { cedulas };

    const response = await queryPersonByArchive(body);

    if (response) {
      setPersonas(response.personas);
      showToast("success", "Archivo procesado", "Cargando Resultados");
    }
  };

  // Enviar correos
  const handleEnviar = async () => {
    const correos = personas.map((p) => p.correo);
    const response = await sendEmails(correos);
    if (response) {
      showToast("success", "Correos enviados", "Cargando Resultados");
    }
  };

  // Limpiar
  const handleLimpiar = () => {
    setPersonas([]);
    setCiudad("");
    setIdCard("");
    setServicio([]);
    setNamePerson("");
    setDeudaMinima("");
    setDeudaMaxima("");
  };

  return {
    ciudad,
    setCiudad,
    servicio,
    setServicio,
    deudaMinima,
    setDeudaMinima,
    deudaMaxima,
    setDeudaMaxima,
    idCard,
    setIdCard,
    namePerson,
    setNamePerson,
    personas,
    handleQueryPeopleFilters,
    handleQueryPersonByCedula,
    handleQueryPersonByName,
    handleQueryPersonByArchive,
    handleEnviar,
    handleLimpiar,
  };
}
