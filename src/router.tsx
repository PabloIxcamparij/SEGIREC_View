import { createBrowserRouter, redirect } from "react-router";
import LayoutMessages from "./Layout/LayoutMessages";
import LayoutAuth from "./Layout/LayoutAuth";

// SendMessage views
import QueryMorosidad from "./view/queryModules/QueryMorosidad";
import QueryEnvioMasivo from "./view/queryModules/QueryEnvioMasivo";
import QueryPropiedades from "./view/queryModules/QueryPropiedades";

import HomeView from "./view/HomeView";

// Admin views
import AdminView from "./view/adminModules/AdminView";
import LogsView from "./view/adminModules/LogsView";
import ReportsView from "./view/ReportsView";

// Auth views
import LoginView from "./view/auth/LoginView";

// Servicios
import { verifyRol, verifyAuth } from "./service/Auth.service";

// Protección de rutas, si no está autenticado redirige al login
// Esta función se usa como loader en las rutas protegidas

const protectRoute = async () => {
  const isAuth = await verifyAuth();

  if (!isAuth) {
    return redirect("/");
  }
};

const createRoleLoader = (requiredRole: string) => async () => {
  // Llamamos al servicio con el rol requerido
  protectRoute();

  const isAllowed = await verifyRol(requiredRole);

  if (!isAllowed) {
    return redirect("/home");
  }
  return null;
};

export const router = createBrowserRouter([
  {
    element: <LayoutMessages />,
    loader: protectRoute,
    children: [
      {
        path: "propiedades",
        loader: createRoleLoader("Propiedades"),
        element: <QueryPropiedades />,
      },
      {
        path: "morosidad",
        loader: createRoleLoader("Morosidad"),
        element: <QueryMorosidad />,
      },
      {
        path: "envioMasivo",
        loader: createRoleLoader("EnvioMasivo"),
        element: <QueryEnvioMasivo />,
      },
      {
        path: "home",
        element: <HomeView />,
      },
      /// Rutas de administración - Solo accesibles para administradores
      {
        path: "admin",
        loader: createRoleLoader("Administrador"),
        element: <AdminView />,
      },
      {
        path: "logs",
        loader: createRoleLoader("Auditor"),
        element: <LogsView />,
      },
      {
        path: "reports",
        element: <ReportsView />,
      },
    ],
  },
  {
    path: "/",
    element: <LayoutAuth />,
    children: [
      {
        index: true,
        element: <LoginView />,
      },
    ],
  },
]);
