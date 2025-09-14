// src/types.ts
export type QueryBody = {
  distritos?: string[];
  servicios?: string[];
  deudaMinima?: number | "";
  deudaMaxima?: number | "";
};

export type Persona = {
  cedula: string;
  nombre: string;
  apellido: string;
  correo: string;
  distrito: string;
  servicio: string;
  valorDeLaDeuda: number;
};

export type QueryResponse = {
  personas: Persona[];
};

export type SendEmailsResponse = {
  message: string;
  destinatarios: string[];
};
