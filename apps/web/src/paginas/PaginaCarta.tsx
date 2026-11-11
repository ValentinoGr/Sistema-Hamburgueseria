import { useState } from 'react'
import { Link } from 'react-router-dom'
import PanelPersonalizacion from '../componentes/PanelPersonalizacion'
import SeccionCategoria from '../componentes/SeccionCategoria'
import { useCarrito } from '../contexto/carritoContexto'
import { cartaMock } from '../datos/cartaMock'
import type { Producto } from '../tipos/carta'
import type { ItemCarrito } from '../tipos/carrito'
import { formatearPrecio } from '../utilidades/formato'
// Importar la imagen hace que Vite la incluya en la web y nos dé la ruta correcta.
import logo from '../assets/logo_burger_pinta.jpg'

export default function PaginaCarta() {
  // Por ahora usamos datos falsos. Más adelante esto será un fetch a GET /api/carta.
  const carta = cartaMock

  // El carrito ya no vive acá: lo tomamos del Context compartido por toda la app.
  const { cantidadTotal, subtotal, agregar } = useCarrito()

  // Producto cuyo panel está abierto (null = ningún panel abierto)
  const [productoSeleccionado, setProductoSeleccionado] = useState<Producto | null>(null)

  function agregarAlCarrito(item: ItemCarrito) {
    agregar(item)
    setProductoSeleccionado(null)
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* sticky top-0: la barra queda fija arriba mientras se hace scroll */}
      <header className="sticky top-0 z-10 bg-marca shadow-md">
        <div className="mx-auto max-w-2xl px-4 pt-2">
          {/* El logo ya incluye el nombre, así que el texto alternativo hace de título para lectores de pantalla */}
          <h1 className="flex justify-center">
            <img src={logo} alt="Burger Pinta" className="logo-recortado size-16" />
          </h1>
          {/* ml-auto en el primer botón y mr-auto en el último centran la fila cuando entra en pantalla,
              y si hay tantas categorías que no entran, la fila sigue pudiéndose deslizar de costado.
              (justify-center no sirve acá: cortaría las categorías de la izquierda.) */}
          <nav className="-mx-4 mt-1 flex gap-2 overflow-x-auto px-4 pb-3 [&>:first-child]:ml-auto [&>:last-child]:mr-auto">
            {carta.map((categoria) => (
              <a
                key={categoria.id}
                href={`#categoria-${categoria.id}`}
                className="shrink-0 rounded-full bg-white/15 px-4 py-1.5 text-sm font-semibold text-white active:bg-acento active:text-tinta"
              >
                {categoria.nombre}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-8 px-4 py-6 pb-28">
        {carta.map((categoria) => (
          <SeccionCategoria key={categoria.id} categoria={categoria} alSeleccionar={setProductoSeleccionado} />
        ))}
      </main>

      {/* Barra fija que aparece cuando hay algo en el carrito y lleva a la pantalla del pedido */}
      {cantidadTotal > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-10 p-4">
          <Link
            to="/carrito"
            className="mx-auto flex min-h-12 max-w-2xl items-center justify-between rounded-xl bg-tinta px-4 py-3 font-semibold text-white shadow-lg active:opacity-90"
          >
            <span>Ver pedido ({cantidadTotal})</span>
            <span>{formatearPrecio(subtotal)}</span>
          </Link>
        </div>
      )}

      {/* Si hay un producto seleccionado, se muestra el panel. Al cerrarlo desaparece y su estado se reinicia. */}
      {productoSeleccionado && (
        <PanelPersonalizacion
          producto={productoSeleccionado}
          alCerrar={() => setProductoSeleccionado(null)}
          alAgregar={agregarAlCarrito}
        />
      )}
    </div>
  )
}
