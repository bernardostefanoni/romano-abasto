import React, { useState } from 'react'
import { deliveryZones } from '../data/catalog.js'

export default function Zonas() {
  const [search, setSearch] = useState('')
  const [result, setResult] = useState(null)

  function checkZone(e) {
    e.preventDefault()
    const found = deliveryZones.find((z) =>
      z.zone.toLowerCase().includes(search.toLowerCase())
    )
    setResult(found || 'not-found')
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="text-center">
        <span aria-hidden className="text-3xl">🛵</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-charcoal">¿Llegamos a tu domicilio?</h1>
        <p className="mt-2 text-sm text-charcoal/70">Verificá si hacemos entregas en tu zona de Tucumán.</p>
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
          ✅ Llegamos a <strong>{result.zone}</strong> los días <strong>{result.day}</strong>, en el horario {result.time}.
        </div>
      )}
      {result === 'not-found' && (
        <div className="mt-5 rounded-card border border-crate/30 bg-crate/5 p-4 text-sm text-crateDark">
          Todavía no llegamos a esa zona, pero estamos sumando barrios cada mes. Escribinos para avisarte.
        </div>
      )}

      <h2 className="mt-12 mb-4 font-display text-xl font-semibold text-charcoal">Próximas entregas programadas</h2>
      <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white shadow-soft">
        {deliveryZones.map((z) => (
          <div key={z.zone} className="flex items-center justify-between gap-3 px-5 py-3.5">
            <span className="flex items-center gap-2 text-sm font-medium text-charcoal">
              <span aria-hidden>📍</span> {z.zone}
            </span>
            <span className="text-sm text-charcoal/60">
              {z.day} · <span className="font-semibold text-leaf">{z.time}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
