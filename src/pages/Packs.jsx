import React from 'react'
import { packs } from '../data/catalog.js'
import PackCard from '../components/PackCard.jsx'

export default function Packs() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-charcoal">Packs de productos</h1>
      <p className="mt-2 max-w-xl text-sm text-charcoal/70">
        Combinaciones pensadas para no tener que elegir uno por uno. Sumalas a tu pedido con un clic
        y ajustá lo que necesites después.
      </p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {packs.map((p) => (
          <PackCard key={p.id} pack={p} />
        ))}
      </div>
    </div>
  )
}
