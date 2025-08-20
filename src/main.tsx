import { Suspense, StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider } from 'react-router';
import './index.css';
import { router } from './router';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div>Cargando...</div>}>
      <RouterProvider router={router} />
    </Suspense>
  </StrictMode>
);
