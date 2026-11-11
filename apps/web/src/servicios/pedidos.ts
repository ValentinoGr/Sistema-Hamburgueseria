import { cartaMock } from '../datos/cartaMock'
import { zonasMock } from '../datos/localMock'
import type { ItemCarrito } from '../tipos/carrito'
import type { CrearPedidoDto, ItemPedidoDto, ItemSeguimiento, PedidoCreado } from '../tipos/pedido'
import { generarId } from '../utilidades/ids'
import { precioUnitario } from '../utilidades/precios'
import { esperar } from '../utilidades/tiempo'
import { guardarPedido } from './bdSimulada'

// Convierte los ítems del carrito (objetos completos) a lo que espera la API: solo ids y cantidades.
export function armarItemsDto(items: ItemCarrito[]): ItemPedidoDto[] {
  return items.map((item) => ({
    productoId: item.producto.id,
    tamanoId: item.tamano?.id ?? null,
    extraIds: item.extras.map((extra) => extra.id),
    sinIngredienteIds: item.sinIngredientes.map((ingrediente) => ingrediente.id),
    nota: item.nota || undefined,
    cantidad: item.cantidad,
  }))
}

let ultimoNumero = 0

// TEMPORAL: simula POST /api/pedidos. Cuando exista la API, se reemplaza el cuerpo por un fetch.
// Imita al backend real: recibe solo ids, busca los precios por su cuenta y calcula los totales.
export async function crearPedido(dto: CrearPedidoDto): Promise<PedidoCreado> {
  console.log('POST /api/pedidos (simulado) ->', dto) // mirá la consola del navegador (F12) para ver qué se enviaría
  await esperar(700)

  const productos = cartaMock.flatMap((categoria) => categoria.productos)
  const itemsPedido: ItemSeguimiento[] = dto.items.map((item) => {
    const producto = productos.find((p) => p.id === item.productoId)
    if (!producto) throw new Error(`Producto ${item.productoId} inexistente`)
    const tamano = producto.tamanos.find((t) => t.id === item.tamanoId) ?? null
    const extras = producto.extras.filter((e) => item.extraIds.includes(e.id))
    return {
      nombreProducto: producto.nombre,
      tamanoNombre: tamano?.nombre ?? null,
      cantidad: item.cantidad,
      extras: extras.map((e) => e.nombre),
      sinIngredientes: producto.ingredientes.filter((i) => item.sinIngredienteIds.includes(i.id)).map((i) => i.nombre),
      nota: item.nota ?? null,
      precioTotal: precioUnitario(producto, tamano, extras) * item.cantidad,
    }
  })
  const subtotal = itemsPedido.reduce((suma, item) => suma + item.precioTotal, 0)

  const zona = zonasMock.find((z) => z.id === dto.zonaEnvioId)
  const costoEnvio = dto.tipoEntrega === 'DELIVERY' ? (zona?.costo ?? 0) : 0
  const total = subtotal + costoEnvio

  ultimoNumero += 1
  const tokenSeguimiento = generarId()
  // Guardamos el pedido para poder consultarlo después en la pantalla de seguimiento.
  guardarPedido(tokenSeguimiento, {
    numero: ultimoNumero,
    estado: 'NUEVO',
    tipoEntrega: dto.tipoEntrega,
    medioPago: dto.medioPago,
    estadoPago: 'PENDIENTE',
    items: itemsPedido,
    subtotal,
    costoEnvio,
    total,
  })

  const fecha = new Date().toISOString().slice(0, 10) // simulación: el back real calcula el día comercial
  return { numero: ultimoNumero, fecha, tokenSeguimiento, estado: 'NUEVO', subtotal, costoEnvio, total }
}
