import React, { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(n) {
  return Number(n).toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
}

export default function ProductCard({ product }) {
  const { items, setQty } = useCart()
  const paso = product.paso || 1
  const currentQty = items[product.id]?.qty || 0
  const [localQty, setLocalQty] = useState(currentQty)

  function change(delta) {
    const next = Math.max(0, Math.round((localQty + delta) * 100) / 100)
    setLocalQty(next)
    setQty(product, next)
  }

  const esPorKg = paso === 0.5

  return (
    <div className="crate-card flex w-full shrink-0 snap-start flex-col overflow-hidden sm:w-auto relative">
      {product.featured && (
        <span className="absolute m-2 rounded-full bg-mustard px-2.5 py-1 text-[11px] font-semibold text-charcoal z-10">
          Destacado
        </span>
      )}
      <div className="aspect-square w-full overflow-hidden bg-creamDark">
        <img src={product.img} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <h3 className="font-display text-base font-semibold leading-snug text-charcoal">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-1">
          <span className="tag-price text-lg font-bold">${formatPrice(product.price)}</span>
          {esPorKg && (
            <span className="text-xs text-charcoal/50">/ kg</span>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button
              className="stepper-btn"
              onClick={() => change(-paso)}
              aria-label="Quitar"
            >−</button>
            <span className="w-10 text-center text-sm font-semibold">
              {localQty > 0
                ? esPorKg
                  ? `${localQty} kg`
                  : localQty
                : '0'}
            </span>
            <button
              className="stepper-btn"
              onClick={() => change(paso)}
              aria-label="Agregar"
            >+</button>
          </div>
          <button
            className="rounded-full bg-leaf px-3 py-2 text-xs font-semibold text-cream transition-colors hover:bg-leafLight"
            onClick={() => change(paso)}
          >
            {esPorKg ? `+ ${paso} kg` : 'Agregar'}
          </button>
        </div>

        {esPorKg && localQty > 0 && (
          <p className="text-xs text-charcoal/50 text-right">
            Subtotal: ${formatPrice(product.price * localQty)}
          </p>
        )}
      </div>
    </div>
  )
}
