import { useEffect, useState } from "react";
import type { QueryBody } from "../../types";

import { showToast } from "../../utils/toastUtils";
import { useSendMessageContext } from "../../context/SendMessageContext";
import { queryBaseImponibleCatalogo } from "../../service/utilsService";

import TablePeople from "../../components/TablePeople";
import ButtonsSendsMessage from "../../components/ButtonsSendsMessage";
import {
  InputSelect,
  DoubleInput,
  OneInputProps,
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
    handleQueryPropiedadesByFilters,
  } = useSendMessageContext();

  const [isConsulting, setIsConsulting] = useState(false);

  const [baseImponibleCatalogo, setBaseImponibleCatalogoCatalogo] = useState(
    []
  );

  // Handle submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsConsulting(true);

    try {
      const query: QueryBody = {};

      if (distrito.length > 0) query.distritos = distrito;
      if (cedula.trim() !== "") query.cedula = cedula.trim();
      if (areaMaxima !== "") query.areaMaxima = Number(areaMaxima);
      if (areaMinima !== "") query.areaMinima = Number(areaMinima);
      if (namePerson.trim() !== "") query.nombre = namePerson.trim();
      if (baseImponibleCatalogo.length > 0)
        query.servicios = baseImponibleCatalogo;
      if (monImponibleMinimo !== "")
        query.monImponibleMinimo = Number(monImponibleMinimo);
      if (monImponibleMaximo !== "")
        query.monImponibleMaximo = Number(monImponibleMaximo);

      await handleQueryPropiedadesByFilters(query);
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
        className="space-y-4 flex flex-col w-[90%] lg:w-[50%] xl:w-[40%] border-2 border-principal rounded-2xl shadow-xl p-6"
      >
        <h1 className="text-xl text-principal font-bold">
          Consulta de Propiedades
        </h1>
        <h2 className="text-sm text-gray-500">
          Ingrese uno o más filtros para refinar la búsqueda.
        </h2>

        {/* Distritos */}
        <InputSelect
          label="Filtrar por Distritos"
          options={distritos}
          selectedValues={distrito}
          onChangeValues={setDistrito}
          placeholder="Seleccione distritos..."
        />

        {/*  Base Imponible */}
        <InputSelect
          label="Filtrar por Base Imponible"
          options={baseImponibleCatalogo}
          selectedValues={codigoBaseImponible}
          onChangeValues={setCodigoBaseImponible}
          placeholder="Seleccione servicios..."
        />

        {/*  Monto Imponible */}
        <DoubleInput
          label="Filtrar por Monto Imponible"
          valueMin={monImponibleMinimo}
          valueMax={monImponibleMaximo}
          onChangeMin={(value) => setMonImponibleMinimo(value as number | "")}
          onChangeMax={(value) => setMonImponibleMaximo(value as number | "")}
          placeholderMin="Área mínima"
          placeholderMax="Área máxima"
        />

        {/* Área */}
        <DoubleInput
          label="Filtrar por Área"
          valueMin={areaMinima}
          valueMax={areaMaxima}
          onChangeMin={(value) => setAreaMinima(value as number | "")}
          onChangeMax={(value) => setAreaMaxima(value as number | "")}
          placeholderMin="Área mínima"
          placeholderMax="Área máxima"
        />

        {/*Cedula */}
        <OneInputProps
          label="Filtrar por Cédula"
          value={cedula}
          onChange={(value) => setCedula(value as string)}
          placeholder="Ingrese la cédula..."
        />

        {/*Nombre */}
        <OneInputProps
          label="Filtrar por Nombre"
          value={namePerson}
          onChange={(value) => setNamePerson(value as string)}
          placeholder="Ingrese el nombre..."
        />
      </form>

      {/* Botón enviar */}
      <ButtonsSendsMessage
        handleSubmit={handleSubmit}
        isConsultando={isConsulting}
      />

      {personas.length > 0 && <TablePeople />}
    </div>
  );
}
