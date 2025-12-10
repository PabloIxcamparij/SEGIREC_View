import { useEffect, useState } from 'react';
import { getReports } from '../../service/Utils.service';

export default function ReportsView() {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    // Definimos la función asíncrona dentro del efecto
    const fetchReportUrl = async () => {
      try {
        const response = await getReports();
        // IMPORTANTE: Asegúrate de acceder a la propiedad exacta donde viene la URL 
        // Si tu backend devuelve { url: "..." }, usa response.data.url
        if (response && response.data) {
          setUrl(response.data.url); 
        }
      } catch (error) {
        console.error("Error al obtener la URL del reporte:", error);
      }
    };

    fetchReportUrl();
  }, []); // El array vacío asegura que solo se ejecute al montar el componente

  return (
    <div style={{ width: '100%', height: '800px' }}>
      {url ? (
        <iframe 
          src={url} 
          width="100%" 
          height="100%" 
          title="Metabase Report"
        />
      ) : (
        <p>Cargando reporte seguro...</p>
      )}
    </div>
  );
}
