// Descripción: Gestiona la carga, filtrado y paginación de las actividades de consulta y envío.
// Incluye estados separados para filtros, paginación y carga, así como lógica memorizada de filtrado.

import { useState, useMemo } from "react";
import type { ConsultaActivity, EnvioActivity } from "../types";
import {
  activitiesOfQuery,
  queryActivitiesMessage,
} from "../service/Utils.service";

// === Tipos de filtros para cada tipo de actividad ===
interface QueryFilters {
  nombre: string;
  detalle: string;
  filtros: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
}

interface MessageFilters {
  nombre: string;
  detalle: string;
  estado: string;
  fechaInicio: string;
  fechaFin: string;
}

export function useLogActivity() {
  // === Estados de filtros ===
  const [queryFilters, setQueryFilters] = useState<QueryFilters>({
    nombre: "",
    detalle: "",
    filtros: "",
    estado: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [messageFilters, setMessageFilters] = useState<MessageFilters>({
    nombre: "",
    detalle: "",
    estado: "",
    fechaInicio: "",
    fechaFin: "",
  });

  // === Estados de datos ===
  const [allConsultas, setAllConsultas] = useState<ConsultaActivity[]>([]);
  const [allEnvios, setAllEnvios] = useState<EnvioActivity[]>([]);

  // === Estados de paginación y carga ===
  const [queryPage, setQueryPage] = useState(1);
  const [messagePage, setMessagePage] = useState(1);
  const [isQueryLoading, setIsQueryLoading] = useState(false);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [hasMoreMessages, setHasMoreMessages] = useState(true);

  // === Función: Cargar actividades de consultas con paginación ===
  const fetchQueries = async (page: number) => {
    if (isQueryLoading) return;
    setIsQueryLoading(true);

    try {
      const data: ConsultaActivity[] = await activitiesOfQuery(page);
      if (data && data.length > 0) {
        setAllConsultas((prev) => {
          const nuevos = data.filter((n) => !prev.some((p) => p.id === n.id));
          return [...prev, ...nuevos];
        });
      }
    } catch (error) {
      console.error("Error cargando consultas:", error);
    } finally {
      setIsQueryLoading(false);
    }
  };

  // === Función: Cargar actividades de envíos con control de más datos ===
  const fetchMessages = async (page: number) => {
    if (isMessageLoading || !hasMoreMessages) return;
    setIsMessageLoading(true);

    try {
      const data: EnvioActivity[] = await queryActivitiesMessage(page);
      if (data && data.length > 0) {
        setAllEnvios((prev) => {
          const nuevos = data.filter((n) => !prev.some((p) => p.id === n.id));
          return [...prev, ...nuevos];
        });
      } else {
        setHasMoreMessages(false);
      }
    } catch (error) {
      console.error("Error cargando envíos:", error);
    } finally {
      setIsMessageLoading(false);
    }
  };

  // === Función auxiliar: Coincidencia parcial (case-insensitive) ===
  const isMatch = (text: string | undefined, filter: string) => {
    if (!filter) return true;
    if (!text) return false;
    return text.toLowerCase().includes(filter.toLowerCase());
  };

  // === Filtrado memorizado de consultas ===
  const filteredConsultas = useMemo(() => {
    const hasFilters = Object.values(queryFilters).some(
      (value) => value !== ""
    );
    if (!hasFilters) return allConsultas;

    return allConsultas.filter((c) => {
      if (!isMatch(c.Usuario?.Nombre, queryFilters.nombre)) return false;
      if (!isMatch(c.Detalle, queryFilters.detalle)) return false;
      if (!isMatch(c.Filtros?.FiltrosAplicados, queryFilters.filtros))
        return false;
      if (
        queryFilters.estado &&
        queryFilters.estado !== "Todos" &&
        c.Estado !== queryFilters.estado
      )
        return false;
      if (queryFilters.fechaInicio || queryFilters.fechaFin) {
        const itemTime = new Date(c.createdAt).getTime();
        const inicioTime = queryFilters.fechaInicio
          ? new Date(queryFilters.fechaInicio).getTime()
          : null;
        const finTime = queryFilters.fechaFin
          ? new Date(queryFilters.fechaFin).getTime()
          : null;

        if (inicioTime && itemTime < inicioTime) return false;
        if (finTime && itemTime > finTime) return false;
      }
      return true;
    });
  }, [allConsultas, queryFilters]);

  // === Filtrado memorizado de envíos ===
  const filteredEnvios = useMemo(() => {
    const hasFilters = Object.values(messageFilters).some(
      (value) => value !== ""
    );
    if (!hasFilters) return allEnvios;

    return allEnvios.filter((e) => {
      if (!isMatch(e.Usuario?.Nombre, messageFilters.nombre)) return false;
      if (!isMatch(e.Detalle, messageFilters.detalle)) return false;
      if (
        messageFilters.estado &&
        messageFilters.estado !== "Todos" &&
        e.Estado !== messageFilters.estado
      )
        return false;
      if (queryFilters.fechaInicio || queryFilters.fechaFin) {
        const itemTime = new Date(e.createdAt).getTime();
        const inicioTime = queryFilters.fechaInicio
          ? new Date(queryFilters.fechaInicio).getTime()
          : null;
        const finTime = queryFilters.fechaFin
          ? new Date(queryFilters.fechaFin).getTime()
          : null;

        if (inicioTime && itemTime < inicioTime) return false;
        if (finTime && itemTime > finTime) return false;
      }
      return true;
    });
  }, [allEnvios, messageFilters]);

  // === Manejadores de cambio y limpieza de filtros ===
  const handleQueryFilterChange = (
    field: keyof QueryFilters,
    value: string
  ) => {
    setQueryFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleMessageFilterChange = (
    field: keyof MessageFilters,
    value: string
  ) => {
    setMessageFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleClearQueryFilters = () => {
    setQueryFilters({
      nombre: "",
      detalle: "",
      filtros: "",
      estado: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  const handleClearMessageFilters = () => {
    setMessageFilters({
      nombre: "",
      detalle: "",
      estado: "",
      fechaInicio: "",
      fechaFin: "",
    });
  };

  // === Manejadores de carga adicional (paginación) ===
  const handleLoadMoreQueries = () => {
    const nextPage = queryPage + 1;
    setQueryPage(nextPage);
    fetchQueries(nextPage);
  };

  const handleLoadMoreMessages = () => {
    const nextPage = messagePage + 1;
    setMessagePage(nextPage);
    fetchMessages(nextPage);
  };

  // === Retorno del hook ===
  return {
    // Filtros de consultas
    queryFilters,
    handleQueryFilterChange,
    handleClearQueryFilters,
    filteredConsultas,
    allConsultas,

    // Filtros de envíos
    messageFilters,
    handleMessageFilterChange,
    handleClearMessageFilters,
    filteredEnvios,
    allEnvios,

    // Carga y paginación
    fetchQueries,
    fetchMessages,
    handleLoadMoreQueries,
    handleLoadMoreMessages,
    isQueryLoading,
    isMessageLoading,
    hasMoreMessages,
  };
}
