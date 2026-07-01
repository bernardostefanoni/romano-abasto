import React, { useMemo, useState } from 'react'
import { useProducts } from '../hooks/useProducts.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Productos() {
  const { products, categories, loading, error } = useProducts()
  const [activeCat, setActiveCat] = useState(null)
  const [query, setQuery] = useState('')

  // Seleccionar primera categoría cuando carguen los datos
  const catActiva = activeCat || categories[0]?.id

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesCat = !catActiva || p.category === catActiva
      const matchesQuery = p.name.toLowerCase().includes(query.toLowerCase())
      return matchesCat && (query ? matchesQuery : true)
    })
  }, [products, catActiva, query])

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <nav className="mb-4 text-xs text-charcoal/50">
        Inicio <span className="mx-1">›</span>
        <span className="font-medium text-charcoal">Productos</span>
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

      {loading ? (
        <div className="flex items-center justify-center py-20 text-sm text-charcoal/50">
          Cargando productos...
        </div>
      ) : error ? (
        <div className="rounded-card border border-crate/30 bg-crate/5 p-6 text-sm text-crateDark">
          No se pudieron cargar los productos. Intentá de nuevo más tarde.
        </div>
      ) : (
        <>
          <div className="mb-8 flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveCat(c.id)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                  catActiva === c.id
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
        </>
      )}
    </div>
  )
}
