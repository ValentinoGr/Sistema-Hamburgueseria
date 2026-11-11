// Tipos de la carta. Tienen la forma de la respuesta propuesta para GET /api/carta.
// TEMPORAL: cuando exista packages/shared, estos tipos se reemplazan por un import de ahí.

export interface Tamano {
  id: number
  nombre: string // "Simple", "Doble", "Triple"
  precioAdicional: number // pesos enteros que se suman al precio base
}

export interface Extra {
  id: number
  nombre: string
  precio: number
}

export interface Ingrediente {
  id: number
  nombre: string // los que el cliente puede sacar (sin costo)
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string | null // puede venir vacía (ej: una gaseosa)
  precio: number // pesos enteros, nunca decimales
  imagenUrl: string | null // null = todavía no tiene foto
  disponible: boolean // false = "Sin stock por hoy"
  esPersonalizable: boolean
  // Solo vienen con datos si esPersonalizable es true
  tamanos: Tamano[]
  extras: Extra[]
  ingredientes: Ingrediente[]
}

export interface Categoria {
  id: number
  nombre: string
  // El back ya manda las categorías y productos ordenados, así que el front no necesita el campo "orden".
  productos: Producto[]
}

// Forma completa de la respuesta de GET /api/carta
export type Carta = Categoria[]
