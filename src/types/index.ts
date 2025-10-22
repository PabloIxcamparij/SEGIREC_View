// src/types.ts
export type QueryBody = {
  distritos?: string[];
  servicios?: string[];
  deudaMinima?: number | "";
  deudaMaxima?: number | "";
  cedula?: string;
  nombre?: string;
  numeroFinca?: string;
  numeroDerecho?: string;
  codigoBaseImponible?: string[];
  areaMaxima?: number | "";
  areaMinima?: number | "";
  monImponibleMinimo?: number | "";
  monImponibleMaximo?: number | "";
  unicamenteConDeudas?: boolean;
  unicamenteConVariasPropiedades?: boolean;
};

export type Persona = {
  cedula: string;
  nombre: string;
  correo: string;
  distrito: string;
  numeroDeFinca: string;
  telefono: string;
  direccion: string;
  
  //Morosidad
  servicio: string;
  numeroDeCuenta: string;
  CodServicio: string;
  valorDeLaDeuda: number;
  fechaVencimiento: string;
  periodo: number;

  // Propiedades
  areaDeLaPropiedad: number;
  fechaVigencia: string;
  estadoPropiedad: string;
  montoImponible: number;
  codigoBaseImponible: string;
  numeroDeDerecho: string;
  
  //Envio masivo
  detalle: string;
};

export type User = {
  id: number;
  Nombre: string;
  Correo: string;
  Rol: string;
  Activo: boolean;
  Clave?: string; // Opcional, ya que no siempre se envía
};

export type QueryResponse = {
  personas: Persona[];
};

export type SendEmailsResponse = {
  message: string;
  destinatarios: string[];
};

/**
 * Tipos para el control de actividades
 */

// Tipo base (padre)
export type ActivityBase = {
  id: number;
  IdUsuario: number;
  Tipo: string;
  Detalle: string;
  Estado: string;
  createdAt: string;
  updatedAt: string;
  Usuario: {
    id: number;
    Nombre: string;
    Correo: string;
  };
};

// Hijo 1: Consultas
export type ConsultaActivity = ActivityBase & {
  Filtros: {
    id: number;
    FiltrosAplicados: string;
  }
};

// Hijo 2: Envío de mensajes
export type EnvioActivity = ActivityBase & {
  Envios: {
    id: number;
    NumeroDeMensajes: number;
    NumeroDeCorreosEnviadosCorrectamente: number;
    NumeroDeWhatsAppEnviadosCorrectamente: number;
  }
};