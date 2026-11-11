import type { EstadoPedido, TipoEntrega } from '../tipos/pedido'

// Los pasos que recorre un pedido (sin contar CANCELADO, que puede pasar desde cualquier estado).
// El retiro no tiene el paso EN_CAMINO. Es el mismo flujo que define el CLAUDE.md.
export function pasosDelPedido(tipoEntrega: TipoEntrega): EstadoPedido[] {
  return tipoEntrega === 'DELIVERY'
    ? ['NUEVO', 'EN_PREPARACION', 'LISTO', 'EN_CAMINO', 'ENTREGADO']
    : ['NUEVO', 'EN_PREPARACION', 'LISTO', 'ENTREGADO']
}

// El estado que sigue, o null si ya terminó (ENTREGADO o CANCELADO).
export function siguienteEstado(estado: EstadoPedido, tipoEntrega: TipoEntrega): EstadoPedido | null {
  const pasos = pasosDelPedido(tipoEntrega)
  const indice = pasos.indexOf(estado)
  return indice === -1 ? null : (pasos[indice + 1] ?? null)
}

// Texto para el cliente. LISTO cambia según cómo recibe el pedido.
export function textoEstado(estado: EstadoPedido, tipoEntrega: TipoEntrega): string {
  switch (estado) {
    case 'NUEVO':
      return 'Recibimos tu pedido'
    case 'EN_PREPARACION':
      return 'Lo estamos preparando'
    case 'LISTO':
      return tipoEntrega === 'DELIVERY' ? 'Listo para salir' : 'Listo para retirar'
    case 'EN_CAMINO':
      return 'En camino'
    case 'ENTREGADO':
      return 'Entregado'
    case 'CANCELADO':
      return 'Pedido cancelado'
  }
}
