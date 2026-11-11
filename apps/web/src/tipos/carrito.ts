import type { Extra, Ingrediente, Producto, Tamano } from './carta'

// Un ítem del carrito es un producto con las opciones que eligió el cliente.
// Guardamos los objetos completos (no solo ids) para poder mostrar nombres y precios en el carrito.
// Al confirmar el pedido, al back se le mandan solo los ids y las cantidades.
export interface ItemCarrito {
  idLocal: string // identificador interno del front, para distinguir dos ítems del mismo producto
  producto: Producto
  tamano: Tamano | null // null si el producto no tiene tamaños
  extras: Extra[]
  sinIngredientes: Ingrediente[]
  nota: string
  cantidad: number
}
