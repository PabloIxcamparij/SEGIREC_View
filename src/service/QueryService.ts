import type { Persona, QueryBody, QueryResponse, SendEmailsResponse } from "../types";
import { axiosClient } from "../utils/axiosClient";
import {errorHandler} from "../utils/errorHandler";


/*
Routeo de servicios para consultar la tabla Propiedades_No_Declaradas

Consultar por; filtros, cedula, nombre y cargando un archivo
*/

export async function queryPeopleWithProperties(body: QueryBody): Promise<QueryResponse | null> {
  try {
    const { data } = await axiosClient.post<QueryResponse>("/message/queryPeopleWithProperties", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar filtrados");
  }
}

export async function queryPeopleWithDebt(body: QueryBody): Promise<QueryResponse | null> {
   try {
    const { data } = await axiosClient.post<QueryResponse>("/message/queryPeopleWithDebt", body);
    return data;
  } catch (error: any) {
    return errorHandler(error, "consultar filtrados");
  }
}

///////////////////////////////////////////-----------------------------------------------


// Enviar correos
export async function sendEmails(personas : Persona[] ): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axiosClient.post<SendEmailsResponse>("/message/sendMessage", { personas });
    return data;
  } catch (error: any) {
    return errorHandler(error, "enviar correos");
  }
}
