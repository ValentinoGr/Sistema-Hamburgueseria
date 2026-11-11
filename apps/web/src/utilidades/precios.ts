import type { Extra, Producto, Tamano } from '../tipos/carta'
import type { ItemCarrito } from '../tipos/carrito'

// IMPORTANTE: estos cálculos son solo para MOSTRAR el precio mientras el cliente arma su pedido.
// El precio real lo calcula siempre el backend; el front nunca manda un total.

// Precio de una unidad = precio base + adicional del tamaño + suma de extras
export function precioUnitario(producto: Producto, tamano: Tamano | null, extras: Extra[]): number {
  const sumaExtras = extras.reduce((suma, extra) => suma + extra.precio, 0)
  return producto.precio + (tamano?.precioAdicional ?? 0) + sumaExtras
}

// Total del ítem = precio unitario x cantidad
export function totalItem(item: ItemCarrito): number {
  return precioUnitario(item.producto, item.tamano, item.extras) * item.cantidad
}
