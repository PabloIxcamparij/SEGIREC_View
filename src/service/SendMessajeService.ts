import axios from "axios";
import type { QueryBody, QueryResponse, SendEmailsResponse } from "../types";

const BASE_URL = "https://silver-tribble-9779qq49gwjr276w4-4040.app.github.dev/message";
const token = localStorage.getItem("AuthToken");

// 🔹 Consultar usuarios filtrados
export async function queryFiltered(body: QueryBody): Promise<QueryResponse | null> {
  try {
    const { data } = await axios.post<QueryResponse>(
      `${BASE_URL}/queryPeople`,
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ token en header
        },
      }
    );
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
      `${BASE_URL}/sendMessage`,
      { destinatarios },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ token
        },
      }
    );
    return data;
  } catch (error: any) {
    console.error("Error al enviar correos:", error.response?.data || error.message);
    return null;
  }
}