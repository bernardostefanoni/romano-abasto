import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function usePacks() {
  const [packs, setPacks]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function fetchPacks() {
      try {
        const { data, error } = await supabase
          .from('packs_web')
          .select('*')
          .order('orden')

        if (error) throw error

        const normalized = data.map((p) => ({
          id:          p.id_pack_erp || p.id,
          name:        p.nombre,
          desc:        p.descripcion,
          price:       Number(p.precio),
          img:         p.imagen_url || 'https://images.unsplash.com/photo-1610348725531-843dff563e2c?q=80&w=800&auto=format&fit=crop',
          featured:    p.destacado,
          components:  Array.isArray(p.componentes) ? p.componentes : [],
          items:       Array.isArray(p.componentes) ? p.componentes.length : 0,
        }))

        setPacks(normalized)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchPacks()
  }, [])

  return { packs, loading, error }
}
