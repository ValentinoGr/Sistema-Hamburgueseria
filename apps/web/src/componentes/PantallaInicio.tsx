import { useState } from 'react'
import logo from '../assets/logo_burger_pinta.jpg'

// Se evalúa una sola vez, cuando carga la página: solo mostramos la pantalla de inicio
// si el cliente entró por la carta. Nunca en cocina, admin ni seguimiento.
const entroPorLaCarta = window.location.pathname === '/'

// Pantalla azul con el logo en el medio que aparece al entrar y se desvanece sola (unos 2 segundos).
// Las animaciones están en index.css (clases .pantalla-inicio y .pantalla-inicio-logo).
export default function PantallaInicio() {
  const [visible, setVisible] = useState(entroPorLaCarta)

  if (!visible) return null

  return (
    // aria-hidden: es decorativa, los lectores de pantalla pasan directo al contenido.
    // Tocarla la cierra antes, para quien no quiera esperar.
    <div
      aria-hidden="true"
      onClick={() => setVisible(false)}
      // animationend también se dispara para el logo y "sube" hasta acá: filtramos por el nombre de la animación de salida.
      onAnimationEnd={(evento) => {
        if (evento.animationName === 'pantalla-inicio-salida') setVisible(false)
      }}
      className="pantalla-inicio fixed inset-0 z-50 flex items-center justify-center bg-marca"
    >
      <img src={logo} alt="" className="pantalla-inicio-logo logo-recortado size-36" />
    </div>
  )
}
