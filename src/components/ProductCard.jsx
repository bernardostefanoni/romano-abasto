import React, { useState } from 'react'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(n) {
  return n.toLocaleString('es-AR')
}

export default function ProductCard({ product }) {
  const { items, setQty } = useCart()
  const currentQty = items[product.id]?.qty || 0
  const [localQty, setLocalQty] = useState(currentQty)

  function change(delta) {
    const next = Math.max(0, localQty + delta)
    setLocalQty(next)
    setQty(product, next)
  }

  return (
    <div className="crate-card flex w-full shrink-0 snap-start flex-col overflow-hidden sm:w-auto">
      {product.featured && (
        <span className="absolute m-2 rounded-full bg-mustard px-2.5 py-1 text-[11px] font-semibold text-charcoal">
          Destacado
        </span>
      )}
      <div className="aspect-square w-full overflow-hidden bg-creamDark">
        <img src={product.img} alt={product.name} className="h-full w-full object-cover" loading="lazy" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-xs uppercase tracking-wide text-charcoal/50">{product.unit}</span>
        <h3 className="font-display text-base font-semibold leading-snug text-charcoal">{product.name}</h3>
        <span className="tag-price text-lg font-bold">${formatPrice(product.price)}</span>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <button className="stepper-btn" onClick={() => change(-1)} aria-label="Quitar unidad">−</button>
            <span className="w-6 text-center text-sm font-semibold">{localQty}</span>
            <button className="stepper-btn" onClick={() => change(1)} aria-label="Agregar unidad">+</button>
          </div>
          <button
            className="rounded-full bg-leaf px-3 py-2 text-xs font-semibold text-cream transition-colors hover:bg-leafLight"
            onClick={() => change(1)}
          >
            Agregar
          </button>
        </div>
      </div>
    </div>
  )
}
