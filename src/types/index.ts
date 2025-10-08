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
  onlyWithDebt?: boolean;
  onlyWithMultipleProperties?: boolean;
};

export type Persona = {
  cedula: string;
  nombre: string;
  apellido: string;
  correo: string;
  distrito: string;
  numeroDeFinca: string;
  
  //Morosidad
  servicio: string;
  valorDeLaDeuda: number;
  fechaVencimiento: string;

  // Propiedades
  areaDeLaPropiedad: number;
  fechaVigencia: string;
  estadoPropiedad: string;
  montoImponible: number;
  codigoBaseImponible: string;
};

export type User = {
  id: number;
  Nombre: string;
  Correo: string;
  Rol: string;
  Activo: boolean;
};

export type QueryResponse = {
  personas: Persona[];
};

export type SendEmailsResponse = {
  message: string;
  destinatarios: string[];
};
