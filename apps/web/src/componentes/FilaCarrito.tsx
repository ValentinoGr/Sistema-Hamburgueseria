import type { ItemCarrito } from '../tipos/carrito'
import { formatearPrecio } from '../utilidades/formato'
import { totalItem } from '../utilidades/precios'
import SelectorCantidad from './SelectorCantidad'

interface Props {
  item: ItemCarrito
  alCambiarCantidad: (cantidad: number) => void
  alEliminar: () => void
}

export default function FilaCarrito({ item, alCambiarCantidad, alEliminar }: Props) {
  const { producto, tamano, extras, sinIngredientes, nota } = item

  // Armamos las líneas de detalle solo con lo que el cliente eligió.
  // Array de textos; los vacíos no se muestran.
  const detalles: string[] = []
  if (tamano) detalles.push(tamano.nombre)
  if (extras.length > 0) detalles.push(`Extras: ${extras.map((e) => e.nombre).join(', ')}`)
  if (sinIngredientes.length > 0) {
    detalles.push(`Sin: ${sinIngredientes.map((i) => i.nombre.toLowerCase()).join(', ')}`)
  }
  if (nota) detalles.push(`Aclaración: ${nota}`)

  return (
    <li className="rounded-xl border border-stone-200 bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-tinta">{producto.nombre}</h3>
        <p className="font-bold text-marca">{formatearPrecio(totalItem(item))}</p>
      </div>

      {detalles.length > 0 && (
        <ul className="mt-1 space-y-0.5 text-sm text-stone-600">
          {detalles.map((detalle) => (
            <li key={detalle}>{detalle}</li>
          ))}
        </ul>
      )}

      <div className="mt-3 flex items-center justify-between">
        <SelectorCantidad cantidad={item.cantidad} alCambiar={alCambiarCantidad} />
        <button
          type="button"
          onClick={alEliminar}
          className="min-h-11 rounded-lg px-3 text-sm font-semibold text-stone-600 underline active:bg-stone-100"
        >
          Quitar
        </button>
      </div>
    </li>
  )
}
