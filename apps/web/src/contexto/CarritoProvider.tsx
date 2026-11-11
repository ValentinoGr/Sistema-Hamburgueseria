import { useEffect, useState, type ReactNode } from 'react'
import type { ItemCarrito } from '../tipos/carrito'
import { totalItem } from '../utilidades/precios'
import { CarritoContexto } from './carritoContexto'

const CLAVE_STORAGE = 'burgerpinta:carrito'

// localStorage guarda texto en el navegador y sobrevive a recargar la página.
// Va con try/catch porque puede fallar (modo privado, almacenamiento bloqueado) y el carrito tiene que seguir andando.
function leerCarritoGuardado(): ItemCarrito[] {
  try {
    const texto = localStorage.getItem(CLAVE_STORAGE)
    const datos: unknown = texto ? JSON.parse(texto) : []
    return Array.isArray(datos) ? (datos as ItemCarrito[]) : []
  } catch {
    return []
  }
}

// children son los componentes que van adentro: <CarritoProvider> ... </CarritoProvider>
export default function CarritoProvider({ children }: { children: ReactNode }) {
  // Pasamos una función a useState para que lea el almacenamiento una sola vez, al iniciar.
  const [items, setItems] = useState<ItemCarrito[]>(leerCarritoGuardado)

  // Cada vez que cambian los ítems, los guardamos.
  useEffect(() => {
    try {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(items))
    } catch {
      // Si no se puede guardar, el carrito sigue funcionando en memoria.
    }
  }, [items])

  const valor = {
    items,
    cantidadTotal: items.reduce((suma, item) => suma + item.cantidad, 0),
    subtotal: items.reduce((suma, item) => suma + totalItem(item), 0),
    agregar: (item: ItemCarrito) => setItems((actuales) => [...actuales, item]),
    // map devuelve una lista nueva: copia todos los ítems y cambia solo el que corresponde.
    cambiarCantidad: (idLocal: string, cantidad: number) =>
      setItems((actuales) => actuales.map((item) => (item.idLocal === idLocal ? { ...item, cantidad } : item))),
    eliminar: (idLocal: string) => setItems((actuales) => actuales.filter((item) => item.idLocal !== idLocal)),
    vaciar: () => setItems([]),
  }

  return <CarritoContexto value={valor}>{children}</CarritoContexto>
}
