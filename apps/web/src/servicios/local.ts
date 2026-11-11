import { estadoLocalMock, zonasMock } from '../datos/localMock'
import type { EstadoLocal, ZonaEnvio } from '../tipos/pedido'
import { esperar } from '../utilidades/tiempo'

// TEMPORAL: simulan la API. Cuando exista, cada función hace un fetch y el resto de la app no cambia.
// Son async (devuelven una Promise) igual que lo será el fetch real: el código que las usa ya queda preparado.

export async function obtenerZonasEnvio(): Promise<ZonaEnvio[]> {
  await esperar(300)
  return zonasMock // luego: fetch('/api/zonas-envio')
}

export async function obtenerEstadoLocal(): Promise<EstadoLocal> {
  await esperar(300)
  return estadoLocalMock // luego: fetch('/api/local/estado')
}
