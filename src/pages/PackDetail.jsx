import React, { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePacks } from '../hooks/usePacks.js'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(n) {
  return Number(n).toLocaleString('es-AR')
}

export default function PackDetail() {
  const { packId } = useParams()
  const { packs, loading } = usePacks()
  const { addPackToCart } = useCart()
  const [agregado, setAgregado] = useState(false)
  const pack = packs.find((p) => String(p.id) === String(packId))

  function handleAgregar() {
    addPackToCart(pack, 1)
    setAgregado(true)
    setTimeout(() => setAgregado(false), 2000)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6 text-sm text-charcoal/50">
        Cargando pack...
      </div>
    )
  }

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
        <Link to="/" className="hover:text-crate transition-colors">Inicio</Link>
        <span className="mx-1">›</span>
        <Link to="/packs" className="hover:text-crate transition-colors">Packs</Link>
        <span className="mx-1">›</span>
        <span className="font-medium text-charcoal">{pack.name}</span>
      </nav>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="aspect-[4/3] overflow-hidden rounded-card shadow-soft">
          <img src={pack.img} alt={pack.name} className="h-full w-full object-cover" />
        </div>

        <div>
          <h1 className="font-display text-3xl font-bold text-charcoal">{pack.name}</h1>
          <p className="tag-price mt-2 text-3xl font-bold">${formatPrice(pack.price)}</p>
          {pack.desc && <p className="mt-4 text-charcoal/75">{pack.desc}</p>}

          {pack.components.length > 0 && (
            <div className="mt-6">
              <h2 className="font-display text-lg font-semibold text-charcoal mb-3">
                ¿Qué incluye?
              </h2>
              <ul className="space-y-2">
                {pack.components.map((c, i) => (
                  <li key={i} className="flex items-center gap-2 rounded-lg bg-creamDark px-3 py-2 text-sm">
                    <span className="font-tag text-leaf font-bold">{c.cantidad}</span>
                    <span className="text-xs text-charcoal/50">{c.unidad}</span>
                    <span className="text-charcoal">{c.sku}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex flex-wrap gap-3">
            <button
              onClick={handleAgregar}
              className={`rounded-full px-6 py-3 text-sm font-semibold text-cream transition-all ${
                agregado ? 'bg-mustard' : 'bg-crate hover:bg-crateDark'
              }`}
            >
              {agregado ? '✓ Agregado al carrito' : 'Agregar al carrito'}
            </button>
            <Link to="/packs" className="btn-secondary">Ver otros packs</Link>
          </div>

          <div className="mt-8 space-y-1.5 rounded-card border border-line bg-creamDark/60 p-4 text-xs text-charcoal/60">
            <p>📦 Las cantidades pueden variar levemente según disponibilidad del Mercofrut.</p>
            <p>🛒 Podés modificar cantidades o quitar productos del pack al agregarlo al carrito.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
