import { useEffect, useState } from "react";
import { useArchiveRead } from "../../hooks/useReadArchive";
import { useSendMessageContext } from "../../context/SendMessageContext";
import { showToast } from "../../utils/toastUtils";
import TablePeople from "../../components/TablePeople";
import ButtonsSendsMessage from "../../components/ButtonsSendsMessage";

export default function QueryEnvioMasivo() {
  const {
    handleFileChange,
    nombreArchivo,
    archivo,
    procesarArchivo,
    cargando,
  } = useArchiveRead();

  const {
    handleSendMessageMassive,
    handleLimpiar,
    asunto,
    setAsunto,
    mensaje,
    setMensaje,
    personas,
  } = useSendMessageContext();

  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (asunto === "" || mensaje === "") {
      showToast("error", "Los campos de asunto y mensaje no pueden ir vacíos");
      return;
    }

    // Confirmación previa
    try {
      setSending(true);
      await handleSendMessageMassive();
    } catch (error) {
      console.error(error);
      showToast("error", "Error durante el envío de mensajes");
    } finally {
      setSending(false);
    }
  };

  // Reset al desmontar
  useEffect(() => {
    return () => handleLimpiar();
  }, []);

  return (
    <div className="flex flex-col items-center w-full gap-6 p-4">
      {/* Bloque de carga de archivo */}
      <div className="space-y-4 flex flex-col w-[90%] lg:w-[50%] border-2 border-principal rounded-2xl shadow-xl p-6">
        <h1 className="text-xl text-principal font-bold">
          Cargar Archivo para Envío Masivo
        </h1>
        <h2 className="text-sm text-gray-500">
          Arrastre o seleccione el archivo que contiene los datos de las
          personas.
        </h2>

        <div
          className={`relative w-full p-2 border-2 border-dashed border-black rounded-xl cursor-pointer
                      ${archivo ? "bg-principal" : "bg-gray-400"}`}
        >
          <input
            type="file"
            accept=".csv,.xlsx,.xls"
            onChange={handleFileChange}
            id="file-upload"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <label
            htmlFor="file-upload"
            className="flex flex-col items-center justify-center p-4"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-white"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                clipRule="evenodd"
              />
            </svg>
            <span className="mt-2 text-xl text-white font-semibold text-center">
              {nombreArchivo}
            </span>
            <p className="text-xs text-white/60 mt-1">
              Arrastre y suelte un archivo aquí o haga clic para seleccionar
            </p>
          </label>
        </div>

        {personas.length > 0 && (
          <>
            {/* Campo de Asunto */}
            <div className="flex flex-col">
              <label
                htmlFor="asunto"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Asunto del Mensaje
              </label>
              <input
                id="asunto"
                type="text"
                value={asunto}
                onChange={(e) => setAsunto(e.target.value)}
                placeholder="Ej: Notificación Importante sobre su cuenta — ${nombre}"
                className="p-2 border border-gray-300 rounded-lg focus:ring-principal focus:border-principal"
              />
            </div>

            {/* Campo de Mensaje */}
            <div className="flex flex-col">
              <label
                htmlFor="mensaje"
                className="text-sm font-medium text-gray-700 mb-1"
              >
                Mensaje Personalizado
              </label>
              <textarea
                id="mensaje"
                rows={5}
                value={mensaje}
                onChange={(e) => setMensaje(e.target.value)}
                placeholder={`Estimado(a) {nombre},

Reciba un cordial saludo de parte de la Administración.

Le notificamos que se ha registrado información relevante asociada a su cuenta:

• Cédula: {cedula}
• Número de finca / cuenta: {numeroDeFinca || numeroDeCuenta}
• Distrito / Dirección: {distrito || direccion}

Detalle:
{detalle || "Sin detalle adicional registrado."}

Si este mensaje corresponde a un aviso de morosidad:
• Monto pendiente: ₡{valorDeLaDeuda}
• Fecha de vencimiento: {fechaVencimiento}
• Periodo: {periodo}

Si corresponde a información de propiedad:
• Área de la propiedad: {areaDeLaPropiedad} m²
• Estado: {estadoPropiedad}
• Fecha de vigencia: {fechaVigencia}
• Monto imponible: ₡{montoImponible}

Esta comunicación es de carácter informativo. Ante cualquier consulta o actualización, puede responder a este correo o comunicarse con nuestra oficina de atención.

Gracias por su atención.

Atentamente,
Administración`}
                className="p-2 border border-gray-300 rounded-lg focus:ring-principal focus:border-principal resize-y"
              />
            </div>
          </>
        )}
      </div>

      {/* Botones */}
      <ButtonsSendsMessage
        sending={sending}
        isConsultando={cargando}
        handleSubmit={procesarArchivo}
        handleSendMessage={handleSendMessage}
      />

      {personas.length > 0 && <TablePeople />}
    </div>
  );
}
