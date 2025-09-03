import { useEffect, useState } from "react";
import { useSendMessageContext } from "../context/SendMessageContext";
import ButtonsSendsMessage from "../components/ButtonsSendsMessage";
import TablePeople from "../components/TablePeople";
import { showToast } from "../utils/toastUtils";

export default function SendMessageQueryByAttributes() {
  const {
    idCard,
    setIdCard,
    namePerson,
    setNamePerson,
    personas,
    handleQueryPersonByCedula,
    handleQueryPersonByName,
    handleLimpiar,
  } = useSendMessageContext();

  const [isConsultando, setIsConsultando] = useState(false);

  const [filtrosActivos, setFiltrosActivos] = useState({
    cedula: false,
    name: false,
  });
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsConsultando(true);

    try {
      if (filtrosActivos.cedula) {
        await handleQueryPersonByCedula(idCard);
      } else if (filtrosActivos.name) {
        await handleQueryPersonByName(namePerson);
      }
    } catch (error) {
      showToast("error", "Error en lectura", String(error));
    } finally {
      setIsConsultando(false);
    }
  };

  //Limpiar y desmontar al salir de la pagina
  useEffect(() => {
    return () => {
      handleLimpiar();
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full justify-center gap-10 p-4">
      <div className="flex flex-col w-[90%] lg:w-[50%] xl:w-[40%] text-center text-wrap border-2 border-principal backdrop-blur-md rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-4 text-principal ">
          Buscar a una persona
        </h1>
        <h2 className="text-1xl mb-4 text-gray-500 ">
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
              Buscar por cedula
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
              Buscar por nombre
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
