// src/main.tsx
import { Suspense, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import "./index.css";
import { router } from "./router";
import { Toast } from "primereact/toast";
import { setToastRef } from "./utils/toastUtils.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Suspense fallback={<div>Cargando...</div>}>
      <Toast ref={(el) => setToastRef(el)} />
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
