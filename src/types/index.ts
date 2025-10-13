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
