import React, { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(n) {
  return Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  // Si el producto tiene más de una variante (ej: "Pastafrola" x10cm/x16cm),
  // se muestra un selector y todo lo demás (precio, foto, stepper, carrito)
  // sigue a la variante elegida. Si no, se comporta como una card normal.
  const variantes = product.variants && product.variants.length > 1 ? product.variants : null
  const [activeIdx, setActiveIdx] = useState(0)
  const activo = variantes ? variantes[activeIdx] : product

  const paso    = activo.paso || 1

  // Etiqueta de unidad que muestra el sync (kg, atado, u, x30, etc.)
  const unidadLabel = activo.unidad_display || activo.unidad || ''
  const esPorKg = unidadLabel === 'kg'

  // Para bolsas cerradas (ej. "Papa bolsa 20kg"), mostramos el precio por kg
  // como referencia para comparar contra el producto suelto y la competencia.
  const kgMatch = unidadLabel === 'bolsa' ? activo.name.match(/(\d+(?:[.,]\d+)?)\s*kg/i) : null
  const precioPorKg = kgMatch ? activo.price / parseFloat(kgMatch[1].replace(',', '.')) : null

  // Texto de la cantidad en el stepper:
  //  - kg          -> "0.5 kg"
  //  - medio paso  -> "0.5 atado" / "0.5 u" (peso variable, atados, etc.)
  //  - entero      -> "1"
  function qtyTexto(q) {
    if (esPorKg) return `${q} kg`
    if (paso === 0.5) return `${q} ${unidadLabel || 'u'}`
    return q
  }

  const [qty, setQty]         = useState(paso)
  const [agregado, setAgregado] = useState(false)

  function seleccionarVariante(idx) {
    setActiveIdx(idx)
    setQty(variantes[idx].paso || 1)
  }

  function aumentar() {
    setQty((q) => Math.round((q + paso) * 100) / 100)
  }

  function disminuir() {
    setQty((q) => Math.max(paso, Math.round((q - paso) * 100) / 100))
  }

  function handleAgregar() {
    addToCart(activo, qty)
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
          src={activo.img}
          alt={product.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-charcoal">
          {product.name}
        </h3>

        {variantes && (
          <div className="flex flex-wrap gap-1.5">
            {variantes.map((v, idx) => (
              <button
                key={v.id}
                type="button"
                onClick={() => seleccionarVariante(idx)}
                className={`rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  idx === activeIdx
                    ? 'border-leaf bg-leaf text-cream'
                    : 'border-line bg-white text-charcoal hover:border-leaf/50'
                }`}
              >
                {v.variante || v.name}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-baseline gap-1">
          <span className="tag-price text-lg font-bold">${formatPrice(activo.price)}</span>
          {unidadLabel && <span className="text-xs text-charcoal/50">/ {unidadLabel}</span>}
        </div>
        {precioPorKg && (
          <p className="text-[11px] text-charcoal/50">${formatPrice(precioPorKg)}/kg</p>
        )}
        {activo.pesoVariable && (
          <p className="text-[11px] leading-tight text-mustard font-medium">
            Precio estimado · se ajusta al peso real
          </p>
        )}
        {!activo.pesoVariable && activo.pesoReferenciaKg && (
          <p className="text-[11px] leading-tight text-charcoal/50">
            Peso aproximado: ~{activo.pesoReferenciaKg} kg
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
            className={`w-full rounded-full px-3 py-2 text-xs font-semibold text-cream transition-colors sm:w-auto ${
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
