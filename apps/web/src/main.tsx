import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import CarritoProvider from './contexto/CarritoProvider.tsx'

// BrowserRouter permite que la URL cambie (/cocina, /admin) sin recargar la página.
// CarritoProvider va por fuera de App para que todas las páginas compartan el mismo carrito.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CarritoProvider>
        <App />
      </CarritoProvider>
    </BrowserRouter>
  </StrictMode>,
)
