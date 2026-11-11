import type { Producto } from '../tipos/carta'
import { formatearPrecio } from '../utilidades/formato'

// "Props" son los datos que el componente padre le pasa, como los argumentos de una función.
interface Props {
  producto: Producto
  // Una función también se puede pasar como prop: la tarjeta la llama cuando la tocan.
  alSeleccionar: (producto: Producto) => void
}

export default function TarjetaProducto({ producto, alSeleccionar }: Props) {
  const { nombre, descripcion, precio, imagenUrl, disponible } = producto

  return (
    // disabled hace que el botón no se pueda tocar (productos sin stock).
    <button
      type="button"
      disabled={!disponible}
      onClick={() => alSeleccionar(producto)}
      className="flex w-full items-center gap-4 rounded-xl border border-stone-200 bg-white p-3 text-left transition-colors enabled:active:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <div className="min-w-0 flex-1">
        <h3 className="font-semibold text-tinta">{nombre}</h3>
        {descripcion && <p className="mt-1 line-clamp-2 text-sm text-stone-600">{descripcion}</p>}
        {/* Si hay stock mostramos el precio; si no, el aviso. Es un "if" dentro del JSX. */}
        {disponible ? (
          <p className="mt-2 font-bold text-marca">{formatearPrecio(precio)}</p>
        ) : (
          <p className="mt-2 text-sm font-semibold text-stone-500">Sin stock por hoy</p>
        )}
      </div>

      {imagenUrl ? (
        <img src={imagenUrl} alt={nombre} className="size-24 shrink-0 rounded-lg object-cover" />
      ) : (
        <div className="flex size-24 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs text-stone-400">
          Sin foto
        </div>
      )}
    </button>
  )
}
