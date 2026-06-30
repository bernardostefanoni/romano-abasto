import React, { useMemo, useState } from 'react'
import { categories, products } from '../data/catalog.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Productos() {
  const [activeCat, setActiveCat] = useState(categories[0].id)
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = p.category === activeCat
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase())
      return matchesCat && (query ? matchesQuery : true)
    })
  }, [activeCat, query])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-4 text-xs text-charcoal/50">
        Inicio <span className="mx-1">›</span> <span className="font-medium text-charcoal">Productos</span>
      </nav>

      <div className="mb-6 flex items-center gap-3 rounded-full border border-line bg-white px-4 py-2.5 shadow-soft">
        <span aria-hidden>🔎</span>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscá frutas, verduras y más..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-charcoal/40"
        />
      </div>

      <div className="mb-8 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCat(c.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
              activeCat === c.id
                ? 'border-leaf bg-leaf text-cream'
                : 'border-line bg-white text-charcoal hover:border-leaf/50'
            }`}
          >
            <span className="mr-1.5">{c.icon}</span>
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <p className="rounded-card border border-dashed border-line p-10 text-center text-sm text-charcoal/60">
          No encontramos productos con ese nombre en esta categoría.
        </p>
      )}
    </div>
  )
}
