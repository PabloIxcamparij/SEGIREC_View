// src/view/SendFilteredEmailsView.tsx
import { useEffect, useState } from "react";
import { useSendMessageContext } from "../context/SendMessageContext";
import ButtonsSendsMessage from "../components/ButtonsSendsMessage";
import TablePeople from "../components/TablePeople";

export default function SendMessageQueryPerson() {
  const {
    idCard,
    setIdCard,
    namePerson,
    setNamePerson,
    personas,
    handleQueryPerson,
    handleLimpiar,
  } = useSendMessageContext();

  const [isConsultando, setIsConsultando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsConsultando(true);
    await handleQueryPerson(idCard);
    setIsConsultando(false);
  };

  const [filtrosActivos, setFiltrosActivos] = useState({
    cedula: false,
    name: false,
  });

  //Limpiar y desmontar al salir de la pagina
  useEffect(() => {
    return () => {
      handleLimpiar();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full gap-10 p-4">
      <div className="flex flex-col w-full sm:w-4/5 md:w-3/5 shadow-xl rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-principal ">
          Buscar a una persona por cedula o nombre
        </h1>
        <h2 className="text-1xl mb-4 text-center text-gray-500 ">
          Seleccione una de las opciones e ingrese los datos para comenzar la
          consulta
        </h2>

        <form onSubmit={handleSubmit} className="w-full p-6 space-y-6">
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filtrosActivos.cedula}
                onChange={(e) =>
                  setFiltrosActivos((prev) => ({
                    ...prev,
                    cedula: e.target.checked,
                    name: false,
                  }))
                }
              />
              Ingrese la cedula de la persona a buscar
            </label>
            {filtrosActivos.cedula && (
              <input
                id="id-card"
                type="text"
                value={idCard}
                onChange={(e) => setIdCard(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
              />
            )}
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={filtrosActivos.name}
                onChange={(e) =>
                  setFiltrosActivos((prev) => ({
                    ...prev,
                    name: e.target.checked,
                    cedula: false,
                  }))
                }
              />
              Ingrese el nombre de la persona a buscar
            </label>
            {filtrosActivos.name && (
              <input
                id="name-person"
                type="text"
                value={namePerson}
                onChange={(e) => setNamePerson(e.target.value)}
                className="border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
              />
            )}
          </div>
        </form>
      </div>

      <ButtonsSendsMessage
        handleSubmit={handleSubmit}
        isConsultando={isConsultando}
      />

      {personas.length > 0 && <TablePeople />}
    </div>
  );
}
