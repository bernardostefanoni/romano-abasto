import React from 'react'
import RouteMark from '../components/RouteMark.jsx'

export default function SobreNosotros() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-charcoal">Cómo trabajamos</h1>
      <RouteMark className="my-6 h-10 w-full max-w-sm" />
      <p className="text-charcoal/75">
        Cada mañana recorremos el mercado mayorista para elegir fruta y verdura fresca, huevos,
        productos de limpieza y panadería del día. Armamos los pedidos y los repartimos en motocarro
        por zonas fijas, dos veces por semana.
      </p>
      <p className="mt-4 text-charcoal/75">
        También trabajamos con locales gastronómicos que necesitan abastecimiento recurrente, con
        precios mayoristas y entregas programadas.
      </p>
    </div>
  )
}
