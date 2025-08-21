import { createBrowserRouter } from "react-router";
import Layout from "./Layout/Layout";
import SendFilteredEmailsView from "./view/SendMessageView";
import HomeView
 from "./view/HomeView";

import LockView from "./view/LockView";
import ReportsView from "./view/ReportsView";
import LoginView from "./view/auth/LoginView";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <LoginView />,
      },
       {
        path: "SendMessage",
        element: <SendFilteredEmailsView />,
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
]);
