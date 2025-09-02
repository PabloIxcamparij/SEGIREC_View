import { createBrowserRouter } from "react-router";
import LayoutMessages from "./Layout/LayoutMessages";
import LayoutAuth from "./Layout/LayoutAuth";

// SendMessage views
import QueryFilters from "./view/SendMessageQueryByFilters";
import QueryAttributes from "./view/SendMessageQueryByAttributes";
import QueryArchive from "./view/SendMessageQueryByArchive";

// Admin views
import HomeView
  from "./view/HomeView";
import LockView from "./view/LockView";
import ReportsView from "./view/ReportsView";

// Auth views
import LoginView from "./view/auth/LoginView";

export const router = createBrowserRouter([
  {
    element: <LayoutMessages />,
    children: [
      {
        path: "SendMessage",
        element: <QueryFilters />,
      },
      {
        path: "SendMessageById",
        element: <QueryAttributes />,
      },
      {
        path: "SendMessageByArchive",
        element: <QueryArchive />,
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
  }
]);
