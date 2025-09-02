import { Toast } from "primereact/toast";

let toast: Toast | null = null;

export const setToastRef = (ref: Toast | null) => {
  toast = ref;
};

export const showToast = (
  severity: "success" | "info" | "warn" | "error",
  summary: string,
  detail?: string
) => {
  toast?.show({ severity, summary, detail });
};
