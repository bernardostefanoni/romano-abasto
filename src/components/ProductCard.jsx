import React, { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(n) {
  return Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const paso    = product.paso || 1
  const esPorKg = paso === 0.5 && !product.pesoVariable  // 0.5 real de kg (no zapallo)

  // Etiqueta de unidad que muestra el sync (kg, atado, u, x30, etc.)
  const unidadLabel = product.unidad_display || product.unidad || ''

  // Texto de la cantidad en el stepper:
  //  - kg          -> "0.5 kg"
  //  - peso variable-> "0.5 u" (permite medio, pero se pide por unidad)
  //  - entero      -> "1"
  function qtyTexto(q) {
    if (esPorKg) return `${q} kg`
    if (product.pesoVariable) return `${q} ${unidadLabel || 'u'}`
    return q
  }

  const [qty, setQty]         = useState(paso)
  const [agregado, setAgregado] = useState(false)

  function aumentar() {
    setQty((q) => Math.round((q + paso) * 100) / 100)
  }

  function disminuir() {
    setQty((q) => Math.max(paso, Math.round((q - paso) * 100) / 100))
  }

  function handleAgregar() {
    addToCart(product, qty)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  return (
    <div className="crate-card flex w-full shrink-0 snap-start flex-col overflow-hidden sm:w-auto relative">
      {product.featured && (
        <span className="absolute m-2 rounded-full bg-mustard px-2.5 py-1 text-[11px] font-semibold text-charcoal z-10">
          Destacado
        </span>
      )}
      <div className="aspect-square w-full overflow-hidden bg-creamDark">
        <img
          src={product.img}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-charcoal">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="tag-price text-lg font-bold">${formatPrice(product.price)}</span>
          {unidadLabel && <span className="text-xs text-charcoal/50">/ {unidadLabel}</span>}
        </div>
        {product.pesoVariable && (
          <p className="text-[11px] leading-tight text-mustard font-medium">
            Precio estimado · se ajusta al peso real
          </p>
        )}

        {/* En mobile se apilan (stepper arriba, botón abajo). Desde sm van en fila. */}
        <div className="mt-auto flex flex-col gap-2 pt-2 sm:flex-row sm:items-center sm:justify-between">
          {/* Selector de cantidad */}
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <button
              className="stepper-btn"
              onClick={disminuir}
              aria-label="Quitar"
            >−</button>
            <span className="w-10 text-center text-sm font-semibold">
              {qtyTexto(qty)}
            </span>
            <button
              className="stepper-btn"
              onClick={aumentar}
              aria-label="Agregar"
            >+</button>
          </div>

          {/* Botón agregar al carrito */}
          <button
            onClick={handleAgregar}
            className={`w-full rounded-full px-3 py-2 text-xs font-semibold text-cream transition-all sm:w-auto ${
              agregado
                ? 'bg-mustard'
                : 'bg-leaf hover:bg-leafLight'
            }`}
          >
            {agregado ? '✓ Listo' : 'Agregar'}
          </button>
        </div>
      </div>
    </div>
  )
}
