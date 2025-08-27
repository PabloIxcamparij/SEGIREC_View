// src/hooks/useSendMessage.ts
import { useState } from "react";
import { queryFiltered, sendEmails } from "../service/SendMessajeService";
import type { Persona, QueryBody } from "../types";

export function useSendMessage() {
  const [ciudad, setCiudad] = useState("");
  const [servicio, setServicio] = useState("");
  const [deudaMinima, setDeudaMinima] = useState<number | "">("");
  const [deudaMaxima, setDeudaMaxima] = useState<number | "">("");
  const [idCard, setIdCard] = useState("");
  const [namePerson, setNamePerson] = useState("");

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  //Consultar
  const handleConsultar = async (filtros: QueryBody) => {
    const body: QueryBody = {
      ...(filtros.ciudad && { ciudad: filtros.ciudad }),
      ...(filtros.servicio && { servicio: filtros.servicio }),
      ...(filtros.deudaMinima !== "" && filtros.deudaMinima !== undefined && {
        deudaMinima: filtros.deudaMinima,
      }),
      ...(filtros.deudaMaxima !== "" && filtros.deudaMaxima !== undefined && {
        deudaMaxima: filtros.deudaMaxima,
      }),
    };

    const response = await queryFiltered(body);

    if (response) {
      setPersonas(response.personas);
      setMensaje(null);
    }
  };

  // Enviar correos
  const handleEnviar = async () => {
    const correos = personas.map((p) => p.correo);
    const response = await sendEmails(correos);
    if (response) {
      setMensaje(response.message);
    }
  };

  // Limpiar
  const handleLimpiar = () => {
    setPersonas([]);
    setCiudad("");
    setServicio("");
    setDeudaMinima("");
    setDeudaMaxima("");
    setMensaje(null);
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
    mensaje,
    handleConsultar,
    handleEnviar,
    handleLimpiar,
  };
}
