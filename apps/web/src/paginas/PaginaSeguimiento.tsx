import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import ProgresoPedido from '../componentes/ProgresoPedido'
import { useCargar } from '../hooks/useCargar'
import { obtenerEstadoLocal } from '../servicios/local'
import { obtenerPedidoSeguimiento, suscribirseAPedido } from '../servicios/seguimiento'
import type { PedidoSeguimiento } from '../tipos/pedido'
import { textoEstado } from '../utilidades/estados'
import { formatearPrecio } from '../utilidades/formato'

const nombresMedioPago = { TRANSFERENCIA: 'Transferencia', EFECTIVO: 'Efectivo', MERCADO_PAGO: 'Mercado Pago' }

export default function PaginaSeguimiento() {
  // useParams lee el valor variable de la URL: /seguimiento/:token
  const { token = '' } = useParams()

  // useCargar necesita una función que no cambie en cada dibujo. useCallback "congela" la función
  // y solo la vuelve a crear si cambia el token.
  const cargarPedido = useCallback(() => obtenerPedidoSeguimiento(token), [token])
  const pedido = useCargar(cargarPedido)
  const local = useCargar(obtenerEstadoLocal)

  // Pedido que llega "en vivo". Si todavía no llegó ninguno, usamos el que vino al cargar.
  const [pedidoEnVivo, setPedidoEnVivo] = useState<PedidoSeguimiento | null>(null)

  // Mientras la pantalla está abierta, escuchamos los cambios del pedido.
  // La función que devuelve suscribirseAPedido se ejecuta al salir y deja de escuchar.
  useEffect(() => suscribirseAPedido(token, setPedidoEnVivo), [token])

  const datos = pedidoEnVivo ?? pedido.datos
  const estado = datos?.estado

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-marca shadow-md">
        <div className="mx-auto max-w-2xl px-4 py-4">
          <h1 className="text-lg font-bold text-white">{datos ? `Pedido #${datos.numero}` : 'Seguimiento del pedido'}</h1>
        </div>
      </header>

      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6">
        {pedido.cargando && <p className="text-stone-600">Buscando tu pedido...</p>}

        {pedido.error && (
          <div className="mt-8 text-center">
            <p className="text-lg font-semibold text-tinta">No encontramos este pedido</p>
            <p className="mt-1 text-stone-600">Revisá que el enlace esté completo.</p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-12 items-center rounded-xl bg-marca px-6 font-semibold text-white active:bg-marca-oscuro"
            >
              Ir a la carta
            </Link>
          </div>
        )}

        {datos && estado && (
          <>
            <section className="rounded-xl border border-stone-200 bg-white p-4">
              {/* aria-live avisa a los lectores de pantalla cuando el texto cambia solo */}
              <p aria-live="polite" className="text-xl font-bold text-tinta">
                {textoEstado(estado, datos.tipoEntrega)}
              </p>
              <p className="mt-1 text-sm text-stone-600">Esta pantalla se actualiza sola.</p>

              {estado === 'CANCELADO' ? (
                <p className="mt-4 rounded-lg bg-red-50 p-3 text-red-800">
                  Tu pedido fue cancelado. Si tenés dudas, comunicate con el local.
                </p>
              ) : (
                <div className="mt-5">
                  <ProgresoPedido estado={estado} tipoEntrega={datos.tipoEntrega} />
                </div>
              )}
            </section>

            {/* Aviso de pago: solo si es transferencia y todavía no se confirmó */}
            {datos.medioPago === 'TRANSFERENCIA' && datos.estadoPago === 'PENDIENTE' && estado !== 'CANCELADO' && (
              <section className="rounded-xl bg-acento/20 p-4 text-tinta">
                <p className="font-semibold">Transferencia pendiente</p>
                <p className="mt-1 text-sm">
                  Transferí {formatearPrecio(datos.total)} al alias{' '}
                  <strong>{local.datos?.aliasTransferencia ?? '...'}</strong>.
                </p>
              </section>
            )}

            <section className="rounded-xl border border-stone-200 bg-white p-4">
              <h2 className="mb-3 text-lg font-bold text-tinta">Tu pedido</h2>
              <ul className="flex flex-col gap-3">
                {datos.items.map((item, indice) => {
                  const detalles = [
                    item.tamanoNombre,
                    item.extras.length > 0 ? `Extras: ${item.extras.join(', ')}` : null,
                    item.sinIngredientes.length > 0
                      ? `Sin: ${item.sinIngredientes.map((i) => i.toLowerCase()).join(', ')}`
                      : null,
                    item.nota ? `Aclaración: ${item.nota}` : null,
                  ].filter((detalle) => detalle !== null) // saca los vacíos

                  return (
                    // Acá usamos el índice como key porque la lista no cambia nunca después de cargada
                    <li key={indice} className="flex justify-between gap-3">
                      <div>
                        <p className="font-semibold text-tinta">
                          {item.cantidad} x {item.nombreProducto}
                        </p>
                        {detalles.map((detalle) => (
                          <p key={detalle} className="text-sm text-stone-600">
                            {detalle}
                          </p>
                        ))}
                      </div>
                      <p className="text-tinta">{formatearPrecio(item.precioTotal)}</p>
                    </li>
                  )
                })}
              </ul>

              <dl className="mt-4 space-y-1 border-t border-stone-200 pt-3 text-tinta">
                <div className="flex justify-between">
                  <dt>Subtotal</dt>
                  <dd>{formatearPrecio(datos.subtotal)}</dd>
                </div>
                {datos.tipoEntrega === 'DELIVERY' && (
                  <div className="flex justify-between">
                    <dt>Envío</dt>
                    <dd>{formatearPrecio(datos.costoEnvio)}</dd>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold">
                  <dt>Total</dt>
                  <dd>{formatearPrecio(datos.total)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-sm text-stone-600">
                {datos.tipoEntrega === 'DELIVERY' ? 'Delivery' : 'Retiro en el local'} - Pago: {nombresMedioPago[datos.medioPago]}
              </p>
            </section>

            <p className="text-sm text-stone-600">Guardá este enlace: con él podés volver a ver el estado de tu pedido.</p>
            <Link to="/" className="text-center font-semibold text-marca underline">
              Hacer otro pedido
            </Link>
          </>
        )}
      </main>
    </div>
  )
}
