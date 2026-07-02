import React from 'react'
import RouteMark from '../components/RouteMark.jsx'

export default function SobreNosotros() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-charcoal">Cómo trabajamos</h1>
      <RouteMark className="my-6 h-10 w-full max-w-sm" />
      <p className="text-charcoal/75">
        Juntamos los pedidos hasta las 20hs del día anterior a la entrega, compramos en el Mercofrut
        y llevamos fruta, verdura fresca, huevos, productos de limpieza y panadería directo a tu
        puerta en motocarro.
      </p>
      <p className="mt-4 text-charcoal/75">
        También trabajamos con locales gastronómicos que necesitan abastecimiento recurrente, con
        precios mayoristas y entregas programadas.
      </p>

      <div className="mt-8 rounded-card border border-leaf/20 bg-leaf/5 p-5">
        <h2 className="font-display text-lg font-semibold text-leaf flex items-center gap-2">
          <span>🛡️</span> Garantía de frescura
        </h2>
        <p className="mt-2 text-sm text-charcoal/75">
          Si recibís un producto en mal estado o que no cumple con la calidad esperada, te lo
          reemplazamos en la próxima entrega o te descontamos del siguiente pedido. Solo mandanos
          una foto por WhatsApp y lo resolvemos.
        </p>
      </div>
    </div>
  )
}
