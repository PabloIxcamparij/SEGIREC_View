import { useSendMessageContext } from "../context/SendMessageContext";

export default function ContainerQueryAttribute({
  attributes,
  setAttributes,
}: any) {
  const { cedula, setCedula, namePerson, setNamePerson } =
    useSendMessageContext();

  return (
    <>
      {/* Cedula */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={attributes.cedula}
            onChange={(e) =>
              setAttributes({ cedula: e.target.checked, name: false })
            }
          />
          Buscar por cédula
        </label>
        {attributes.cedula && (
          <input
            type="text"
            placeholder="ej. 5044507..."
            value={cedula}
            onChange={(e) => setCedula(e.target.value)}
            className="mt-2 border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
          />
        )}
      </div>

      {/* Nombre */}
      <div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={attributes.name}
            onChange={(e) =>
              setAttributes({ name: e.target.checked, cedula: false })
            }
          />
          Buscar por nombre
        </label>
        {attributes.name && (
          <input
            type="text"
            placeholder="ej. Pablo Sorto"
            value={namePerson}
            onChange={(e) => setNamePerson(e.target.value)}
            className="mt-2 border p-2 rounded w-full focus:ring-2 focus:ring-principal outline-none"
          />
        )}
      </div>
    </>
  );
}
