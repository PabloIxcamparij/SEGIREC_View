import type { Persona, SendEmailsResponse } from "../types";
import { axiosClient } from "../utils/axiosClient";
import {errorHandler} from "../utils/errorHandler";

// Enviar correos
export async function sendMessageOfMorosidad(personas : Persona[], isPrioritary: boolean ): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axiosClient.post<SendEmailsResponse>("/message/sendMessageOfMorosidad", { personas, isPrioritary });
    return data;
  } catch (error: any) {
    return errorHandler(error, "enviar mensajes");
  }
}

export async function sendMessageOfPropiedades(personas : Persona[], isPrioritary: boolean ): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axiosClient.post<SendEmailsResponse>("/message/sendMessageOfPropiedades", { personas, isPrioritary });
    return data;
  } catch (error: any) {
    return errorHandler(error, "enviar mensajes");
  }
}

export async function sendMessageMassive(personas : Persona[], mensaje : string, asunto: string, isPrioritary: boolean ): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axiosClient.post<SendEmailsResponse>("/message/sendMessageMassive", { personas, mensaje, asunto, isPrioritary });
    return data;
  } catch (error: any) {
    return errorHandler(error, "enviar mensajes");
  }
}


// Solicitar y confirmar código para mensajes prioritarios
export const requestCodePrioritaryMessage = async () => {
  try {
    await axiosClient.post("/message/requestCodePrioritaryMessage");
  } catch (error: any) {
    return errorHandler(error, "solicitar código de mensaje prioritario");
  }
} 

export const confirmCodePrioritaryMessage = async (code: string): Promise<boolean> => {
  try {
    const { data } = await axiosClient.post("/message/confirmCodePrioritaryMessage", { code });
    return data;
  } catch (error: any) {
    errorHandler(error, "confirmar código de mensaje prioritario");
    return false;
  }
}