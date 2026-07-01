import React from 'react'
import { Link } from 'react-router-dom'
import Hero from '../components/Hero.jsx'
import ProductCarousel from '../components/ProductCarousel.jsx'
import PackCard from '../components/PackCard.jsx'
import { packs, deliveryZones } from '../data/catalog.js'
import { useProducts } from '../hooks/useProducts.js'

export default function Home() {
  const { products, loading } = useProducts()
  const destacados = products.filter((p) => p.featured)
  const primeros = products.slice(0, 8)

  return (
    <>
      <Hero />

      {loading ? (
        <div className="mx-auto max-w-7xl px-4 py-16 text-center text-sm text-charcoal/50">
          Cargando productos...
        </div>
      ) : (
        <>
          <ProductCarousel
            title="Lo más pedido"
            icon="🔥"
            products={primeros}
            viewAllTo="/productos"
          />
          {destacados.length > 0 && (
            <ProductCarousel
              title="Productos destacados"
              icon="⭐"
              products={destacados}
              viewAllTo="/productos"
            />
          )}
        </>
      )}

      {/* Packs */}
      <section className="bg-creamDark py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6 flex items-end justify-between">
            <h2 className="section-title flex items-center gap-2">
              <span aria-hidden>📦</span> Nuestras selecciones
            </h2>
            <Link to="/packs" className="btn-secondary !py-2 text-xs sm:text-sm">
              Ver todos los packs →
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {packs.map((p) => (
              <PackCard key={p.id} pack={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Banner gastronómico */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center gap-6 rounded-card bg-sage/25 p-8 sm:flex-row sm:p-10">
          <div className="flex-1">
            <span className="rounded-full bg-leaf px-3 py-1 text-xs font-semibold text-cream">
              Para tu negocio
            </span>
            <h3 className="mt-3 font-display text-2xl font-semibold text-charcoal">
              Abastecé tu cocina con entregas recurrentes
            </h3>
            <p className="mt-2 max-w-md text-sm text-charcoal/70">
              Trabajamos con locales gastronómicos con pedidos programados, precios mayoristas y
              reparto fijo en motocarro.
            </p>
            <Link to="/packs" className="btn-primary mt-5 inline-flex">
              Ver pack gastronómico
            </Link>
          </div>
          <div className="aspect-square w-44 shrink-0 overflow-hidden rounded-card shadow-soft sm:w-56">
            <img
              src="https://images.unsplash.com/photo-1466637574441-749b8f19452f?q=80&w=600&auto=format&fit=crop"
              alt="Verduras frescas en canasto"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Zonas de entrega */}
      <section className="bg-mustard/15 py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <h2 className="section-title">¿Llegamos hasta tu casa?</h2>
          <p className="mt-2 text-sm text-charcoal/70">
            Repartimos en motocarro por zonas, dos veces por semana.
          </p>
          <div className="mt-8 divide-y divide-line overflow-hidden rounded-card border border-line bg-white text-left shadow-soft">
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
          <Link to="/zonas" className="btn-primary mt-8 inline-flex">
            Comprobá tu zona
          </Link>
        </div>
      </section>
    </>
  )
}
