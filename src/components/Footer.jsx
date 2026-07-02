import React from 'react'
import { Link } from 'react-router-dom'
import RouteMark from './RouteMark.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-line bg-creamDark">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <RouteMark className="mb-8 h-10 w-full max-w-xs" />
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <span className="font-display text-lg font-semibold text-charcoal">
              Romano <span className="text-crate">Abasto</span>
            </span>
            <p className="mt-3 text-sm text-charcoal/70">
              Del Mercofrut a tu hogar. Frutas, verduras y abastecimiento fresco con reparto en motocarro.
            </p>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-leaf">Explorar</h4>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li><Link to="/productos" className="hover:text-crate">Productos</Link></li>
              <li><Link to="/packs" className="hover:text-crate">Packs</Link></li>
              <li><Link to="/zonas" className="hover:text-crate">Zonas de entrega</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-leaf">Empresa</h4>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li><Link to="/sobre-nosotros" className="hover:text-crate">Nosotros</Link></li>
              <li><Link to="/sobre-nosotros" className="hover:text-crate">Para tu negocio</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-sm font-semibold text-leaf">Contacto</h4>
            <ul className="space-y-2 text-sm text-charcoal/70">
              <li>San Miguel de Tucumán</li>
              <li>Lun a sáb, 8 a 20 hs</li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  )
}
