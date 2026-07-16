// Helpers de días/horarios de entrega, compartidos por Hero, Carrito y Zonas.
// Los días se representan con la convención de JS Date.getDay() (0=Domingo).

export const NOMBRES_DIA = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
export const NOMBRES_MES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
  'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

const ORDEN_SEMANA = [1, 2, 3, 4, 5, 6, 0] // lunes a domingo, para que se lea natural

export function diasATexto(dias) {
  if (!dias || dias.length === 0) return ''
  return ORDEN_SEMANA.filter((d) => dias.includes(d)).map((d) => NOMBRES_DIA[d]).join(', ')
}

export function horarioATexto(zona) {
  if (!zona?.horarioDesde || !zona?.horarioHasta) return ''
  return `${zona.horarioDesde}–${zona.horarioHasta}`
}

function horaANumero(hhmm) {
  if (!hhmm) return 20 // 20:00 por defecto si no vino nada
  const [h, m] = hhmm.split(':').map(Number)
  return h + (m || 0) / 60
}

/**
 * Próxima fecha de entrega disponible para una zona, según sus días y su
 * hora de corte (pedidos hasta esa hora del día anterior a la entrega).
 * Devuelve null si la zona no tiene días cargados.
 */
export function calcularProximaEntrega(zona, ahora = new Date()) {
  if (!zona?.dias || zona.dias.length === 0) return null

  const horaCorteNum   = horaANumero(zona.horaCorte)
  const horaCorteEnt   = Math.floor(horaCorteNum)
  const minCorte       = Math.round((horaCorteNum - horaCorteEnt) * 60)
  const hoy            = ahora.getDay()

  for (let offset = 0; offset <= 7; offset++) {
    const diaEntrega = (hoy + offset) % 7
    if (!zona.dias.includes(diaEntrega)) continue

    const fechaEntrega = new Date(ahora)
    fechaEntrega.setDate(ahora.getDate() + offset)
    fechaEntrega.setHours(12, 0, 0, 0)

    const fechaCierre = new Date(fechaEntrega)
    fechaCierre.setDate(fechaEntrega.getDate() - 1)
    fechaCierre.setHours(horaCorteEnt, minCorte, 0, 0)

    if (ahora.getTime() >= fechaCierre.getTime()) continue

    return {
      diaNombre:       NOMBRES_DIA[diaEntrega],
      diaNum:          fechaEntrega.getDate(),
      mes:             NOMBRES_MES[fechaEntrega.getMonth()],
      diaCierreNombre: NOMBRES_DIA[fechaCierre.getDay()],
      horaCorte:       zona.horaCorte,
      fechaEntrega,
      fechaCierre,
    }
  }
  return null
}

/** La entrega más próxima entre todas las zonas disponibles (para la home). */
export function proximaEntregaGlobal(zonas, ahora = new Date()) {
  let mejor = null
  for (const z of zonas) {
    if (!z.disponible) continue
    const r = calcularProximaEntrega(z, ahora)
    if (r && (!mejor || r.fechaCierre < mejor.fechaCierre)) mejor = r
  }
  return mejor
}
