const PUBLIC_DASHBOARD_URL = "http://192.168.0.7:3000/public/dashboard/7c4c9d66-bcb8-49f7-ad3e-a96cfc72ac93";

export default function ReportsView() {
  return (
    <div style={{ width: '100%', height: '800px' }}> {/* Contenedor para el iframe */}
      <iframe
        src={PUBLIC_DASHBOARD_URL}
        width="100%" // Es mejor usar 100% para que sea responsivo
        height="100%"
        title="Reporte Público"
      />
    </div>
  );
}