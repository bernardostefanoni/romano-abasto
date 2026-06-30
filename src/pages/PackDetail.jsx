import React from 'react'
import { Link, useParams } from 'react-router-dom'
import { packs } from '../data/catalog.js'

function formatPrice(n) {
  return n.toLocaleString('es-AR')
}

export default function PackDetail() {
  const { packId } = useParams()
  const pack = packs.find((p) => p.id === packId)

  if (!pack) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-semibold">No encontramos este pack</h1>
        <Link to="/packs" className="btn-primary mt-6 inline-flex">Volver a packs</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
      <nav className="mb-6 text-xs text-charcoal/50">
        Inicio <span className="mx-1">›</span> Packs <span className="mx-1">›</span>
        <span className="font-medium text-charcoal">{pack.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-card shadow-soft">
          <img src={pack.img} alt={pack.name} className="h-full w-full object-cover" />
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">{pack.name}</h1>
          <p className="tag-price mt-2 text-3xl font-bold">${formatPrice(pack.price)}</p>
          <p className="mt-4 text-charcoal/75">{pack.desc}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {pack.bullets.map((b) => (
              <span key={b} className="rounded-full bg-sage/25 px-3 py-1.5 text-sm font-medium text-leaf">
                {b}
              </span>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button className="btn-primary">Agregar al carrito</button>
            <Link to="/packs" className="btn-secondary">Ver otros packs</Link>
          </div>

          <div className="mt-8 space-y-1.5 rounded-card border border-line bg-creamDark/60 p-4 text-xs text-charcoal/60">
            <p>📦 Incluye {pack.items} productos. Las cantidades pueden variar según disponibilidad del Mercofrut.</p>
            <p>🛒 Una vez agregado, podés modificar cantidades o quitar productos del pack de forma individual.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
