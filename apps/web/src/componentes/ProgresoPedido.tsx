import type { EstadoPedido, TipoEntrega } from '../tipos/pedido'
import { pasosDelPedido, textoEstado } from '../utilidades/estados'

interface Props {
  estado: EstadoPedido
  tipoEntrega: TipoEntrega
}

// Lista vertical de pasos: los pasos hechos van en azul, el actual en dorado y los que faltan en gris.
export default function ProgresoPedido({ estado, tipoEntrega }: Props) {
  const pasos = pasosDelPedido(tipoEntrega)
  const indiceActual = pasos.indexOf(estado)
  const terminado = estado === 'ENTREGADO' // cuando se entregó, todos los pasos quedan hechos

  return (
    <ol>
      {pasos.map((paso, indice) => {
        const hecho = terminado || indice < indiceActual
        const actual = !terminado && indice === indiceActual
        const esUltimo = indice === pasos.length - 1

        return (
          <li key={paso} className="flex gap-3" aria-current={actual ? 'step' : undefined}>
            <div className="flex flex-col items-center">
              <span
                className={`mt-1 size-4 shrink-0 rounded-full border-2 ${
                  hecho
                    ? 'border-marca bg-marca'
                    : actual
                      ? 'border-acento bg-acento ring-4 ring-acento/30'
                      : 'border-stone-300 bg-white'
                }`}
              />
              {!esUltimo && <span className={`min-h-8 w-0.5 flex-1 ${hecho ? 'bg-marca' : 'bg-stone-300'}`} />}
            </div>
            <p className={`pb-5 ${actual ? 'font-bold text-tinta' : hecho ? 'text-tinta' : 'text-stone-500'}`}>
              {textoEstado(paso, tipoEntrega)}
              {/* Texto solo para lectores de pantalla, porque el color no se puede "leer" */}
              <span className="sr-only">{hecho ? ' (hecho)' : actual ? ' (ahora)' : ' (pendiente)'}</span>
            </p>
          </li>
        )
      })}
    </ol>
  )
}
