// src/main.tsx
import { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { Toaster } from 'react-hot-toast'; // Importa el Toaster
import './index.css';
import { router } from './router';

// ... (tus importaciones de PrimeReact)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Cargando...</div>}>
      {/* Añade el Toaster aquí */}
      <Toaster />
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);