import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

function normalizarCategoria(nombre) {
  if (!nombre) return 'otros'
  const n = nombre.toLowerCase()
  // "Bolsas y cajones" va primero: es una categoría de PRESENTACIÓN y puede
  // contener frutas/verduras en el nombre a futuro (ej: "Bolsas y cajones de
  // verdura"). Si se evaluara después, caería en 'frutas-verduras' por error.
  if (n.includes('bolsa') || n.includes('cajon') || n.includes('cajón')) return 'bolsas-cajones'
  if (n.includes('fruta') || n.includes('verdura')) return 'frutas-verduras'
  if (n.includes('huevo')) return 'huevos'
  if (n.includes('limpieza') || n.includes('lavandina') || n.includes('detergente')) return 'limpieza'
  if (n.includes('pan') || n.includes('pastel') || n.includes('pasteleria') || n.includes('panaderia')) return 'panaderia'
  if (n.includes('almacen') || n.includes('almacén')) return 'almacen'
  return n.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function useProducts() {
  const [products, setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('productos_web')
          .select('*')
          .eq('activo', true)
          .order('categoria')
          .order('nombre')

        if (error) throw error

        const normalized = data.map((p) => ({
          id:             p.id,
          name:           p.nombre,
          producto:       p.producto || p.nombre,
          variante:       p.variante || '',
          category:       normalizarCategoria(p.categoria),
          categoriaRaw:   p.categoria,
          unit:           p.unidad_display || p.unidad,
          precio_por:     p.unidad_display || p.unidad,
          unidad_display: p.unidad_display || p.unidad,
          price:          Number(p.precio),
          featured:       p.destacado,
          masPedido:      p.mas_pedido,
          pesoVariable:   p.peso_variable || false,
          pesoAproximadoKg: p.peso_aproximado_kg ? Number(p.peso_aproximado_kg) : null,
          paso:           Number(p.paso) || 1,
          img:            p.imagen_url || defaultImage(p.categoria),
        }))

        // Agrupar variantes del mismo producto dentro de la misma categoría
        // (ej: "Pastafrola x10cm" / "x16cm") en una sola card con selector.
        // Se agrupa por categoría además de por producto para no mezclar
        // casos como "Papa" suelta (Frutas y verduras) con "Papa bolsa 20kg"
        // (Bolsas y cajones) — son formas de compra distintas, no tamaños.
        const grupos = new Map()
        normalized.forEach((item) => {
          const key = `${item.categoriaRaw}::${item.producto}`
          if (!grupos.has(key)) grupos.set(key, [])
          grupos.get(key).push(item)
        })

        const agrupados = Array.from(grupos.values()).map((variantes) => {
          if (variantes.length === 1) return { ...variantes[0], variants: variantes }
          variantes.sort((a, b) => a.price - b.price)
          const principal = variantes.find((v) => v.featured) || variantes[0]
          return { ...principal, name: principal.producto, variants: variantes }
        })

        const catMap = {}
        data.forEach((p) => {
          const id = normalizarCategoria(p.categoria)
          if (!catMap[id]) {
            catMap[id] = { id, name: p.categoria, icon: catIcon(id) }
          }
        })

        setProducts(agrupados)
        setCategories(Object.values(catMap))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  return { products, categories, loading, error }
}

function catIcon(id) {
  const icons = {
    'frutas-verduras': '🥬', 'huevos': '🥚', 'limpieza': '🧼',
    'panaderia': '🥖', 'almacen': '🍪', 'pasteleria': '🧁',
    'panificados': '🥐', 'bolsas-cajones': '🧺', 'otros': '📦',
  }
  return icons[id] || '📦'
}

function defaultImage(categoria) {
  const imgs = {
    'Frutas y verduras': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=400&auto=format&fit=crop',
    'Huevos':            'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=400&auto=format&fit=crop',
    'Limpieza':          'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=400&auto=format&fit=crop',
    'Panificados':       'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop',
    'Pastelería':        'https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=400&auto=format&fit=crop',
  }
  return imgs[categoria] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop'
}
