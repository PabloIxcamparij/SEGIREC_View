export default function HomeView() {
  return (
    <div className="p-6 max-w-2xl mx-auto text-center space-y-6">
      
      {/* Luego colocar el escudo del canton */}
      <div className="w-32 h-32 mx-auto rounded-full border-4 border-gray-300 flex items-center justify-center">
        <span className="text-sm text-gray-500">Escudo</span>
      </div>

      <h1 className="text-2xl font-bold">Sistema Interno de Mensajería</h1>

      <p className="text-gray-700">
        Este programa ha sido desarrollado como una plataforma interna de comunicación 
        para la institución. Su objetivo es optimizar el envío y recepción de mensajes, 
        garantizando eficiencia, seguridad y un manejo adecuado de la información.
      </p>

      <div className="bg-red-100 text-red-700 p-4 rounded-lg shadow">
        <strong>Advertencia:</strong> El uso de este sistema está restringido 
        únicamente a personal autorizado. Toda actividad es registrada y monitoreada.
      </div>
    </div>
  );
}
