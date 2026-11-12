// Enums compartidos entre front y back.
// Los valores deben coincidir exactamente con los enums del schema de Prisma.

export const EstadoPedido = {
  NUEVO: 'NUEVO',
  EN_PREPARACION: 'EN_PREPARACION',
  LISTO: 'LISTO',
  EN_CAMINO: 'EN_CAMINO',
  ENTREGADO: 'ENTREGADO',
  CANCELADO: 'CANCELADO',
} as const;
export type EstadoPedido = (typeof EstadoPedido)[keyof typeof EstadoPedido];

export const TipoEntrega = {
  DELIVERY: 'DELIVERY',
  RETIRO: 'RETIRO',
} as const;
export type TipoEntrega = (typeof TipoEntrega)[keyof typeof TipoEntrega];

export const MedioPago = {
  TRANSFERENCIA: 'TRANSFERENCIA',
  EFECTIVO: 'EFECTIVO',
  MERCADO_PAGO: 'MERCADO_PAGO',
} as const;
export type MedioPago = (typeof MedioPago)[keyof typeof MedioPago];

export const EstadoPago = {
  PENDIENTE: 'PENDIENTE',
  CONFIRMADO: 'CONFIRMADO',
  RECHAZADO: 'RECHAZADO',
} as const;
export type EstadoPago = (typeof EstadoPago)[keyof typeof EstadoPago];

export const OrigenPedido = {
  WEB: 'WEB',
  CAJA: 'CAJA',
} as const;
export type OrigenPedido = (typeof OrigenPedido)[keyof typeof OrigenPedido];

export const MotivoCancelacion = {
  CLIENTE_DESISTIO: 'CLIENTE_DESISTIO',
  SIN_STOCK: 'SIN_STOCK',
  PAGO_NO_RECIBIDO: 'PAGO_NO_RECIBIDO',
  OTRO: 'OTRO',
} as const;
export type MotivoCancelacion = (typeof MotivoCancelacion)[keyof typeof MotivoCancelacion];

export const Rol = {
  ADMIN: 'ADMIN',
  COCINA: 'COCINA',
  CAJA: 'CAJA',
} as const;
export type Rol = (typeof Rol)[keyof typeof Rol];
