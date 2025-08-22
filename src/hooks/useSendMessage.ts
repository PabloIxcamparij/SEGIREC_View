// src/hooks/useSendMessage.ts
import { useState } from "react";
import { queryFiltered, sendEmails } from "../service/SendMessajeService";
import type { Persona, QueryBody } from "../types";

export function useSendMessage() {
  const [ciudad, setCiudad] = useState("");
  const [servicio, setServicio] = useState("");
  const [deudaMinima, setDeudaMinima] = useState<number | "">("");
  const [deudaMaxima, setDeudaMaxima] = useState<number | "">("");

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  //Consultar
  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault();

    const body: QueryBody = {};

    if (ciudad) body.ciudad = ciudad;
    if (servicio) body.servicio = servicio;

    if (deudaMinima || deudaMaxima) {
      if (deudaMinima) body.deudaMinima = Number(deudaMinima);
      if (deudaMaxima) body.deudaMaxima = Number(deudaMaxima);
    }

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
    personas,
    mensaje,
    handleConsultar,
    handleEnviar,
    handleLimpiar,
  };
}
