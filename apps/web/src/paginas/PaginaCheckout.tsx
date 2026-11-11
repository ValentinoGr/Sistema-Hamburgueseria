import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import CampoTexto from '../componentes/CampoTexto'
import OpcionRadio from '../componentes/OpcionRadio'
import { useCarrito } from '../contexto/carritoContexto'
import { useCargar } from '../hooks/useCargar'
import { obtenerEstadoLocal, obtenerZonasEnvio } from '../servicios/local'
import { armarItemsDto, crearPedido } from '../servicios/pedidos'
import type { CrearPedidoDto, MedioPago, TipoEntrega } from '../tipos/pedido'
import { formatearPrecio } from '../utilidades/formato'

// Todo lo que el cliente completa. null = todavía no eligió.
interface ValoresFormulario {
  nombre: string
  telefono: string
  tipoEntrega: TipoEntrega | null
  zonaEnvioId: number | null
  direccion: string
  medioPago: MedioPago | null
}

// Un mensaje de error opcional por campo
type Errores = Partial<Record<keyof ValoresFormulario, string>>

const valoresIniciales: ValoresFormulario = {
  nombre: '',
  telefono: '',
  tipoEntrega: null,
  zonaEnvioId: null,
  direccion: '',
  medioPago: null,
}

// Revisa los valores y devuelve los errores. No guarda nada: se recalcula en cada dibujo.
function validar(valores: ValoresFormulario): Errores {
  const errores: Errores = {}
  if (valores.nombre.trim().length < 2) errores.nombre = 'Ingresá tu nombre.'
  const digitosTelefono = valores.telefono.replace(/\D/g, '') // saca todo lo que no sea número
  if (digitosTelefono.length < 8 || digitosTelefono.length > 15) errores.telefono = 'Ingresá un teléfono válido.'
  if (valores.tipoEntrega === null) errores.tipoEntrega = 'Elegí cómo querés recibir el pedido.'
  if (valores.tipoEntrega === 'DELIVERY') {
    if (valores.zonaEnvioId === null) errores.zonaEnvioId = 'Elegí tu zona de envío.'
    if (valores.direccion.trim().length < 5) errores.direccion = 'Ingresá tu dirección.'
  }
  if (valores.medioPago === null) errores.medioPago = 'Elegí cómo vas a pagar.'
  return errores
}

