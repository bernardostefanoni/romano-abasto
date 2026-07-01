import React, { useState } from 'react'
import { deliveryZones } from '../data/catalog.js'

function formatPrice(n) {
  return Number(n).toLocaleString('es-AR')
}

export default function Zonas() {
  const [search, setSearch] = useState('')
  const [result, setResult] = useState(null)

  function checkZone(e) {
    e.preventDefault()
    const found = deliveryZones.find(
      (z) => z.disponible && z.zone.toLowerCase().includes(search.toLowerCase())
    )
    setResult(found || 'not-found')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span aria-hidden className="text-3xl">🛵</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-charcoal">
          ¿Llegamos a tu domicilio?
        </h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Verificá si hacemos entregas en tu zona de Tucumán.
        </p>
      </div>

      <form onSubmit={checkZone} className="mt-8 flex flex-col gap-3 sm:flex-row">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Escribí tu barrio o zona..."
          className="flex-1 rounded-full border border-line bg-white px-5 py-3 text-sm outline-none focus:border-leaf"
        />
        <button type="submit" className="btn-primary">Comprobar</button>
      </form>

      {result && result !== 'not-found' && (
        <div className="mt-5 rounded-card border border-leaf/30 bg-leaf/5 p-4 text-sm text-leaf">
          Llegamos a <strong>{result.zone}</strong> los días <strong>{result.days}</strong>,
          de <strong>{result.time}</strong>. Costo del servicio: <strong>${formatPrice(result.costo)}</strong>.
        </div>
      )}
      {result === 'not-found' && (
        <div className="mt-5 rounded-card border border-crate/30 bg-crate/5 p-4 text-sm text-crateDark">
          Todavía no llegamos a esa zona, pero estamos sumando barrios. Escribinos para avisarte cuando lleguemos.
        </div>
      )}

      <h2 className="mt-12 mb-4 font-display text-xl font-semibold text-charcoal">
        Zonas de entrega
      </h2>
      <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white shadow-soft">
        {deliveryZones.map((z) => (
          <div key={z.zone} className="flex items-center justify-between gap-3 px-5 py-4">
            <div className="flex items-center gap-3">
              <span aria-hidden className={z.disponible ? 'text-leaf' : 'text-charcoal/30'}>📍</span>
              <div>
                <p className={`text-sm font-medium ${z.disponible ? 'text-charcoal' : 'text-charcoal/40'}`}>
                  {z.zone}
                </p>
                {z.disponible ? (
                  <p className="text-xs text-charcoal/50">{z.days} · {z.time}</p>
                ) : (
                  <p className="text-xs text-charcoal/40">Próximamente</p>
                )}
              </div>
            </div>
            {z.disponible ? (
              <span className="text-sm font-semibold text-leaf">${formatPrice(z.costo)}</span>
            ) : (
              <span className="rounded-full bg-creamDark px-3 py-1 text-xs text-charcoal/40">Próximamente</span>
            )}
          </div>
        ))}
      </div>

      <p className="mt-4 text-xs text-charcoal/50 text-center">
        El costo indicado corresponde al servicio de abastecimiento programado por entrega.
      </p>
    </div>
  )
}
