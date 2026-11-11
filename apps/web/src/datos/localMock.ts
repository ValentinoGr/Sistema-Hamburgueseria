import type { EstadoLocal, ZonaEnvio } from '../tipos/pedido'

// Datos falsos. Más adelante vienen de GET /api/zonas-envio y GET /api/local/estado.

export const zonasMock: ZonaEnvio[] = [
  { id: 1, nombre: 'Centro', costo: 1500 },
  { id: 2, nombre: 'Barrio Norte', costo: 2000 },
  { id: 3, nombre: 'Zona Sur', costo: 2500 },
]

// Para probar el local cerrado o los pedidos pausados, cambiá estos valores a false / true.
export const estadoLocalMock: EstadoLocal = {
  abierto: true,
  pedidosPausados: false,
  aliasTransferencia: 'burger.pinta.demo',
}
