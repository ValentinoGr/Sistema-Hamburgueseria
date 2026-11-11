import { Route, Routes } from 'react-router-dom'
import PantallaInicio from './componentes/PantallaInicio'
import PaginaCarta from './paginas/PaginaCarta'
import PaginaCarrito from './paginas/PaginaCarrito'
import PaginaCheckout from './paginas/PaginaCheckout'
import PaginaCocina from './paginas/PaginaCocina'
import PaginaAdmin from './paginas/PaginaAdmin'
import PaginaSeguimiento from './paginas/PaginaSeguimiento'

// Cada <Route> asocia una URL con la página (componente) que se muestra.
export default function App() {
  return (
    <>
      <PantallaInicio />
      <Routes>
        <Route path="/" element={<PaginaCarta />} />
        <Route path="/carrito" element={<PaginaCarrito />} />
        <Route path="/checkout" element={<PaginaCheckout />} />
        <Route path="/seguimiento/:token" element={<PaginaSeguimiento />} />
        <Route path="/cocina" element={<PaginaCocina />} />
        <Route path="/admin" element={<PaginaAdmin />} />
      </Routes>
    </>
  )
}
