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
  const [mensajePersonalizado, setMensajePersonalizado] = useState("");

  const [filtrosActivos, setFiltrosActivos] = useState({
    cedula: false,
    name: false,
  });
  const handleSubmit = async (e : any) => {
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
                placeholder="ej. 5044507... (sin espacios ni guiones)"
                autoComplete="off"
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
                placeholder="ej. Pablo Sorto"
                autoComplete="off"
              />
            )}
          </div>
        </form>
      </div>

         {/* Nuevo componente para el mensaje personalizado */}
      {personas.length === 1 && (
        <div className="flex flex-col w-[70%] lg:w-[40%] xl:w-[30%] text-center text-wrap border-2 border-principal backdrop-blur-md rounded-2xl shadow-xl p-8 mt-10">
          <label htmlFor="mensajePersonalizado" className="text-gray-500 font-bold mb-4">
            Escribir un mensaje personalizado
          </label>
          <textarea
            id="mensajePersonalizado"
            value={mensajePersonalizado}
            onChange={(e) => setMensajePersonalizado(e.target.value)}
            className="border p-2 rounded w-full h-32 focus:ring-2 focus:ring-principal outline-none resize-none"
            placeholder="Escribe tu mensaje aquí..."
          />
        </div>
      )}

      <ButtonsSendsMessage
        handleSubmit={handleSubmit}
        isConsultando={isConsultando}
      />

      {personas.length > 0 && <TablePeople />}

   
    </div>
  );
}
