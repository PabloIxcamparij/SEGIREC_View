// src/hooks/useSendMessage.ts
import { useState } from "react";
import { queryFiltered, sendEmails } from "../service/SendMessajeService";
import type { Persona, QueryBody } from "../types";

export function useSendMessage() {
  const [ciudad, setCiudad] = useState("");
  const [servicio, setServicio] = useState("");
  const [valor, setValor] = useState("");
  const [valorTipo, setValorTipo] = useState<"Nah" | "Mayor" | "Menor">("Nah");

  const [personas, setPersonas] = useState<Persona[]>([]);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // 🔹 Consultar
  const handleConsultar = async (e: React.FormEvent) => {
    e.preventDefault();

    const body: QueryBody = {};
    
    if (ciudad) body.ciudad = ciudad;
    if (servicio) body.servicio = servicio;

    if (valor && valorTipo !== "Nah") {
      body.valor = {};
      const v = Number(valor);
      if (valorTipo === "Mayor") body.valor.mayor = v;
      if (valorTipo === "Menor") body.valor.menor = v;
    }

    const response = await queryFiltered(body);

    if (response) {
      setPersonas(response.personas);
      setMensaje(null);
    }
  };

  // 🔹 Enviar correos
  const handleEnviar = async () => {
    const correos = personas.map((p) => p.correo);
    const response = await sendEmails(correos);
    if (response) {
      setMensaje(response.message);
    }
  };

  // 🔹 Limpiar
  const handleLimpiar = () => {
    setPersonas([]);
    setCiudad("");
    setServicio("");
    setValor("");
    setValorTipo("Nah");
    setMensaje(null);
  };

  return {
    ciudad,
    setCiudad,
    servicio,
    setServicio,
    valor,
    setValor,
    valorTipo,
    setValorTipo,
    personas,
    mensaje,
    handleConsultar,
    handleEnviar,
    handleLimpiar,
  };
}
