import { createContext, useContext } from 'react'
import type { ItemCarrito } from '../tipos/carrito'

// Un Context es un "estante" de datos al que puede acceder cualquier componente de la app,
// sin pasarlos de padre a hijo por props en cada nivel. Acá guardamos el carrito.
export interface ValorCarrito {
  items: ItemCarrito[]
  cantidadTotal: number // unidades en total (2 burgers + 1 gaseosa = 3)
  subtotal: number // suma de los ítems, sin envío. Solo para mostrar: el back recalcula.
  agregar: (item: ItemCarrito) => void
  cambiarCantidad: (idLocal: string, cantidad: number) => void
  eliminar: (idLocal: string) => void
  vaciar: () => void
}

export const CarritoContexto = createContext<ValorCarrito | null>(null)

// Hook propio: cualquier componente hace `const { items, agregar } = useCarrito()`.
export function useCarrito(): ValorCarrito {
  const valor = useContext(CarritoContexto)
  if (!valor) throw new Error('useCarrito se tiene que usar dentro de <CarritoProvider>')
  return valor
}
