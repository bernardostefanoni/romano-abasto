import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(n) {
  return Number(n).toLocaleString('es-AR')
}

export default function PackCard({ pack }) {
  const [expanded, setExpanded] = useState(false)
  const [agregado, setAgregado] = useState(false)
  const { addPackToCart } = useCart()
  const components = pack.components || []

  function handleAgregar() {
    addPackToCart(pack, 1)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 1500)
  }

  return (
    <div className="crate-card flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-creamDark">
        <img
          src={pack.img}
          alt={pack.name}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <span className="absolute left-3 top-3 rounded-full bg-leaf px-2.5 py-1 text-[11px] font-semibold text-cream">
          Pack
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug">{pack.name}</h3>
          <span className="tag-price whitespace-nowrap text-lg font-bold">
            ${formatPrice(pack.price)}
          </span>
        </div>
        {pack.desc && (
          <p className="text-sm text-charcoal/70 line-clamp-2">{pack.desc}</p>
        )}

        {components.length > 0 && (
          <div className="mt-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1.5 text-xs font-medium text-leaf hover:text-leafLight transition-colors"
            >
              <span className={`inline-block transition-transform ${expanded ? 'rotate-180' : ''}`}>▼</span>
              {expanded ? 'Ocultar' : `Ver ${components.length} productos`}
            </button>

            <div className={`pack-reveal ${expanded ? 'is-open' : ''}`}>
              <div>
                <ul className="mt-3 space-y-1.5 rounded-lg bg-creamDark/50 p-3 max-h-56 overflow-y-auto">
                  {components.map((c, i) => (
                    <li key={i} className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-baseline gap-1.5 min-w-0">
                        <span className="font-tag font-bold text-leaf shrink-0">
                          {c.cantidad}
                        </span>
                        <span className="text-[10px] text-charcoal/40 shrink-0">
                          {c.unidad}
                        </span>
                        <span className="text-charcoal truncate">{c.sku}</span>
                      </div>
                      {c.precio_unit > 0 && (
                        <span className="tag-price text-xs whitespace-nowrap">
                          ${formatPrice(Math.round(c.precio_unit * c.cantidad))}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="mt-auto flex items-center gap-2 pt-2">
          <button
            onClick={handleAgregar}
            className={`flex-1 rounded-full px-4 py-2.5 text-sm font-semibold text-cream transition-colors ${
              agregado ? 'bg-mustard' : 'bg-leaf hover:bg-leafLight'
            }`}
          >
            {agregado ? '✓ Agregado' : 'Agregar al carrito'}
          </button>
          <Link to={`/packs/${pack.id}`} className="btn-secondary shrink-0 px-4 py-2.5">
            Detalle
          </Link>
        </div>
      </div>
    </div>
  )
}