export default function PaginaCheckout() {
  const { items, subtotal, vaciar } = useCarrito()
  const navegar = useNavigate()

  const zonas = useCargar(obtenerZonasEnvio)
  const local = useCargar(obtenerEstadoLocal)

  const [valores, setValores] = useState<ValoresFormulario>(valoresIniciales)
  // Los errores solo se muestran después del primer intento de enviar, para no llenar de rojo un formulario vacío.
  const [intentoEnvio, setIntentoEnvio] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [errorEnvio, setErrorEnvio] = useState<string | null>(null)

  // Actualiza un solo campo y deja el resto igual. Ejemplo: cambiar('nombre', 'Ana')
  function cambiar<Campo extends keyof ValoresFormulario>(campo: Campo, valor: ValoresFormulario[Campo]) {
    setValores((actuales) => ({ ...actuales, [campo]: valor }))
  }

  // Sin nada en el carrito no hay nada que confirmar: volvemos al carrito.
  if (items.length === 0) return <Navigate to="/carrito" replace />

  const errores = validar(valores)
  const hayErrores = Object.keys(errores).length > 0
  // Después de intentar enviar, mostramos los errores; antes no.
  const verError = (campo: keyof ValoresFormulario) => (intentoEnvio ? errores[campo] : undefined)

  const esDelivery = valores.tipoEntrega === 'DELIVERY'
  const zonaElegida = zonas.datos?.find((zona) => zona.id === valores.zonaEnvioId)
  const costoEnvio = esDelivery ? (zonaElegida?.costo ?? 0) : 0
  const total = subtotal + costoEnvio

  const cargandoDatos = zonas.cargando || local.cargando
  const falloCarga = zonas.error || local.error
  const localCerrado = local.datos !== null && !local.datos.abierto
  const localPausado = local.datos !== null && local.datos.pedidosPausados
  const puedePedir = !cargandoDatos && !falloCarga && !localCerrado && !localPausado

  async function enviar(evento: FormEvent<HTMLFormElement>) {
    evento.preventDefault() // sin esto el navegador recargaría la página al enviar el formulario
    setIntentoEnvio(true)
    const { tipoEntrega, medioPago } = valores
    if (hayErrores || tipoEntrega === null || medioPago === null || !puedePedir) return

    const pedido: CrearPedidoDto = {
      clienteNombre: valores.nombre.trim(),
      clienteTelefono: valores.telefono.trim(),
      tipoEntrega,
      zonaEnvioId: esDelivery ? (valores.zonaEnvioId ?? undefined) : undefined,
      direccion: esDelivery ? valores.direccion.trim() : undefined,
      medioPago,
      items: armarItemsDto(items),
    }

    setEnviando(true)
    setErrorEnvio(null)
    try {
      const creado = await crearPedido(pedido)
      // Primero navegamos y después vaciamos: si fuera al revés, el carrito vacío nos mandaría de vuelta a /carrito.
      navegar(`/seguimiento/${creado.tokenSeguimiento}`)
      vaciar()
    } catch {
      setErrorEnvio('No pudimos enviar tu pedido. Probá de nuevo en un momento.')
      setEnviando(false)
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="sticky top-0 z-10 bg-marca shadow-md">
        <div className="mx-auto flex max-w-2xl items-center gap-2 px-4 py-3">
          <Link to="/carrito" className="flex min-h-11 items-center rounded-lg pr-3 text-sm font-semibold text-white underline">
            Volver al pedido
          </Link>
          <h1 className="flex-1 text-right text-lg font-bold text-white">Tus datos</h1>
        </div>
      </header>

      {/* noValidate desactiva los mensajes automáticos del navegador: validamos nosotros */}
      <form onSubmit={enviar} noValidate>
        <main className="mx-auto flex max-w-2xl flex-col gap-6 px-4 py-6 pb-56">
          {cargandoDatos && <p className="text-stone-600">Cargando...</p>}
          {falloCarga && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-red-800">
              No pudimos cargar los datos del local. Recargá la página para volver a intentar.
            </p>
          )}
          {localCerrado && (
            <p role="alert" className="rounded-lg bg-acento/20 p-3 font-semibold text-tinta">
              El local está cerrado en este momento, así que no podemos tomar pedidos.
            </p>
          )}
          {localPausado && !localCerrado && (
            <p role="alert" className="rounded-lg bg-acento/20 p-3 font-semibold text-tinta">
              Pausamos los pedidos por un momento. Probá de nuevo en unos minutos.
            </p>
          )}

          <section className="flex flex-col gap-4">
            <h2 className="text-lg font-bold text-tinta">Tus datos</h2>
            <CampoTexto
              id="nombre"
              etiqueta="Nombre"
              valor={valores.nombre}
              alCambiar={(valor) => cambiar('nombre', valor)}
              error={verError('nombre')}
              autoComplete="name"
            />
            <CampoTexto
              id="telefono"
              etiqueta="Teléfono"
              tipo="tel"
              valor={valores.telefono}
              alCambiar={(valor) => cambiar('telefono', valor)}
              error={verError('telefono')}
              placeholder="Con código de área"
              autoComplete="tel"
            />
          </section>

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-lg font-bold text-tinta">Entrega</legend>
            <OpcionRadio
              nombre="tipoEntrega"
              titulo="Delivery"
              marcado={valores.tipoEntrega === 'DELIVERY'}
              alElegir={() => cambiar('tipoEntrega', 'DELIVERY')}
            />
            <OpcionRadio
              nombre="tipoEntrega"
              titulo="Retiro en el local"
              marcado={valores.tipoEntrega === 'RETIRO'}
              alElegir={() => cambiar('tipoEntrega', 'RETIRO')}
            />
            {verError('tipoEntrega') && <p className="text-sm text-red-700">{verError('tipoEntrega')}</p>}
          </fieldset>

          {/* La zona y la dirección solo se piden si eligió delivery */}
          {esDelivery && (
            <>
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-lg font-bold text-tinta">Zona de envío</legend>
                {zonas.datos?.map((zona) => (
                  <OpcionRadio
                    key={zona.id}
                    nombre="zona"
                    titulo={zona.nombre}
                    detalle={formatearPrecio(zona.costo)}
                    marcado={valores.zonaEnvioId === zona.id}
                    alElegir={() => cambiar('zonaEnvioId', zona.id)}
                  />
                ))}
                {verError('zonaEnvioId') && <p className="text-sm text-red-700">{verError('zonaEnvioId')}</p>}
              </fieldset>
              <CampoTexto
                id="direccion"
                etiqueta="Dirección"
                valor={valores.direccion}
                alCambiar={(valor) => cambiar('direccion', valor)}
                error={verError('direccion')}
                placeholder="Calle, número, piso/depto"
                autoComplete="street-address"
              />
            </>
          )}

          <fieldset className="flex flex-col gap-2">
            <legend className="mb-2 text-lg font-bold text-tinta">Forma de pago</legend>
            <OpcionRadio
              nombre="medioPago"
              titulo="Transferencia"
              marcado={valores.medioPago === 'TRANSFERENCIA'}
              alElegir={() => cambiar('medioPago', 'TRANSFERENCIA')}
            />
            <OpcionRadio
              nombre="medioPago"
              titulo="Efectivo"
              marcado={valores.medioPago === 'EFECTIVO'}
              alElegir={() => cambiar('medioPago', 'EFECTIVO')}
            />
            {/* Mercado Pago es de la etapa 2, por eso todavía no aparece */}
            {valores.medioPago === 'TRANSFERENCIA' && local.datos && (
              <p className="rounded-lg bg-stone-100 p-3 text-sm text-stone-700">
                Alias para transferir: <strong>{local.datos.aliasTransferencia}</strong>
              </p>
            )}
            {verError('medioPago') && <p className="text-sm text-red-700">{verError('medioPago')}</p>}
          </fieldset>
        </main>

        <div className="fixed inset-x-0 bottom-0 z-10 border-t border-stone-200 bg-white p-4">
          <div className="mx-auto max-w-2xl">
            <dl className="space-y-1 text-tinta">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd>{formatearPrecio(subtotal)}</dd>
              </div>
              {esDelivery && (
                <div className="flex justify-between">
                  <dt>Envío</dt>
                  <dd>{zonaElegida ? formatearPrecio(costoEnvio) : 'Elegí una zona'}</dd>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold">
                <dt>Total</dt>
                <dd>{formatearPrecio(total)}</dd>
              </div>
            </dl>
            {errorEnvio && (
              <p role="alert" className="mt-2 text-sm text-red-700">
                {errorEnvio}
              </p>
            )}
            <button
              type="submit"
              disabled={enviando || !puedePedir}
              className="mt-3 flex min-h-12 w-full items-center justify-center rounded-xl bg-marca font-semibold text-white enabled:active:bg-marca-oscuro disabled:opacity-50"
            >
              {enviando ? 'Enviando...' : 'Confirmar pedido'}
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
