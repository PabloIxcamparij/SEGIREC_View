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
import { checkAdmin, checkAuth } from "./service/LoginService";
import AdminView from "./view/auth/adminModules/AdminView";

// Protección de rutas, si no está autenticado redirige al login
// Esta función se usa como loader en las rutas protegidas
const protectedRoutesLoader = async () => {
  const isAuthenticated = await checkAuth();
  if (!isAuthenticated) {
    return redirect("/");
  }
  return null;
};

const isAdminLoader = async () => {
  const isAdmin = await checkAdmin();
  if (!isAdmin) {
    return redirect("/home");
  }
  return null;
}

export const router = createBrowserRouter([
  {
    element: <LayoutMessages />,
    loader: protectedRoutesLoader,
    children: [
      {
        path: "propiedades",
        loader: protectedRoutesLoader,
        element: <QueryPropiedades />,
      },
      {
        path: "morosidad",
        loader: protectedRoutesLoader,
        element: <QueryMorosidad />,
      },
      {
        path: "envioMasivo",
        loader: protectedRoutesLoader,
        element: <QueryEnvioMasivo />,
      },
      {
        path: "home",
        element: <HomeView />,
      },
      /// Rutas de administración - Solo accesibles para administradores
      {
        path: "admin",
        loader: isAdminLoader,
        element: <AdminView />,
        
      },
      {
        path: "lock",
        element: <LockView />,
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
