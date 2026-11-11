import type { Categoria, Producto } from '../tipos/carta'
import TarjetaProducto from './TarjetaProducto'

interface Props {
  categoria: Categoria
  alSeleccionar: (producto: Producto) => void
}

export default function SeccionCategoria({ categoria, alSeleccionar }: Props) {
  return (
    // El id permite que los enlaces de arriba (#categoria-1) salten hasta acá.
    // scroll-mt deja espacio para que la barra fija no tape el título.
    <section id={`categoria-${categoria.id}`} className="scroll-mt-32">
      <h2 className="mb-3 text-xl font-bold text-tinta">{categoria.nombre}</h2>
      <div className="flex flex-col gap-3">
        {/* map recorre la lista y devuelve una tarjeta por producto. "key" ayuda a React a distinguirlas. */}
        {categoria.productos.map((producto) => (
          <TarjetaProducto key={producto.id} producto={producto} alSeleccionar={alSeleccionar} />
        ))}
      </div>
    </section>
  )
}
