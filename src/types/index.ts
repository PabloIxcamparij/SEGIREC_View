// src/types.ts
export type QueryBody = {
  distritos?: string[];
  servicios?: string[];
  deudaMinima?: number | "";
  deudaMaxima?: number | "";
  cedula?: string;
  nombre?: string;
  codigoBaseImponible?: string[];
  areaMaxima?: number | "";
  areaMinima?: number | "";
  monImponibleMinimo?: number | "";
  monImponibleMaximo?: number | "";
};

export type Persona = {
  cedula: string;
  nombre: string;
  apellido: string;
  correo: string;
  distrito: string;
  servicio: string;
  valorDeLaDeuda: number;
  areaDeLaPropiedad: number;
  fechaVencimiento: string;
  numeroDeFinca: string
};

export type QueryResponse = {
  personas: Persona[];
};

export type SendEmailsResponse = {
  message: string;
  destinatarios: string[];
};
