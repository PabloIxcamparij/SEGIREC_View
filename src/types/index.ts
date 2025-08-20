export type QueryBody = {
  ciudad?: string;
  servicio?: string;
  valor?: {
    menor?: number;
    mayor?: number;
  };
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
