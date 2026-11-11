import type { PedidoSeguimiento } from '../tipos/pedido'
import { siguienteEstado } from '../utilidades/estados'
import { esperar } from '../utilidades/tiempo'
import { guardarPedido, leerPedido } from './bdSimulada'

// TEMPORAL: simula GET /api/pedidos/seguimiento/:token
// Si el token no existe, el back real responde 404 y esta función lanza un error.
export async function obtenerPedidoSeguimiento(token: string): Promise<PedidoSeguimiento> {
  await esperar(300)
  const pedido = leerPedido(token)
  if (!pedido) throw new Error('Pedido no encontrado')
  return pedido
}

const MS_ENTRE_ESTADOS = 6000

// TEMPORAL: simula el WebSocket. Cada 6 segundos "la cocina" avanza el pedido al siguiente estado.
// Con Socket.io real, esta función hace lo mismo hacia afuera, según el contrato acordado con el back:
//   1. conecta sin auth:                    const socket = io()
//   2. se une a la sala de su pedido:       socket.emit('seguimiento:unirse', { token })
//   3. escucha el evento 'pedido:estado':   socket.on('pedido:estado', alCambiar)
// El evento trae el pedido completo, con la misma forma que GET /api/pedidos/seguimiento/:token.
// Devuelve una función para dejar de escuchar (se usa al salir de la pantalla).
export function suscribirseAPedido(token: string, alCambiar: (pedido: PedidoSeguimiento) => void): () => void {
  const intervalo = setInterval(() => {
    const pedido = leerPedido(token)
    if (!pedido) return
    const siguiente = siguienteEstado(pedido.estado, pedido.tipoEntrega)
    if (!siguiente) {
      clearInterval(intervalo)
      return
    }
    const actualizado = { ...pedido, estado: siguiente }
    guardarPedido(token, actualizado)
    alCambiar(actualizado)
  }, MS_ENTRE_ESTADOS)

  return () => clearInterval(intervalo)
}
