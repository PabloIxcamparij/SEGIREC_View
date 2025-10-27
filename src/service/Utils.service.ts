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

export async function activitiesOfQuery(page = 1) {
  try {
    const { data } = await axiosClient.get(`/utils/activitiesOfQuery?page=${page}`);
    return data;
  } catch (error: any) {
    errorHandler(error, "Cargando las actividades del sistema");
  }
}

export async function queryActivitiesMessage(page = 1) {
  try {
    const { data } = await axiosClient.get(`/utils/activitiesOfMessage?page=${page}`);
    return data;
  } catch (error: any) {
    errorHandler(error, "Cargando las actividades del sistema");
  }
}