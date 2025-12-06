import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import { SendMessageProvider } from "../context/SendMessageContext";

export default function LayoutMessages() {
  return (
    <div className="min-h-full">
      <NavBar />
      <SendMessageProvider> // Provide context for sending messages
        <main className="p-4 w-full">
          <Outlet />
        </main>
      </SendMessageProvider>
    </div>
  );
}
