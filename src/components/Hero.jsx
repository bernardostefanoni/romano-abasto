import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RouteMark from './RouteMark.jsx'

const DIAS_ENTREGA = [2, 4, 5] // Martes, Jueves, Viernes
const NOMBRES_DIA  = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado']
const NOMBRES_MES  = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
const HORA_CORTE   = 20 // Pedidos hasta las 20hs del día anterior

function calcularEstado() {
  const ahora   = new Date()
  const hoy     = ahora.getDay()
  const horaAct = ahora.getHours() + ahora.getMinutes() / 60

  for (let offset = 0; offset <= 7; offset++) {
    const diaEntrega = (hoy + offset) % 7
    if (!DIAS_ENTREGA.includes(diaEntrega)) continue

    const fechaEntrega = new Date(ahora)
    fechaEntrega.setDate(ahora.getDate() + offset)
    fechaEntrega.setHours(12, 0, 0, 0)

    // Cierre de pedidos: día anterior a las 20hs
    const fechaCierre = new Date(fechaEntrega)
    fechaCierre.setDate(fechaEntrega.getDate() - 1)
    fechaCierre.setHours(HORA_CORTE, 0, 0, 0)

    const ahoraMs  = ahora.getTime()
    const cierreMs = fechaCierre.getTime()

    // Si el cierre ya pasó, buscar el siguiente día de entrega
    if (ahoraMs >= cierreMs) continue

    return {
      diaNombre:   NOMBRES_DIA[diaEntrega],
      diaNum:      fechaEntrega.getDate(),
      mes:         NOMBRES_MES[fechaEntrega.getMonth()],
      fechaCierre,
      abierto:     true,
    }
  }
  return null
}

function formatCountdown(ms) {
  if (ms <= 0) return null
  const totalSeg = Math.floor(ms / 1000)
  const horas    = Math.floor(totalSeg / 3600)
  const minutos  = Math.floor((totalSeg % 3600) / 60)
  const segundos = totalSeg % 60
  return {
    horas:    String(horas).padStart(2, '0'),
    minutos:  String(minutos).padStart(2, '0'),
    segundos: String(segundos).padStart(2, '0'),
  }
}

function CountdownBox({ value, label }) {
  return (
    <div className="flex flex-col items-center rounded-lg bg-crate px-2.5 py-1 min-w-[36px]">
      <span className="font-tag text-lg font-bold text-cream leading-none">{value}</span>
      <span className="font-tag text-[9px] text-cream/80">{label}</span>
    </div>
  )
}

export default function Hero() {
  const [estado, setEstado]     = useState(null)
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    function actualizar() {
      const e = calcularEstado()
      setEstado(e)
      if (!e) { setCountdown(null); return }
      const resta = e.fechaCierre - new Date()
      setCountdown(formatCountdown(resta))
    }
    actualizar()
    const interval = setInterval(actualizar, 1000)
    return () => clearInterval(interval)
  }, [])

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
            Reparto en motocarro · Tucumán
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-cream sm:text-5xl">
            Del Mercofrut a tu hogar
          </h1>
          <p className="mt-4 max-w-md text-cream/85">
            Compramos en el Mercofrut y lo llevamos directo a tu puerta:
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

          <div className="absolute -bottom-6 -left-6 rounded-card bg-cream px-5 py-4 shadow-soft min-w-[240px]">
            {estado && countdown ? (
              <>
                <p className="font-tag text-xs text-crate font-semibold uppercase tracking-wide">
                  Pedidos abiertos
                </p>
                <p className="mt-0.5 font-display text-base font-semibold text-charcoal">
                  Entrega el {estado.diaNombre} {estado.diaNum} de {estado.mes}
                </p>
                <p className="font-tag text-xs text-charcoal/50 mb-2">
                  Cierre de pedidos a las {HORA_CORTE}:00 hs
                </p>
                <div className="flex items-center gap-1">
                  <CountdownBox value={countdown.horas}    label="hs" />
                  <span className="font-bold text-crate text-xl">:</span>
                  <CountdownBox value={countdown.minutos}  label="min" />
                  <span className="font-bold text-crate text-xl">:</span>
                  <CountdownBox value={countdown.segundos} label="seg" />
                </div>
              </>
            ) : (
              <>
                <p className="font-tag text-xs text-charcoal/50 uppercase tracking-wide">
                  Pedidos cerrados
                </p>
                <p className="mt-1 font-display text-base font-semibold text-leaf">
                  Próxima entrega disponible
                </p>
                <p className="font-tag text-xs text-charcoal/60 mt-0.5">
                  Martes, Jueves y Viernes · 12:00–18:00
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
