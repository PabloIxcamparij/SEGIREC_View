import axios from "axios";
import type { QueryBody, QueryResponse, SendEmailsResponse } from "../types";

const BASE_URL = "http://localhost:4040/api";

// 🔹 Consultar usuarios filtrados
export async function queryFiltered(body: QueryBody): Promise<QueryResponse | null> {
  try {
    const { data } = await axios.post<QueryResponse>(`${BASE_URL}/query-filtered`, body, {
      headers: { "Content-Type": "application/json" },
    });
    return data;
  } catch (error: any) {
    console.error("Error al consultar filtrados:", error.response?.data || error.message);
    return null;
  }
}

// 🔹 Enviar correos
export async function sendEmails(destinatarios: string[]): Promise<SendEmailsResponse | null> {
  try {
    const { data } = await axios.post<SendEmailsResponse>(
      `${BASE_URL}/send-emails`,
      { destinatarios },
      { headers: { "Content-Type": "application/json" } }
    );
    return data;
  } catch (error: any) {
    console.error("Error al enviar correos:", error.response?.data || error.message);
    return null;
  }
}
