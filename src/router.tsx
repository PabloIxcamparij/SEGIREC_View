import { createBrowserRouter } from "react-router";
import LayoutMessages from "./Layout/LayoutMessages";
import LayoutAuth from "./Layout/LayoutAuth";
import SendFilteredEmailsView from "./view/SendMessageView";
import SendMessageByIdView from "./view/SendMessageByIdView";
import HomeView
  from "./view/HomeView";
import LockView from "./view/LockView";
import ReportsView from "./view/ReportsView";

import LoginView from "./view/auth/LoginView";

export const router = createBrowserRouter([
  {
    element: <LayoutMessages />,
    children: [
      {
        path: "SendMessage",
        element: <SendFilteredEmailsView />,
      },
      {
        path: "SendMessageById",
        element: <SendMessageByIdView/>,
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
