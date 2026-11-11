// Tipos del pedido y del local. Siguen el contrato de API propuesto (POST /api/pedidos, GET /api/zonas-envio, GET /api/local/estado).
// TEMPORAL: cuando exista packages/shared, estos tipos se reemplazan por un import de ahí.
// Los valores en mayúsculas coinciden con los enums del CLAUDE.md (TipoEntrega, MedioPago).

export type TipoEntrega = 'DELIVERY' | 'RETIRO'
export type MedioPago = 'TRANSFERENCIA' | 'EFECTIVO' | 'MERCADO_PAGO'
export type EstadoPedido = 'NUEVO' | 'EN_PREPARACION' | 'LISTO' | 'EN_CAMINO' | 'ENTREGADO' | 'CANCELADO'
export type EstadoPago = 'PENDIENTE' | 'CONFIRMADO' | 'RECHAZADO'

export interface ZonaEnvio {
  id: number
  nombre: string
  costo: number // pesos enteros
}

export interface EstadoLocal {
  abierto: boolean // dentro del horario de atención
  pedidosPausados: boolean // el dueño pausó los pedidos manualmente
  aliasTransferencia: string
}

// Lo que el front le manda al back: SOLO ids y cantidades, nunca precios ni totales.
export interface ItemPedidoDto {
  productoId: number
  tamanoId: number | null
  extraIds: number[]
  sinIngredienteIds: number[]
  nota?: string
  cantidad: number
}

export interface CrearPedidoDto {
  clienteNombre: string
  clienteTelefono: string
  tipoEntrega: TipoEntrega
  zonaEnvioId?: number // solo si es DELIVERY
  direccion?: string // solo si es DELIVERY
  medioPago: MedioPago
  items: ItemPedidoDto[]
}

// Un ítem tal como se muestra en el seguimiento. Los precios y nombres son los del momento del pedido (snapshot).
export interface ItemSeguimiento {
  nombreProducto: string
  tamanoNombre: string | null
  cantidad: number
  extras: string[]
  sinIngredientes: string[]
  nota: string | null
  precioTotal: number // (precio unitario + extras) x cantidad
}

// Respuesta de GET /api/pedidos/seguimiento/:token. No incluye ids internos.
export interface PedidoSeguimiento {
  numero: number
  estado: EstadoPedido
  tipoEntrega: TipoEntrega
  medioPago: MedioPago
  estadoPago: EstadoPago
  items: ItemSeguimiento[]
  subtotal: number
  costoEnvio: number
  total: number
}

// Lo que el back responde al crear el pedido: los montos los calcula él.
export interface PedidoCreado {
  numero: number
  fecha: string // día comercial, "YYYY-MM-DD"
  tokenSeguimiento: string
  estado: EstadoPedido
  subtotal: number
  costoEnvio: number
  total: number
}
