import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

export function useZonas() {
  const [zonas, setZonas]     = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    async function fetchZonas() {
      try {
        const { data, error } = await supabase
          .from('zonas_web')
          .select('*')
          .order('orden')

        if (error) throw error

        const normalized = data.map((z) => ({
          id:           z.id,
          nombre:       z.nombre,
          costo:        Number(z.costo),
          dias:         (z.dias_entrega || '').split(',').filter((d) => d !== '').map(Number),
          horarioDesde: z.horario_desde,
          horarioHasta: z.horario_hasta,
          horaCorte:    z.hora_corte || '20:00',
          disponible:   z.disponible,
        }))

        setZonas(normalized)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchZonas()
  }, [])

  return { zonas, loading, error }
}
