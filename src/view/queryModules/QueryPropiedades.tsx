import { useEffect, useState } from "react";
import type { QueryBody } from "../../types";

import { showToast, showToastConfirmSend } from "../../utils/toastUtils";
import { useSendMessageContext } from "../../context/SendMessageContext";
import { queryBaseImponibleCatalogo } from "../../service/utilsService";

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

export default function QueryPropiedades() {
  const {
    distrito,
    setDistrito,
    areaMinima,
    setAreaMinima,
    areaMaxima,
    setAreaMaxima,
    monImponibleMinimo,
    setMonImponibleMinimo,
    monImponibleMaximo,
    setMonImponibleMaximo,
    codigoBaseImponible,
    setCodigoBaseImponible,
    cedula,
    setCedula,
    namePerson,
    setNamePerson,
    personas,
    handleLimpiar,
    handleSendMessagePropiedades,
    handleQueryPeopleWithProperties,
  } = useSendMessageContext();

  const [isConsulting, setIsConsulting] = useState(false);
  const [baseImponibleCatalogo, setBaseImponibleCatalogoCatalogo] = useState(
    []
  );
  const [peopleWithMultipleProperties, setPeopleWithMultipleProperties] =
    useState(false);
  const [peopleWithDebt, setPeopleWithDebt] = useState(false);
  const [sending, setSending] = useState(false);

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsulting(true);

    if (
      monImponibleMaximo !== "" &&
      monImponibleMinimo !== "" &&
      monImponibleMaximo < monImponibleMinimo
    ) {
      showToast(
        "error",
        "El monto imponible máximo no puede ser menor que el monto imponible mínimo."
      );
      setIsConsulting(false);
      return;
    }

    if (areaMaxima !== "" && areaMinima !== "" && areaMaxima < areaMinima) {
      showToast(
        "error",
        "El área máxima no puede ser menor que el área mínima."
      );
      setIsConsulting(false);
      return;
    }

    try {
      const query: QueryBody = {};

      if (distrito.length > 0) query.distritos = distrito;
      if (cedula.trim() !== "") query.cedula = cedula.trim();
      if (areaMaxima !== "") query.areaMaxima = Number(areaMaxima);
      if (areaMinima !== "") query.areaMinima = Number(areaMinima);
      if (namePerson.trim() !== "") query.nombre = namePerson.trim();
      if (codigoBaseImponible.length > 0)
        query.codigoBaseImponible = codigoBaseImponible;
      if (monImponibleMinimo !== "")
        query.monImponibleMinimo = Number(monImponibleMinimo);
      if (monImponibleMaximo !== "")
        query.monImponibleMaximo = Number(monImponibleMaximo);

      // Los valores booleanos se usan directamente, pero es buena práctica
      // incluirlos en el objeto 'query' solo si son 'true' para evitar
      // enviar parámetros innecesarios si el backend lo permite/requiere.
      if (peopleWithDebt) query.onlyWithDebt = true;
      if (peopleWithMultipleProperties) query.onlyWithMultipleProperties = true;

      await handleQueryPeopleWithProperties(query);
    } catch (error) {
      showToast("error", "Error en lectura", String(error));
    } finally {
      setIsConsulting(false);
    }
  };

  const handleSendMessage = async () => {
    // Confirmación previa
    showToastConfirmSend(async () => {
      try {
        setSending(true);
        await handleSendMessagePropiedades();
      } catch (error) {
        console.error(error);
        showToast("error", "Error durante el envío de mensajes");
      } finally {
        setSending(false);
      }
    });
  };

  // Reset al desmontar
  useEffect(() => {
    return () => handleLimpiar();
  }, []);

  useEffect(() => {
    if (baseImponibleCatalogo.length === 0) {
      const fetchServicios = async () => {
        try {
          const data = await queryBaseImponibleCatalogo();
          setBaseImponibleCatalogoCatalogo(data);
        } catch (error) {
          console.error("Error al cargar el catálogo de servicios:", error);
        }
      };

      fetchServicios();
    }
  }, [baseImponibleCatalogo]);

  return (
    <div className="flex flex-col items-center w-full gap-6 p-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 flex flex-col w-[90%] lg:w-[50%] border-2 border-principal rounded-2xl shadow-xl p-6"
      >
        <h1 className="text-xl text-principal font-bold">
          Consulta de Propiedades
        </h1>
        <h2 className="text-sm text-gray-500">
          Ingrese uno o más filtros para refinar la búsqueda.
        </h2>

        {/* --- FILTROS DE INPUTS --- */}
        <InputSelect
          label="Filtrar por Distritos"
          options={distritos}
          selectedValues={distrito}
          onChangeValues={setDistrito}
          placeholder="Seleccione distritos..."
        />
        <InputSelect
          label="Filtrar por Base Imponible"
          options={baseImponibleCatalogo}
          selectedValues={codigoBaseImponible}
          onChangeValues={setCodigoBaseImponible}
          placeholder="Seleccione servicios..."
        />
        <DoubleInput
          label="Filtrar por Monto Imponible (Mín. / Máx.)"
          valueMin={monImponibleMinimo}
          valueMax={monImponibleMaximo}
          onChangeMin={(value) => setMonImponibleMinimo(value as number | "")}
          onChangeMax={(value) => setMonImponibleMaximo(value as number | "")}
          placeholderMin="Monto mínimo"
          placeholderMax="Monto máximo"
        />
        <DoubleInput
          label="Filtrar por Área (Mín. / Máx.)"
          valueMin={areaMinima}
          valueMax={areaMaxima}
          onChangeMin={(value) => setAreaMinima(value as number | "")}
          onChangeMax={(value) => setAreaMaxima(value as number | "")}
          placeholderMin="Área mínima"
          placeholderMax="Área máxima"
        />
        <OneInputProps
          label="Filtrar por Cédula"
          value={cedula}
          onChange={(value) => setCedula(value as string)}
          placeholder="Ingrese la cédula..."
        />
        <OneInputProps
          label="Filtrar por Nombre"
          value={namePerson}
          onChange={(value) => setNamePerson(value as string)}
          placeholder="Ingrese el nombre..."
        />
        {/* --- TOGGLE SWITCHES --- */}
        <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ToggleSwitch
            label="Personas con deudas"
            checked={peopleWithDebt}
            onChange={setPeopleWithDebt}
          />
          <ToggleSwitch
            label="Personas con múltiples propiedades"
            checked={peopleWithMultipleProperties}
            onChange={setPeopleWithMultipleProperties}
          />
        </div>
      </form>

      {/* Botón enviar */}
      <ButtonsSendsMessage
        sending={sending}
        isConsultando={isConsulting}
        handleSubmit={handleSubmit}
        handleSendMessage={handleSendMessage}
      />

      {personas.length > 0 && <TablePeople />}
    </div>
  );
}
