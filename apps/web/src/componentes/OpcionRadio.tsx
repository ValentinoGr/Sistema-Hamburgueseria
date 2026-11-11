interface Props {
  nombre: string // los radios con el mismo nombre forman un grupo: se elige uno solo
  titulo: string
  detalle?: string // texto a la derecha, por ejemplo un precio
  marcado: boolean
  alElegir: () => void
}

export default function OpcionRadio({ nombre, titulo, detalle, marcado, alElegir }: Props) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center gap-3 rounded-lg border border-stone-200 bg-white px-3 py-2 has-checked:border-marca has-checked:bg-marca/5">
      <input type="radio" name={nombre} checked={marcado} onChange={alElegir} className="size-5 accent-marca" />
      <span className="flex-1 text-tinta">{titulo}</span>
      {detalle && <span className="text-sm text-stone-600">{detalle}</span>}
    </label>
  )
}
