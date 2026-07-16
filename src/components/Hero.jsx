import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import RouteMark from './RouteMark.jsx'
import { useZonas } from '../hooks/useZonas.js'
import { proximaEntregaGlobal } from '../lib/entrega.js'

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
  const { zonas, loading: loadingZonas } = useZonas()
  const [estado, setEstado]     = useState(null)
  const [countdown, setCountdown] = useState(null)

  useEffect(() => {
    if (loadingZonas) return
    function actualizar() {
      const e = proximaEntregaGlobal(zonas)
      setEstado(e)
      if (!e) { setCountdown(null); return }
      const resta = e.fechaCierre - new Date()
      setCountdown(formatCountdown(resta))
    }
    actualizar()
    const interval = setInterval(actualizar, 1000)
    return () => clearInterval(interval)
  }, [zonas, loadingZonas])

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

          {/* Card de entrega — solo mobile */}
          {!loadingZonas && estado && countdown && (
            <div className="mt-5 rounded-card bg-cream px-4 py-3 shadow-soft md:hidden">
              <p className="font-tag text-xs text-crate font-semibold uppercase tracking-wide">
                Pedidos abiertos
              </p>
              <p className="mt-0.5 font-display text-sm font-semibold text-charcoal">
                Entrega el {estado.diaNombre} {estado.diaNum} de {estado.mes}
              </p>
              <p className="font-tag text-xs text-charcoal/50 mb-2">
                Cierre de pedidos el {estado.diaCierreNombre} a las {estado.horaCorte} hs
              </p>
              <div className="flex items-center gap-1">
                <CountdownBox value={countdown.horas}    label="hs" />
                <span className="font-bold text-crate text-xl">:</span>
                <CountdownBox value={countdown.minutos}  label="min" />
                <span className="font-bold text-crate text-xl">:</span>
                <CountdownBox value={countdown.segundos} label="seg" />
              </div>
            </div>
          )}

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

          {!loadingZonas && (
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
                    Cierre de pedidos el {estado.diaCierreNombre} a las {estado.horaCorte} hs
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
                    Próxima entrega disponible pronto
                  </p>
                  <p className="font-tag text-xs text-charcoal/60 mt-0.5">
                    Consultá tu zona para ver días y horarios
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
