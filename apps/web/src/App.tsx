import { Route, Routes } from 'react-router-dom'
import PaginaCarta from './paginas/PaginaCarta'
import PaginaCocina from './paginas/PaginaCocina'
import PaginaAdmin from './paginas/PaginaAdmin'
import PaginaSeguimiento from './paginas/PaginaSeguimiento'

// Cada <Route> asocia una URL con la página (componente) que se muestra.
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PaginaCarta />} />
      <Route path="/seguimiento/:token" element={<PaginaSeguimiento />} />
      <Route path="/cocina" element={<PaginaCocina />} />
      <Route path="/admin" element={<PaginaAdmin />} />
    </Routes>
  )
}
