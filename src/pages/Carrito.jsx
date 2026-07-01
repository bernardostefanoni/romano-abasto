import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const WHATSAPP_NUMBER = '5493814571329'
const COSTO_SERVICIO  = 3500

function formatPrice(n) {
  return Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export default function Carrito() {
  const { cartList, setQty, totalPrice } = useCart()

  const [form, setForm] = useState({
    nombre:    '',
    direccion: '',
    celular:   '',
    nota:      '',
  })
  const [errors, setErrors] = useState({})

  const totalEstimado = totalPrice + COSTO_SERVICIO

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }))
  }

  function validar() {
    const e = {}
    if (!form.nombre.trim())    e.nombre    = 'Ingresa tu nombre'
    if (!form.direccion.trim()) e.direccion = 'Ingresa la direccion de entrega'
    if (!form.celular.trim())   e.celular   = 'Ingresa el celular de quien recibe'
    return e
  }

  function cambiarQty(product, qty, delta) {
    const paso = product.paso || 1
    const next = Math.max(0, Math.round((qty + delta * paso) * 100) / 100)
    setQty(product, next)
  }

  function enviarPorWhatsApp() {
    const errs = validar()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    const lineas = cartList.map(
      ({ product, qty }) =>
        `- ${product.name} x${qty} --- $${formatPrice(product.price * qty)}`
    )

    const partes = [
      'NUEVO PEDIDO - Romano Abasto',
      '--------------------------------',
      ...lineas,
      '--------------------------------',
      `Servicio de abastecimiento: $${formatPrice(COSTO_SERVICIO)}`,
      `*TOTAL ESTIMADO: $${formatPrice(totalEstimado)}*`,
      '',
      'El total informado es estimativo. El valor final se calculara segun el peso real de los productos al momento de preparar el pedido.',
      '',
      'DATOS DE ENTREGA',
      `Nombre: ${form.nombre}`,
      `Direccion: ${form.direccion}`,
      `Celular: ${form.celular}`,
    ]

    if (form.nota.trim()) {
      partes.push(`Nota: ${form.nota}`)
    }

    const mensaje = partes.join('\n')
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`
    window.open(url, '_blank')
  }

  if (cartList.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <span aria-hidden className="text-4xl">🧺</span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-charcoal">
          Tu carrito esta vacio
        </h1>
        <p className="mt-2 text-sm text-charcoal/60">
          Suma productos frescos del mercado para armar tu pedido.
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
          const paso = product.paso || 1
          const esPorKg = paso === 0.5
          return (
            <div key={product.id} className="flex items-center gap-4 p-4">
              <img
                src={product.img}
                alt={product.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="font-display font-semibold text-charcoal">{product.name}</p>
                <p className="text-xs text-charcoal/50">
                  {esPorKg ? 'kg' : product.unit}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="stepper-btn"
                  onClick={() => cambiarQty(product, qty, -1)}
                >−</button>
                <span className="w-10 text-center text-sm font-semibold">
                  {esPorKg ? `${qty} kg` : qty}
                </span>
                <button
                  className="stepper-btn"
                  onClick={() => cambiarQty(product, qty, 1)}
                >+</button>
              </div>
              <span className="tag-price w-28 text-right text-sm font-bold">
                ${formatPrice(product.price * qty)}
              </span>
            </div>
          )
        })}
      </div>

      {/* Resumen de precios */}
      <div className="mt-4 rounded-card border border-line bg-creamDark p-4">
        <div className="flex justify-between text-sm text-charcoal/70">
          <span>Subtotal productos</span>
          <span>${formatPrice(totalPrice)}</span>
        </div>
        <div className="mt-1 flex justify-between text-sm text-charcoal/70">
          <span>Servicio de abastecimiento</span>
          <span>${formatPrice(COSTO_SERVICIO)}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-line pt-3">
          <span className="font-semibold text-charcoal">Total estimado</span>
          <span className="tag-price text-xl font-bold">${formatPrice(totalEstimado)}</span>
        </div>
        <p className="mt-2 text-xs text-charcoal/50">
          El total informado es estimativo. El valor final se calculara segun el peso real
          de los productos al momento de preparar el pedido.
        </p>
      </div>

      {/* Formulario de datos de entrega */}
      <div className="mt-8">
        <h2 className="font-display text-xl font-semibold text-charcoal">Datos de entrega</h2>
        <p className="mt-1 text-sm text-charcoal/60">
          Completa los datos de quien va a recibir el pedido.
        </p>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">
              Nombre completo <span className="text-crate">*</span>
            </label>
            <input
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Juan Perez"
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${
                errors.nombre ? 'border-crate bg-crate/5' : 'border-line bg-white'
              }`}
            />
            {errors.nombre && <span className="text-xs text-crate">{errors.nombre}</span>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-charcoal">
              Celular de quien recibe <span className="text-crate">*</span>
            </label>
            <input
              name="celular"
              value={form.celular}
              onChange={handleChange}
              placeholder="381 4xx xxxx"
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${
                errors.celular ? 'border-crate bg-crate/5' : 'border-line bg-white'
              }`}
            />
            {errors.celular && <span className="text-xs text-crate">{errors.celular}</span>}
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-medium text-charcoal">
              Direccion de entrega <span className="text-crate">*</span>
            </label>
            <input
              name="direccion"
              value={form.direccion}
              onChange={handleChange}
              placeholder="Av. Alem 500, Barrio Norte"
              className={`rounded-xl border px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf ${
                errors.direccion ? 'border-crate bg-crate/5' : 'border-line bg-white'
              }`}
            />
            {errors.direccion && <span className="text-xs text-crate">{errors.direccion}</span>}
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <label className="text-sm font-medium text-charcoal">
              Nota para el repartidor{' '}
              <span className="font-normal text-charcoal/40">(opcional)</span>
            </label>
            <textarea
              name="nota"
              value={form.nota}
              onChange={handleChange}
              placeholder="Ej: dejar en porteria, tocar timbre 2B, etc."
              rows={3}
              className="resize-none rounded-xl border border-line bg-white px-4 py-2.5 text-sm outline-none transition-colors focus:border-leaf"
            />
          </div>
        </div>
      </div>

      {/* Botón WhatsApp */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link to="/productos" className="text-sm text-charcoal/60 hover:text-leaf">
          Seguir comprando
        </Link>
        <button
          onClick={enviarPorWhatsApp}
          className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-3 text-sm font-semibold text-white shadow-soft transition-opacity hover:opacity-90"
        >
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Enviar pedido por WhatsApp
        </button>
      </div>
    </div>
  )
}
