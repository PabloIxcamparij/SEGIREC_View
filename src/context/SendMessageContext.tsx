// src/context/SendMessageContext.tsx
import { createContext, useContext } from "react";
import { useSendMessage } from "../hooks/useSendMessage";

const SendMessageContext = createContext<ReturnType<typeof useSendMessage> | null>(null);

export const SendMessageProvider = ({ children }: { children: React.ReactNode }) => {
  const sendMessage = useSendMessage();
  return (
    <SendMessageContext.Provider value={sendMessage}>
      {children}
    </SendMessageContext.Provider>
  );
};

export const useSendMessageContext = () => {
  const ctx = useContext(SendMessageContext);
  if (!ctx) throw new Error("useSendMessageContext debe usarse dentro de SendMessageProvider");
  return ctx;
};
