import React from 'react'
import { Link } from 'react-router-dom'
import RouteMark from '../components/RouteMark.jsx'

export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-leaf">
      <div className="absolute inset-0 opacity-15">
        <img
          src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop"
          alt=""
          className="h-full w-full object-cover"
        />
      </div>
      <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-2 md:items-center">
        <div>
          <span className="inline-block rounded-full bg-mustard px-3 py-1 text-xs font-semibold text-charcoal">
            Reparto en motocarro · San Miguel de Tucumán
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-cream sm:text-5xl">
            Del Mercofrut a tu hogar
          </h1>
          <p className="mt-4 max-w-md text-cream/85">
            Compramos fresco cada mañana en el mercado mayorista y lo llevamos directo a tu puerta:
            frutas, verduras, huevos, productos de limpieza y panadería.
          </p>
          <RouteMark className="mt-6 h-10 w-full max-w-sm" />
          <div className="mt-7 flex flex-wrap gap-3">
            <Link to="/productos" className="btn-primary">Ver productos</Link>
            <Link to="/zonas" className="rounded-full border-2 border-cream px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-leaf">
              Consultar mi zona
            </Link>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="aspect-[4/3] overflow-hidden rounded-card border-4 border-cream/20 shadow-soft">
            <img
              src="https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=900&auto=format&fit=crop"
              alt="Cajón de verduras frescas"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-6 -left-6 rounded-card bg-cream px-5 py-4 shadow-soft">
            <p className="font-tag text-xs text-charcoal/60">Próxima entrega</p>
            <p className="font-display text-lg font-semibold text-leaf">Mañana, 08:00–12:00</p>
          </div>
        </div>
      </div>
    </section>
  )
}
