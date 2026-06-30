import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

const navLinks = [
  { to: '/productos', label: 'Productos' },
  { to: '/packs', label: 'Packs' },
  { to: '/zonas', label: 'Zonas de entrega' },
  { to: '/sobre-nosotros', label: 'Nosotros' },
]

export default function Header() {
  const [open, setOpen] = useState(false)
  const { totalItems } = useCart()

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-cream/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-leaf font-display text-lg font-bold text-cream">
            R
          </span>
          <span className="font-display text-lg font-semibold leading-tight text-charcoal">
            Romano <span className="text-crate">Abasto</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-crate ${
                  isActive ? 'text-crate' : 'text-charcoal'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link to="/carrito" className="relative flex items-center gap-1.5 text-sm font-semibold text-leaf">
            <span aria-hidden>🧺</span>
            <span className="hidden sm:inline">Carrito</span>
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-crate text-[11px] font-bold text-cream">
                {totalItems}
              </span>
            )}
          </Link>
          <Link to="/zonas" className="btn-primary hidden sm:inline-flex">
            Pedir ahora
          </Link>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-line md:hidden"
            onClick={() => setOpen((o) => !o)}
            aria-label="Abrir menú"
          >
            <span className="text-lg">{open ? '✕' : '☰'}</span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-line bg-cream px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-3 pt-3">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-medium ${isActive ? 'text-crate' : 'text-charcoal'}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link to="/zonas" className="btn-primary mt-1 w-full" onClick={() => setOpen(false)}>
              Pedir ahora
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
