// src/view/SendFilteredEmailsView.tsx
import { useState } from "react";
import { useSendMessage } from "../hooks/useSendMessage";
import TablePeople from "../components/TablePeople";

export default function SendMessageByIdView() {
  const {
    idCard,
    setIdCard,
    personas,
    handleConsultar,
  } = useSendMessage();

  const [isConsultando, setIsConsultando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsConsultando(true);
    setIsConsultando(false);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full gap-10 p-4">

      <h1 className="text-2xl font-bold mb-4 text-center text-principal ">
        Modulo de envio de mensajes.
      </h1>

      <div className="flex flex-col w-full sm:w-4/5 md:w-3/5 shadow-xl rounded-2xl">

        <h1 className="text-2xl font-bold mb-4 text-center text-principal ">
          Consulta por cedula.
        </h1>

          <form
            onSubmit={handleSubmit}
            className="w-full p-6 space-y-6"
          >
            <div className="space-y-2">
              <label htmlFor="deuda-min">Ingrese la cedula de la persona a buscar</label>
              <input
                id="id-card"
                type="text"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
              />
            </div>
          </form>
      </div>
  
      {personas.length > 0 && (
        <TablePeople />
      )}

    </div>
  );
}
