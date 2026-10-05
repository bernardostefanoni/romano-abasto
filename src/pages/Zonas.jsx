import React from 'react'
import { useZonas } from '../hooks/useZonas.js'
import { diasATexto, horarioATexto } from '../lib/entrega.js'

function formatPrice(n) {
  return Number(n).toLocaleString('es-AR')
}

export default function Zonas() {
  const { zonas, loading } = useZonas()

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
      <div className="rounded-card border border-leaf/20 bg-leaf/5 px-5 py-4 text-center">
        <p className="text-sm text-leaf font-medium">
          🌱 A medida que crezca la demanda, vamos a sumar más días, horarios y zonas de entrega.
        </p>
      </div>

      <div className="text-center mt-8">
        <span aria-hidden className="text-3xl">🛵</span>
        <h1 className="mt-3 font-display text-3xl font-bold text-charcoal">
          ¿Llegamos a tu domicilio?
        </h1>
        <p className="mt-2 text-sm text-charcoal/70">
          Si tu dirección está dentro de alguna de estas zonas, te llevamos el pedido hasta la puerta de tu casa.
        </p>
      </div>

      <h2 className="mt-10 mb-4 font-display text-xl font-semibold text-charcoal">
        Zonas de entrega
      </h2>
      {loading ? (
        <p className="text-center text-sm text-charcoal/50">Cargando zonas...</p>
      ) : (
        <div className="divide-y divide-line overflow-hidden rounded-card border border-line bg-white shadow-soft">
          {zonas.map((z) => (
            <div key={z.id} className="flex items-center justify-between gap-3 px-5 py-4">
              <div className="flex items-center gap-3">
                <span aria-hidden className={z.disponible ? 'text-leaf' : 'text-charcoal/30'}>📍</span>
                <div>
                  <p className={`text-sm font-medium ${z.disponible ? 'text-charcoal' : 'text-charcoal/40'}`}>
                    {z.nombre}
                  </p>
                  {z.disponible ? (
                    <p className="text-xs text-charcoal/50">{diasATexto(z.dias)} · {horarioATexto(z)}</p>
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
      )}

      <p className="mt-4 text-xs text-charcoal/50 text-center">
        El costo indicado corresponde al servicio de abastecimiento programado por entrega.
      </p>

    </div>
  )
}
