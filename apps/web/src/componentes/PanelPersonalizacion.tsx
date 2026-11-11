import { useEffect, useState } from 'react'
import type { Producto } from '../tipos/carta'
import type { ItemCarrito } from '../tipos/carrito'
import { formatearPrecio } from '../utilidades/formato'
import { generarId } from '../utilidades/ids'
import { precioUnitario } from '../utilidades/precios'
import SelectorCantidad from './SelectorCantidad'

interface Props {
  producto: Producto
  alCerrar: () => void
  alAgregar: (item: ItemCarrito) => void
}

// Si el id está en la lista lo saca, y si no está lo agrega. Sirve para los checkboxes.
function alternar(ids: number[], id: number): number[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
}

export default function PanelPersonalizacion({ producto, alCerrar, alAgregar }: Props) {
  // useState guarda un valor que, al cambiar, hace que React vuelva a dibujar el componente.
  // Devuelve [valorActual, funcionParaCambiarlo]. Acá guardamos lo que el cliente va eligiendo.
  const [tamanoId, setTamanoId] = useState<number | null>(producto.tamanos[0]?.id ?? null)
  const [extraIds, setExtraIds] = useState<number[]>([])
  const [sinIngredienteIds, setSinIngredienteIds] = useState<number[]>([])
  const [nota, setNota] = useState('')
  const [cantidad, setCantidad] = useState(1)

  // useEffect corre código "de afuera" de React: acá, escuchar la tecla Escape y bloquear el scroll de la página.
  // La función que devolvemos se ejecuta al cerrar el panel, para deshacer lo que hicimos.
  useEffect(() => {
    function alPresionarTecla(evento: KeyboardEvent) {
      if (evento.key === 'Escape') alCerrar()
    }
    document.addEventListener('keydown', alPresionarTecla)
    const overflowPrevio = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPresionarTecla)
      document.body.style.overflow = overflowPrevio
    }
  }, [alCerrar])

  // Datos derivados: se calculan en cada dibujo a partir del estado, no hace falta guardarlos.
  const tamanoElegido = producto.tamanos.find((t) => t.id === tamanoId) ?? null
  const extrasElegidos = producto.extras.filter((e) => extraIds.includes(e.id))
  const total = precioUnitario(producto, tamanoElegido, extrasElegidos) * cantidad

  function agregar() {
    alAgregar({
      idLocal: generarId(),
      producto,
      tamano: tamanoElegido,
      extras: extrasElegidos,
      sinIngredientes: producto.ingredientes.filter((i) => sinIngredienteIds.includes(i.id)),
      nota: nota.trim(),
      cantidad,
    })
  }

  const tituloSeccion = 'mb-2 text-sm font-bold uppercase tracking-wide text-stone-500'
  const filaOpcion =
    'flex min-h-11 cursor-pointer items-center gap-3 rounded-lg border border-stone-200 px-3 py-2 has-checked:border-marca has-checked:bg-marca/5'

  return (
    // Fondo oscuro que cubre toda la pantalla. Tocarlo cierra el panel.
    <div className="fixed inset-0 z-20 flex items-end justify-center bg-black/50" onClick={alCerrar}>
      {/* stopPropagation evita que un toque DENTRO del panel llegue al fondo y lo cierre */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="panel-titulo"
        onClick={(evento) => evento.stopPropagation()}
        className="flex max-h-[92vh] w-full max-w-2xl flex-col rounded-t-2xl bg-white"
      >
        <div className="flex items-start gap-3 border-b border-stone-200 p-4">
          <div className="min-w-0 flex-1">
            <h2 id="panel-titulo" className="text-xl font-bold text-tinta">
              {producto.nombre}
            </h2>
            {producto.descripcion && <p className="mt-1 text-sm text-stone-600">{producto.descripcion}</p>}
          </div>
          <button
            type="button"
            aria-label="Cerrar"
            onClick={alCerrar}
            className="flex size-11 shrink-0 items-center justify-center rounded-full text-2xl text-stone-500 active:bg-stone-100"
          >
            x
          </button>
        </div>

        {/* Zona con scroll: si hay muchas opciones, el encabezado y el pie quedan fijos */}
        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
          {/* Cada sección solo aparece si el producto tiene esas opciones (una gaseosa no tiene tamaños) */}
          {producto.tamanos.length > 0 && (
            <fieldset>
              <legend className={tituloSeccion}>Tamaño</legend>
              <div className="flex flex-col gap-2">
                {producto.tamanos.map((tamano) => (
                  <label key={tamano.id} className={filaOpcion}>
                    <input
                      type="radio"
                      name="tamano"
                      checked={tamanoId === tamano.id}
                      onChange={() => setTamanoId(tamano.id)}
                      className="size-5 accent-marca"
                    />
                    <span className="flex-1 text-tinta">{tamano.nombre}</span>
                    {tamano.precioAdicional > 0 && (
                      <span className="text-sm text-stone-600">+ {formatearPrecio(tamano.precioAdicional)}</span>
                    )}
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {producto.extras.length > 0 && (
            <fieldset>
              <legend className={tituloSeccion}>Extras</legend>
              <div className="flex flex-col gap-2">
                {producto.extras.map((extra) => (
                  <label key={extra.id} className={filaOpcion}>
                    <input
                      type="checkbox"
                      checked={extraIds.includes(extra.id)}
                      onChange={() => setExtraIds(alternar(extraIds, extra.id))}
                      className="size-5 accent-marca"
                    />
                    <span className="flex-1 text-tinta">{extra.nombre}</span>
                    <span className="text-sm text-stone-600">+ {formatearPrecio(extra.precio)}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          {producto.ingredientes.length > 0 && (
            <fieldset>
              <legend className={tituloSeccion}>Sacar ingredientes</legend>
              <div className="flex flex-col gap-2">
                {producto.ingredientes.map((ingrediente) => (
                  <label key={ingrediente.id} className={filaOpcion}>
                    <input
                      type="checkbox"
                      checked={sinIngredienteIds.includes(ingrediente.id)}
                      onChange={() => setSinIngredienteIds(alternar(sinIngredienteIds, ingrediente.id))}
                      className="size-5 accent-marca"
                    />
                    <span className="flex-1 text-tinta">Sin {ingrediente.nombre.toLowerCase()}</span>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div>
            <label htmlFor="nota" className={`block ${tituloSeccion}`}>
              Aclaraciones
            </label>
            <textarea
              id="nota"
              value={nota}
              onChange={(evento) => setNota(evento.target.value)}
              maxLength={200}
              rows={3}
              placeholder="Por ejemplo: carne bien cocida"
              className="w-full resize-none rounded-lg border border-stone-300 p-3 text-tinta placeholder:text-stone-400"
            />
          </div>
        </div>

        {/* Pie fijo: cantidad y botón para agregar con el total actualizado */}
        <div className="flex items-center gap-4 border-t border-stone-200 p-4">
          <SelectorCantidad cantidad={cantidad} alCambiar={setCantidad} />
          <button
            type="button"
            onClick={agregar}
            className="flex min-h-12 flex-1 items-center justify-between rounded-xl bg-marca px-4 font-semibold text-white active:bg-marca-oscuro"
          >
            <span>Agregar</span>
            <span>{formatearPrecio(total)}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
