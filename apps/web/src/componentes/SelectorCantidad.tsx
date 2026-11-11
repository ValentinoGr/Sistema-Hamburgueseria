interface Props {
  cantidad: number
  alCambiar: (nuevaCantidad: number) => void
  minimo?: number
  maximo?: number
}

// Botones - y + con la cantidad en el medio. Se reutiliza en el panel y, más adelante, en el carrito.
export default function SelectorCantidad({ cantidad, alCambiar, minimo = 1, maximo = 20 }: Props) {
  const botonClases =
    'flex size-11 items-center justify-center rounded-full border border-stone-300 text-xl font-semibold text-tinta enabled:active:bg-stone-100 disabled:opacity-40'

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        aria-label="Quitar uno"
        disabled={cantidad <= minimo}
        onClick={() => alCambiar(cantidad - 1)}
        className={botonClases}
      >
        -
      </button>
      <span className="w-6 text-center text-lg font-semibold text-tinta" aria-live="polite">
        {cantidad}
      </span>
      <button
        type="button"
        aria-label="Agregar uno"
        disabled={cantidad >= maximo}
        onClick={() => alCambiar(cantidad + 1)}
        className={botonClases}
      >
        +
      </button>
    </div>
  )
}
