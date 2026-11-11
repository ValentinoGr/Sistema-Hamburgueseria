import { Link } from 'react-router-dom'
import FilaCarrito from '../componentes/FilaCarrito'
import { useCarrito } from '../contexto/carritoContexto'
import { formatearPrecio } from '../utilidades/formato'

export default function PaginaCarrito() {
  const { items, subtotal, cambiarCantidad, eliminar } = useCarrito()

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-10 bg-marca shadow-md">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          {/* Link es el <a> de React Router: cambia de página sin recargar */}
          <Link to="/" className="flex min-h-11 items-center rounded-lg pr-3 text-sm font-semibold text-white underline">
            Volver a la carta
          </Link>
          <h1 className="flex-1 text-right text-lg font-bold text-white">Tu pedido</h1>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6 pb-40">
        {items.length === 0 ? (
          // Carrito vacío
          <div className="mt-12 text-center">
            <p className="text-lg font-semibold text-tinta">Todavía no agregaste nada</p>
            <p className="mt-1 text-stone-600">Elegí algo de la carta para armar tu pedido.</p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-marca px-6 font-semibold text-white active:bg-marca-oscuro"
            >
              Ver la carta
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-3">
            {items.map((item) => (
              <FilaCarrito
                key={item.idLocal}
                item={item}
                alCambiarCantidad={(cantidad) => cambiarCantidad(item.idLocal, cantidad)}
                alEliminar={() => eliminar(item.idLocal)}
              />
            ))}
          </ul>
        )}
      </main>

      {items.length > 0 && (
        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-white p-4">
          <div className="mx-auto max-w-2xl">
            <div className="flex items-center justify-between text-tinta">
              <span className="font-semibold">Subtotal</span>
              <span className="text-lg font-bold">{formatearPrecio(subtotal)}</span>
            </div>
            <p className="mt-1 text-sm text-stone-600">El envío, si corresponde, se suma en el siguiente paso.</p>
            <Link
              to="/checkout"
              className="mt-3 flex min-h-12 items-center justify-center rounded-xl bg-marca font-semibold text-white active:bg-marca-oscuro"
            >
              Continuar
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
