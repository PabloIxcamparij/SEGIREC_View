import { createBrowserRouter, redirect } from "react-router";
import LayoutMessages from "./Layout/LayoutMessages";
import LayoutAuth from "./Layout/LayoutAuth";

// SendMessage views
import QueryPropiedades from "./view/queryModules/QueryPropiedades";

// Admin views
import HomeView from "./view/HomeView";
import LockView from "./view/LockView";
import ReportsView from "./view/ReportsView";

// Auth views
import LoginView from "./view/auth/LoginView";

// Servicios
import { checkAuth } from "./service/LoginService";

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
