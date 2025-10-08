import { createBrowserRouter, redirect } from "react-router";
import LayoutMessages from "./Layout/LayoutMessages";
import LayoutAuth from "./Layout/LayoutAuth";

// SendMessage views
import QueryMorosidad from "./view/queryModules/QueryMorosidad";
import QueryEnvioMasivo from "./view/queryModules/QueryEnvioMasivo";
import QueryPropiedades from "./view/queryModules/QueryPropiedades";

// Admin views
import HomeView from "./view/HomeView";
import LockView from "./view/LockView";
import ReportsView from "./view/ReportsView";

// Auth views
import LoginView from "./view/auth/LoginView";

// Servicios
import { checkAuth } from "./service/LoginService";
import UserCreate from "./view/auth/adminModules/UserCreate";

// Protección de rutas, si no está autenticado redirige al login
// Esta función se usa como loader en las rutas protegidas
const protectedRoutesLoader = async () => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return redirect("/");
  }
  return null;
};

export const router = createBrowserRouter([
  {
    element: <LayoutMessages />,
    loader: protectedRoutesLoader,
    children: [
      {
        path: "propiedades",
        element: <QueryPropiedades />,
      },
      {
        path: "morosidad",
        element: <QueryMorosidad />,
      },
      {
        path: "envioMasivo",
        element: <QueryEnvioMasivo />,
      },
      {
        path: "home",
        element: <HomeView />,
      },
      {
        path: "lock",
        element: <LockView />,
      },
      {
        path: "reports",
        element: <ReportsView />,
      },
      /// Rutas de administración - Solo accesibles para administradores
      {
        path: "user/create",
        element: <UserCreate />,
      }
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
