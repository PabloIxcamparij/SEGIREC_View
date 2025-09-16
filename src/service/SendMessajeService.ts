import type { Persona, QueryBody, QueryResponse, SendEmailsResponse } from "../types";
import { axiosClient } from "../utils/axiosClient";
import {errorHandler} from "../utils/errorHandler";

// Consultar usuarios filtrados
export async function queryPeopleFilters(body: QueryBody): Promise<QueryResponse | null> {
  try {
    const { data } = await axiosClient.post<QueryResponse>("/message/queryPeople", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar filtrados");
  }
}

// Consultar por cédula
export async function queryPersonByCedula(body: string): Promise<Persona | null> {
  try {
    const { data } = await axiosClient.post<Persona>("/message/queryPersonByCedula", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar por cédula");
  }
}

// Consultar por nombre
export async function queryPersonByName(body: string): Promise<Persona | null> {
  try {
    const { data } = await axiosClient.post<Persona>("/message/queryPersonByName", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar por nombre");
  }
}

// Consultar por archivo
export async function queryPersonByArchive(body: string[]): Promise<QueryResponse | null> {
  try {
    const { data } = await axiosClient.post<QueryResponse>("/message/queryPersonByArchive", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar por archivo");
  }
}

// Enviar correos
export async function sendEmails(destinatarios: string[]): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axiosClient.post<SendEmailsResponse>("/message/sendMessage", { destinatarios });
    return data;
  } catch (error: any) {
    return errorHandler(error, "enviar correos");
  }
}
