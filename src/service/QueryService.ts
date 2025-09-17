import type { Persona, QueryBody, QueryResponse, SendEmailsResponse } from "../types";
import { axiosClient } from "../utils/axiosClient";
import {errorHandler} from "../utils/errorHandler";



/*
Routeo de servicios para consultar la tabla Propiedades_No_Declaradas

Consultar por; filtros, cedula, nombre y cargando un archivo
*/

export async function queryPropiedadesByFilters(body: QueryBody): Promise<QueryResponse | null> {
  try {
    const { data } = await axiosClient.post<QueryResponse>("/message/queryPropiedadesByFilters", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar filtrados");
  }
}
// Consultar por cédula
export async function queryPropiedadesByCedula(body: string): Promise<Persona | null> {
  try {
    const { data } = await axiosClient.post<Persona>("/message/queryPropiedadesByCedula", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar por cédula");
  }
}

export async function queryPropiedadesByName(body: string): Promise<Persona | null> {
  try {
    const { data } = await axiosClient.post<Persona>("/message/queryPropiedadesByName", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar por nombre");
  }
}

export async function queryPropiedadesByArchive(body: string[]): Promise<QueryResponse | null> {
  try {
    const { data } = await axiosClient.post<QueryResponse>("/message/queryPropiedadesByArchive", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar por archivo");
  }
}

///////////////////////////////////////////-----------------------------------------------


// Enviar correos
export async function sendEmails(destinatarios: string[]): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axiosClient.post<SendEmailsResponse>("/message/sendMessage", { destinatarios });
    return data;
  } catch (error: any) {
    return errorHandler(error, "enviar correos");
  }
}
