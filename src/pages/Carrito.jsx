import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useProducts } from '../hooks/useProducts.js'
import { useZonas } from '../hooks/useZonas.js'
import { calcularProximaEntrega, horarioATexto } from '../lib/entrega.js'
import ProductCarousel from '../components/ProductCarousel.jsx'

const WHATSAPP_NUMBER = '5493814571329'

const MEDIOS_PAGO = ['Transferencia bancaria', 'Efectivo']

function formatPrice(n) {
  return Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

function PedidoEnviado({ zona, entrega, onNuevoPedido }) {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <div className="flex items-center justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-leaf/10">
          <span className="text-4xl">✅</span>
        </div>
      </div>
      <h1 className="mt-6 font-display text-3xl font-bold text-charcoal">
        ¡Pedido enviado!
      </h1>
      <p className="mt-3 text-charcoal/70">
        Tu pedido fue enviado por WhatsApp. Te vamos a contactar para confirmar
        la entrega en <strong>{zona}</strong>.
      </p>
      <div className="mt-6 rounded-card border border-line bg-creamDark p-5 text-sm text-charcoal/70 text-left space-y-2">
        <p>📦 Estamos preparando tu pedido con productos frescos del Mercofrut.</p>
        {entrega && (
          <p>🛵 Tu próxima entrega estimada es el <strong>{entrega.diaNombre} {entrega.diaNum} de {entrega.mes}</strong>
            {entrega.horario ? `, de ${entrega.horario}` : ''}.</p>
        )}
        <p>💬 Si tenés alguna consulta, escribinos por WhatsApp al mismo número.</p>
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <button onClick={onNuevoPedido} className="btn-primary">
          Hacer otro pedido
        </button>
        <Link to="/" className="btn-secondary">
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

export default function Carrito() {
  const { cartList, setQty, totalPrice, clearCart } = useCart()
  const { products } = useProducts()
  const { zonas } = useZonas()
  const [pedidoEnviado, setPedidoEnviado] = useState(false)
  const [zonaEnviada, setZonaEnviada]     = useState('')
  const [entregaEnviada, setEntregaEnviada] = useState(null)

  // Destacados para recomendar antes de cerrar, sin los que ya están en el carrito
  const idsEnCarrito = new Set(cartList.map(({ product }) => product.id))
  const recomendados = products.filter((p) => p.featured && !idsEnCarrito.has(p.id))

  const [form, setForm] = useState({
    nombre: '', direccion: '', celular: '', zona: '', medio_pago: '', nota: '',
  })
  const [errors, setErrors] = useState({})

  const zonaSeleccionada = zonas.find((z) => String(z.id) === form.zona)
  const costoServicio    = zonaSeleccionada?.costo ?? null
  const totalEstimado    = costoServicio !== null ? totalPrice + costoServicio : null
  const entrega          = zonaSeleccionada ? calcularProximaEntrega(zonaSeleccionada) : null

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.nombre.trim())    e.nombre     = 'Ingresá tu nombre'
    if (!form.direccion.trim()) e.direccion  = 'Ingresá la dirección de entrega'
    if (!form.celular.trim())   e.celular    = 'Ingresá el celular de quien recibe'
    if (!form.zona)             e.zona       = 'Seleccioná tu zona de entrega'
    if (!form.medio_pago)       e.medio_pago = 'Seleccioná un medio de pago'
    return e
  }

  function cambiarQty(product, qty, delta) {
    const paso = product.paso || 1
    const next = Math.max(0, Math.round((qty + delta * paso) * 100) / 100)
    setQty(product, next)
  }

  function enviarPorWhatsApp() {
    const errs = validar()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    const lineas = []
    cartList.forEach(({ product, qty }) => {
      const unidadLabel = product.unidad_display || product.unit || 'u'
      const esPorKg = unidadLabel === 'kg'
      // kg -> "1 kg" ; peso variable -> "1 u (aprox)" ; entero -> "x1"
      let qtyStr
      if (esPorKg) qtyStr = `${qty} kg`
      else if (product.pesoVariable) qtyStr = `${qty} ${unidadLabel} (aprox)`
      else qtyStr = `x${qty}`

      lineas.push(`> ${product.name} ${qtyStr} — $${formatPrice(product.price * qty)} (#${product.id})`)

      // Si es un pack, agregar el desglose de componentes
      if (product.isPack && Array.isArray(product.components) && product.components.length > 0) {
        product.components.forEach((c) => {
          lineas.push(`>    · ${c.cantidad} ${c.unidad} ${c.sku}`)
        })
      }
    })

    const entregaTexto = entrega
      ? `Proxima entrega: ${entrega.diaNombre} ${entrega.diaNum} de ${entrega.mes}, ${horarioATexto(zonaSeleccionada)}`
      : 'Entrega a coordinar'

    const partes = [
      '🛒 NUEVO PEDIDO - Romano Abasto',
      entregaTexto,
      '',
      ...lineas,
      '',
      `🚚 Servicio (${zonaSeleccionada.nombre}): $${formatPrice(costoServicio)}`,
      `💰 *TOTAL ESTIMADO: $${formatPrice(totalEstimado)}*`,
      '',
      '⚠️ El total es estimativo. El valor final se calculara segun el peso real de los productos.',
      '',
      '📋 DATOS DE ENTREGA',
      `👤 Nombre: ${form.nombre}`,
      `📍 Direccion: ${form.direccion}`,
      `🗺️ Zona: ${zonaSeleccionada.nombre}`,
      `📱 Celular: ${form.celular}`,
      `💳 Medio de pago: ${form.medio_pago}`,
    ]

    if (form.nota.trim()) partes.push('', `📝 Nota: ${form.nota}`)

    partes.push('', '🛡️ Si algo no llego en condiciones, mandanos foto por este mismo WhatsApp y lo resolvemos en el proximo pedido.')

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(partes.join('\n'))}`
    window.open(url, '_blank')

    setZonaEnviada(zonaSeleccionada.nombre)
    setEntregaEnviada(entrega ? { ...entrega, horario: horarioATexto(zonaSeleccionada) } : null)
    clearCart()
    setPedidoEnviado(true)
  }

  function handleNuevoPedido() {
    setPedidoEnviado(false)
    setZonaEnviada('')
    setEntregaEnviada(null)
    setForm({ nombre: '', direccion: '', celular: '', zona: '', medio_pago: '', nota: '' })
  }

  if (pedidoEnviado) {
    return <PedidoEnviado zona={zonaEnviada} entrega={entregaEnviada} onNuevoPedido={handleNuevoPedido} />
  }

  if (cartList.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <span aria-hidden className="text-4xl">🧺</span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-charcoal">
          Tu carrito está vacío
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Sumá productos frescos del mercado para armar tu pedido.
        </p>
        <Link to="/productos" className="btn-primary mt-6 inline-flex">
          Ver productos
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-charcoal">Tu carrito</h1>

      {/* Lista de productos */}
      <div className="mt-6 divide-y divide-line rounded-card border border-line bg-white shadow-soft">
        {cartList.map(({ product, qty }) => {
          const unidadLabel = product.unidad_display || product.unit || 'u'
          const esPorKg = unidadLabel === 'kg'
          const qtyTxt  = esPorKg
            ? `${qty} kg`
            : (product.pesoVariable ? `${qty} ${unidadLabel}` : qty)
          return (
            <div key={product.id} className="flex flex-wrap items-center gap-x-4 gap-y-3 p-4">
              <img src={product.img} alt={product.name} className="h-16 w-16 shrink-0 rounded-lg object-cover" />
              <div className="min-w-0 flex-1">
                <p className="font-display font-semibold text-charcoal truncate">{product.name}</p>
                <p className="text-xs text-charcoal/50">
                  {esPorKg ? 'kg' : unidadLabel}
                  {product.pesoVariable && ' · precio estimado'}
                </p>
              </div>
              {/* Tacho: arriba a la derecha en mobile, al final de la fila en desktop */}
              <button
                onClick={() => setQty(product, 0)}
                className="order-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-charcoal/30 transition-colors hover:bg-crate/10 hover:text-crate sm:order-none sm:ml-1"
                aria-label="Eliminar producto"
                title="Eliminar del carrito"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                  <path d="M10 11v6M14 11v6"/>
                  <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
                </svg>
              </button>
              {/* Stepper + precio: fila completa propia en mobile, en línea en desktop */}
              <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-normal">
                <div className="flex items-center gap-2">
                  <button className="stepper-btn" onClick={() => cambiarQty(product, qty, -1)}>−</button>
                  <span className="w-10 text-center text-sm font-semibold">
                    {qtyTxt}
                  </span>
                  <button className="stepper-btn" onClick={() => cambiarQty(product, qty, 1)}>+</button>
                </div>
                <span className="tag-price text-right text-sm font-bold sm:w-24">
                  ${formatPrice(product.price * qty)}
                </span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Franja de confianza: reduce la duda de "y si llega mal" justo antes de pagar */}
      <div className="mt-3 flex items-center gap-2 rounded-full border border-leaf/20 bg-leaf/5 px-4 py-2 text-xs text-charcoal/70">
        <span aria-hidden>🛡️</span>
        <span>Garantía de frescura: si algo llega en mal estado, te lo reemplazamos o te lo descontamos del próximo pedido.</span>
      </div>

      {/* Recomendados: sumar algo más antes de cerrar (venta por impulso) */}
      {recomendados.length > 0 && (
        <div className="mt-2 -mx-4 sm:-mx-6">
          <ProductCarousel
            title="Sumá algo más a tu pedido"
            icon="🛒"
            products={recomendados}
          />
        </div>
      )}

      {/* Formulario */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold text-charcoal">Datos de entrega</h2>
        <p className="mt-1 text-sm text-charcoal/60">Completá los datos de quien va a recibir el pedido.</p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Nombre completo <span className="text-crate">*</span></label>
            <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Juan Pérez"
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${errors.nombre ? 'border-crate bg-crate/5' : 'border-line bg-white'}`} />
            {errors.nombre && <span className="text-xs text-crate">{errors.nombre}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Celular de quien recibe <span className="text-crate">*</span></label>
            <input name="celular" value={form.celular} onChange={handleChange} placeholder="381 4xx xxxx"
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${errors.celular ? 'border-crate bg-crate/5' : 'border-line bg-white'}`} />
            {errors.celular && <span className="text-xs text-crate">{errors.celular}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Zona de entrega <span className="text-crate">*</span></label>
            <select name="zona" value={form.zona} onChange={handleChange}
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${errors.zona ? 'border-crate bg-crate/5' : 'border-line bg-white'}`}>
              <option value="">Seleccioná tu zona...</option>
              {zonas.map((z) => (
                <option key={z.id} value={z.id} disabled={!z.disponible}>
                  {z.nombre}{z.disponible ? ` — $${formatPrice(z.costo)}` : ' (próximamente)'}
                </option>
              ))}
            </select>
            {errors.zona && <span className="text-xs text-crate">{errors.zona}</span>}
            {entrega && (
              <div className="rounded-lg border border-crate/30 bg-crate/5 px-4 py-3 flex flex-col gap-1">
                <p className="text-sm font-bold text-crate">
                  📅 Próxima entrega: {entrega.diaNombre} {entrega.diaNum} de {entrega.mes}
                  {horarioATexto(zonaSeleccionada) ? ` · ${horarioATexto(zonaSeleccionada)}` : ''}
                </p>
                <p className="text-xs text-charcoal/70">
                  ⏰ Los pedidos se toman hasta las {entrega.horaCorte} hs del {entrega.diaCierreNombre}.
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">Medio de pago <span className="text-crate">*</span></label>
            <select name="medio_pago" value={form.medio_pago} onChange={handleChange}
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${errors.medio_pago ? 'border-crate bg-crate/5' : 'border-line bg-white'}`}>
              <option value="">Seleccioná cómo pagás...</option>
              {MEDIOS_PAGO.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            {errors.medio_pago && <span className="text-xs text-crate">{errors.medio_pago}</span>}
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-medium text-charcoal">Dirección de entrega <span className="text-crate">*</span></label>
            <input name="direccion" value={form.direccion} onChange={handleChange} placeholder="Av. Alem 500, piso 3"
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${errors.direccion ? 'border-crate bg-crate/5' : 'border-line bg-white'}`} />
            {errors.direccion && <span className="text-xs text-crate">{errors.direccion}</span>}
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-medium text-charcoal">
              Nota para el repartidor <span className="font-normal text-charcoal/40">(opcional)</span>
            </label>
            <textarea name="nota" value={form.nota} onChange={handleChange}
              placeholder="Ej: dejar en portería, tocar timbre 2B, etc." rows={3}
              className="resize-none rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf" />
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="mt-6 rounded-card border border-line bg-creamDark p-4">
        <div className="flex justify-between text-sm text-charcoal/70">
          <span>Subtotal productos</span>
          <span>${formatPrice(totalPrice)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-charcoal/70">
          <span>Servicio de abastecimiento{zonaSeleccionada ? ` · ${zonaSeleccionada.nombre}` : ''}</span>
          <span>{costoServicio !== null ? `$${formatPrice(costoServicio)}` : '—'}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-line pt-3">
          <span className="font-semibold text-charcoal">Total estimado</span>
          <span className="tag-price text-xl font-bold">
            {totalEstimado !== null ? `$${formatPrice(totalEstimado)}` : '—'}
          </span>
        </div>
        {!zonaSeleccionada && (
          <p className="mt-2 text-xs text-mustard font-medium">
            Seleccioná tu zona para ver el total con el costo de envío.
          </p>
        )}
        <p className="mt-2 text-xs text-charcoal/50">
          El total informado es estimativo. El valor final se calculará según el peso real de los productos al momento de preparar el pedido.
        </p>
      </div>

      {/* Botón WhatsApp */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/productos" className="text-sm text-charcoal/60 hover:text-leaf">
          Seguir comprando
        </Link>
        <button onClick={enviarPorWhatsApp}
          className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90">
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar pedido por WhatsApp
        </button>
      </div>
    </div>
  )
}
