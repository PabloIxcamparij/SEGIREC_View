// src/hooks/useSendMessaje.ts
import { useState } from "react";
import axios from "axios";

interface FiltrosBody {
  ciudad?: string;
  servicio?: string;
  valor?: {
    menor?: number;
    mayor?: number;
  };
}

export function useSendMessaje() {
  const [resultados, setResultados] = useState<any[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  // Construye dinámicamente el body con los filtros activos
  const buildRequestBody = (
    filtros: {
      distrito: string;
      tipoServicio: string;
      valorDeudaMin: string;
      valorDeudaMax: string;
    },
    filtrosActivos: {
      distrito: boolean;
      tipoServicio: boolean;
      valorDeuda: boolean;
    }
  ): FiltrosBody => {
    const body: FiltrosBody = {};

    if (filtrosActivos.distrito && filtros.distrito) {
      body.ciudad = filtros.distrito;
    }

    if (filtrosActivos.tipoServicio && filtros.tipoServicio) {
      body.servicio = filtros.tipoServicio;
    }

    if (filtrosActivos.valorDeuda) {
      body.valor = {};
      if (filtros.valorDeudaMin) {
        body.valor.mayor = Number(filtros.valorDeudaMin);
      }
      if (filtros.valorDeudaMax) {
        body.valor.menor = Number(filtros.valorDeudaMax);
      }
    }

    return body;
  };

  // Consulta a la API
  const consultar = async (
    filtros: any,
    filtrosActivos: any
  ) => {
    setCargando(true);
    setMensaje(null);

    try {
      const body = buildRequestBody(filtros, filtrosActivos);

      const response = await axios.post("/morosidad/consulta", body);

      if (response.data?.resultados) {
        setResultados(response.data.resultados);
        setMensaje(`Se encontraron ${response.data.resultados.length} personas.`);
      } else {
        setResultados([]);
        setMensaje("No se encontraron resultados.");
      }
    } catch (error) {
      console.error("Error en consulta:", error);
      setMensaje("Error al consultar la base de datos.");
    } finally {
      setCargando(false);
    }
  };

  // Enviar correos
  const enviarMensajes = async (ids: number[]) => {
    if (!ids.length) {
      setMensaje("Debes seleccionar al menos una persona.");
      return;
    }

    setCargando(true);
    setMensaje(null);

    try {
      const response = await axios.post("/morosidad/enviar", { ids });

      if (response.data?.destinatarios) {
        setMensaje(
          `Correos enviados a ${response.data.destinatarios.length} personas.`
        );
      } else {
        setMensaje("No se pudo completar el envío.");
      }
    } catch (error) {
      console.error("Error al enviar correos:", error);
      setMensaje("Error al enviar los correos.");
    } finally {
      setCargando(false);
    }
  };

  return {
    resultados,
    cargando,
    mensaje,
    consultar,
    enviarMensajes,
    setResultados,
    setMensaje,
  };
}
