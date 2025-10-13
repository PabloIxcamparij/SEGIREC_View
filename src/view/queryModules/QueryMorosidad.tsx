import { useEffect, useState } from "react";
import type { QueryBody } from "../../types";

import { showToast } from "../../utils/toastUtils";
import { useSendMessageContext } from "../../context/SendMessageContext";
import { queryServiceCatalogo } from "../../service/utilsService";

import TablePeople from "../../components/TablePeople";
import ButtonsSendsMessage from "../../components/ButtonsSendsMessage";
import {
  InputSelect,
  DoubleInput,
  OneInputProps,
  ToggleSwitch,
} from "../../components/ContainerInputs";

const distritos = [
  { value: "BAGACES", label: "Bagaces" },
  { value: "FORTUNA", label: "Fortuna" },
  { value: "MOGOTE", label: "Mogote" },
  { value: "RÍO NARANJO", label: "Río Naranjo" },
];

export default function QueryMorosidad() {
  const {
    distrito,
    setDistrito,
    servicio,
    setServicio,
    deudaMinima,
    setDeudaMinima,
    deudaMaxima,
    setDeudaMaxima,
    cedula,
    setCedula,
    namePerson,
    setNamePerson,
    personas,
    handleLimpiar,
    handleSendMessageMorosidad,
    handleQueryMorosidadByFilters,
  } = useSendMessageContext();

  const [isConsulting, setIsConsulting] = useState(false);
  const [serviciosCatalogo, setServiciosCatalogo] = useState([]);
  const [peopleWithDebt, setPeopleWithDebt] = useState(false);

  // Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsulting(true);

    if (deudaMaxima !== "" && deudaMinima !== "" && deudaMaxima < deudaMinima) {
      showToast(
        "error",
        "La deuda máxima no puede ser menor que la deuda mínima."
      );
      setIsConsulting(false);
      return;
    }

    try {
      const query: QueryBody = {};

      if (distrito.length > 0) query.distritos = distrito;
      if (servicio.length > 0) query.servicios = servicio;
      if (cedula.trim() !== "") query.cedula = cedula.trim();
      if (deudaMinima !== "") query.deudaMinima = Number(deudaMinima);
      if (deudaMaxima !== "") query.deudaMaxima = Number(deudaMaxima);
      if (namePerson.trim() !== "") query.nombre = namePerson.trim();

      if (peopleWithDebt) query.onlyWithDebt = true;

      await handleQueryMorosidadByFilters(query);
    } catch (error) {
      showToast("error", "Error en lectura", String(error));
    } finally {
      setIsConsulting(false);
    }
  };

  // Reset al desmontar
  useEffect(() => {
    return () => handleLimpiar();
  }, []);

  // Cargar servicios
  useEffect(() => {
    if (serviciosCatalogo.length === 0) {
      queryServiceCatalogo()
        .then(setServiciosCatalogo)
        .catch((error) =>
          console.error("Error al cargar el catálogo de servicios:", error)
        );
    }
  }, [serviciosCatalogo]);

  return (
    <div className="flex flex-col items-center w-full gap-6 p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col w-[90%] lg:w-[50%] border-2 border-principal rounded-2xl shadow-xl p-6"
      >
        <h1 className="text-xl text-principal font-bold">
          Consulta de Morosidad
        </h1>
        <h2 className="text-sm text-gray-500">
          Ingrese uno o más filtros para refinar la búsqueda.
        </h2>

        <InputSelect
          label="Distritos"
          options={distritos}
          selectedValues={distrito}
          onChangeValues={setDistrito}
          placeholder="Seleccione distritos..."
        />

        <InputSelect
          label="Servicios"
          options={serviciosCatalogo}
          selectedValues={servicio}
          onChangeValues={setServicio}
          placeholder="Seleccione servicios..."
        />

        <DoubleInput
          label="Deuda (mínima / máxima)"
          valueMin={deudaMinima}
          valueMax={deudaMaxima}
          onChangeMin={(value) => setDeudaMinima(value as number | "")}
          onChangeMax={(value) => setDeudaMaxima(value as number | "")}
        />

        <OneInputProps
          label="Cédula"
          value={cedula}
          onChange={setCedula}
          placeholder="Ingrese la cédula..."
        />

        <OneInputProps
          label="Nombre"
          value={namePerson}
          onChange={setNamePerson}
          placeholder="Ingrese el nombre..."
        />

        {/* --- TOGGLE SWITCHES --- */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleSwitch
            label="Personas con deudas"
            checked={peopleWithDebt}
            onChange={setPeopleWithDebt}
          />
        </div>
      </form>

      {/* Botón enviar */}
      <ButtonsSendsMessage
        handleSubmit={handleSubmit}
        isConsultando={isConsulting}
        handleSendMessage={handleSendMessageMorosidad}
      />

      {personas.length > 0 && <TablePeople />}
    </div>
  );
}
