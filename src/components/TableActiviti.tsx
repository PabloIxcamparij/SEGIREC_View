// ActivityTableContainer.tsx
import type { ReactNode } from "react";

interface TableActivityProps {
  title: string;
  isLoading: boolean;
  hasMore?: boolean;
  loadMoreText: string;
  onLoadMore: () => void;
  onClearFilters: () => void;
  onDownload: () => void
  tableContent: ReactNode;
}

export default function TableActivity({
  title,
  isLoading,
  hasMore = true,
  loadMoreText,
  onLoadMore,
  onDownload,
  onClearFilters,
  tableContent,
}: TableActivityProps) {
  return (
    <div className="w-full md:w-4/5 lg:w-[80%] bg-white border-2 border-principal rounded-2xl shadow-xl p-8">
      <h2 className="text-xl font-semibold mb-6 text-center">{title}</h2>

      {/* Botones de Acción */}
      <div className="flex justify-end mb-4 gap-2">
        <button
          onClick={onDownload}
          className="px-4 py-2 border-2 border-gray-200 text-black text-sm rounded-lg hover:bg-gray-200 transition-colors"
        >
          Descargar Registros
        </button>
        <button
          onClick={onClearFilters}
          className="px-4 py-2 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition-colors"
        >
          Limpiar Filtros
        </button>
        {hasMore && (
          <button
            onClick={onLoadMore}
            disabled={isLoading}
            className="px-4 py-2 bg-principal text-white text-sm rounded-lg hover:bg-principal/80 disabled:opacity-50 transition-colors"
          >
            {isLoading ? "Cargando..." : loadMoreText}
          </button>
        )}
      </div>

      {/* Contenedor de Scroll y Tabla */}
      {tableContent}
    </div>
  );
}
