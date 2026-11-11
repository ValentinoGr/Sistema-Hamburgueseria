import type { PedidoSeguimiento } from '../tipos/pedido'

// TEMPORAL: una "base de datos" falsa en el navegador, para que el pedido creado en el checkout
// exista cuando abrimos el seguimiento. Se borra cuando exista la API real.

const CLAVE = 'burgerpinta:pedidos-simulados'

type Pedidos = Record<string, PedidoSeguimiento> // el token de seguimiento es la clave

function leerTodos(): Pedidos {
  try {
    const texto = localStorage.getItem(CLAVE)
    return texto ? (JSON.parse(texto) as Pedidos) : {}
  } catch {
    return {}
  }
}

function guardarTodos(pedidos: Pedidos) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(pedidos))
  } catch {
    // Sin almacenamiento, la simulación no persiste, pero no rompe.
  }
}

export function guardarPedido(token: string, pedido: PedidoSeguimiento) {
  guardarTodos({ ...leerTodos(), [token]: pedido })
}

export function leerPedido(token: string): PedidoSeguimiento | null {
  return leerTodos()[token] ?? null
}
