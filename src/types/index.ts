// src/types.ts
export type QueryBody = {
  ciudad: string | null;
  servicio: string | null;
  deudaMinima: number | null | '';
  deudaMaxima: number | null | '';
};

export type Persona = {
  correo: string;
  ciudad: string;
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
