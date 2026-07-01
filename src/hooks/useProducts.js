import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

// Convierte el nombre de categoría del ERP a un id normalizado para la web
function normalizarCategoria(nombre) {
  if (!nombre) return 'otros'
  const n = nombre.toLowerCase()
  if (n.includes('fruta') || n.includes('verdura')) return 'frutas-verduras'
  if (n.includes('huevo')) return 'huevos'
  if (n.includes('limpieza') || n.includes('lavandina') || n.includes('detergente')) return 'limpieza'
  if (n.includes('pan') || n.includes('pastel') || n.includes('pasteleria') || n.includes('panaderia')) return 'panaderia'
  if (n.includes('almacen') || n.includes('almacén')) return 'almacen'
  return n.replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export function useProducts() {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

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

        // Normalizar productos para que sean compatibles con los componentes existentes
        const normalized = data.map((p, i) => ({
          id:       p.id,
          name:     p.nombre,
          category: normalizarCategoria(p.categoria),
          unit:     p.unidad,
          price:    Number(p.precio),
          featured: p.destacado,
          img:      p.imagen_url || defaultImage(p.categoria),
        }))

        // Armar categorías dinámicas desde los datos reales
        const catMap = {}
        data.forEach((p) => {
          const id = normalizarCategoria(p.categoria)
          if (!catMap[id]) {
            catMap[id] = {
              id,
              name: p.categoria,
              icon: catIcon(id),
            }
          }
        })

        setProducts(normalized)
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
    'frutas-verduras': '🥬',
    'huevos':          '🥚',
    'limpieza':        '🧼',
    'panaderia':       '🥖',
    'almacen':         '🍪',
    'pasteleria':      '🧁',
    'panificados':     '🥐',
    'otros':           '📦',
  }
  return icons[id] || '📦'
}

function defaultImage(categoria) {
  // Imágenes genéricas por categoría cuando no hay imagen cargada
  const imgs = {
    'Frutas y verduras': 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=400&auto=format&fit=crop',
    'Huevos':            'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?q=80&w=400&auto=format&fit=crop',
    'Limpieza':          'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?q=80&w=400&auto=format&fit=crop',
    'Panificados':       'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=400&auto=format&fit=crop',
    'Pastelería':        'https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=400&auto=format&fit=crop',
  }
  return imgs[categoria] || 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&auto=format&fit=crop'
}
