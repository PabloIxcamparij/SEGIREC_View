import { axiosClient } from "../utils/axiosClient";
import { errorHandler } from "../utils/errorHandler";

export async function queryServiceCatalogo() {
  try {
    const { data } = await axiosClient.get("/utils/service");
    return data;
  } catch (error: any) {
    errorHandler(error, "Cargado Catalogo");
  }
}

export async function queryBaseImponibleCatalogo() {
  try {
    const { data } = await axiosClient.get("/utils/baseImponible");
    return data;
  } catch (error: any) {
    errorHandler(error, "Cargado Catalogo");
  }
}

export async function queryActivities() {
  try {
    console.log("first")
    const { data } = await axiosClient.get("/utils/activities");
    return data;
  } catch (error: any) {
    errorHandler(error, "Cargado Las Actividades del sistema");
  }
}

