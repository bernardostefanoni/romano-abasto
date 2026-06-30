import React from 'react'
import { Link } from 'react-router-dom'

function formatPrice(n) {
  return n.toLocaleString('es-AR')
}

export default function PackCard({ pack }) {
  return (
    <div className="crate-card flex flex-col overflow-hidden">
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-creamDark">
        <img src={pack.img} alt={pack.name} className="h-full w-full object-cover" loading="lazy" />
        <span className="absolute left-3 top-3 rounded-full bg-leaf px-2.5 py-1 text-[11px] font-semibold text-cream">
          Pack
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-2 p-5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-display text-lg font-semibold leading-snug">{pack.name}</h3>
          <span className="tag-price whitespace-nowrap text-lg font-bold">${formatPrice(pack.price)}</span>
        </div>
        <p className="text-sm text-charcoal/70">{pack.desc}</p>
        <span className="mt-1 text-xs font-medium text-leaf">📦 {pack.items} productos</span>
        <div className="mt-auto flex flex-col gap-2 pt-4">
          <Link to={`/packs/${pack.id}`} className="btn-primary w-full">
            Ver detalle
          </Link>
        </div>
      </div>
    </div>
  )
}
