import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'

export default function ProductCarousel({ title, icon, products, viewAllTo }) {
  const trackRef = useRef(null)

  function scroll(dir) {
    trackRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' })
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-5 flex items-end justify-between">
        <h2 className="section-title flex items-center gap-2">
          <span aria-hidden>{icon}</span> {title}
        </h2>
        {viewAllTo && (
          <Link to={viewAllTo} className="btn-secondary !py-2 text-xs sm:text-sm">
            Ver todos →
          </Link>
        )}
      </div>

      <div className="relative">
        <button
          onClick={() => scroll(-1)}
          className="absolute -left-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-soft md:flex"
          aria-label="Anterior"
        >
          ‹
        </button>
        <div
          ref={trackRef}
          className="no-scrollbar grid grid-flow-col auto-cols-[220px] gap-4 overflow-x-auto scroll-smooth pb-2 sm:auto-cols-[240px]"
        >
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        <button
          onClick={() => scroll(1)}
          className="absolute -right-4 top-1/2 z-10 hidden h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-line bg-white shadow-soft md:flex"
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>
    </section>
  )
}
