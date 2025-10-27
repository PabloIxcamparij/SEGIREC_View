import type { Persona, SendEmailsResponse } from "../types";
import { axiosClient } from "../utils/axiosClient";
import {errorHandler} from "../utils/errorHandler";

// Enviar correos
export async function sendMessageOfMorosidad(personas : Persona[] ): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axiosClient.post<SendEmailsResponse>("/message/sendMessageOfMorosidad", { personas });
    return data;
  } catch (error: any) {
    return errorHandler(error, "enviar mensajes");
  }
}

export async function sendMessageOfPropiedades(personas : Persona[] ): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axiosClient.post<SendEmailsResponse>("/message/sendMessageOfPropiedades", { personas });
    return data;
  } catch (error: any) {
    return errorHandler(error, "enviar mensajes");
  }
}

export async function sendMessageMassive(personas : Persona[], mensaje : string, asunto: string ): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axiosClient.post<SendEmailsResponse>("/message/sendMessageMassive", { personas, mensaje, asunto });
    return data;
  } catch (error: any) {
    return errorHandler(error, "enviar mensajes");
  }
}
