import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function formatPrice(n) {
  return n.toLocaleString('es-AR')
}

export default function Carrito() {
  const { cartList, setQty, totalPrice } = useCart()

  if (cartList.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <span aria-hidden className="text-4xl">🧺</span>
        <h1 className="mt-4 font-display text-2xl font-semibold text-charcoal">Tu carrito está vacío</h1>
        <p className="mt-2 text-sm text-charcoal/60">Sumá productos frescos del mercado para armar tu pedido.</p>
        <Link to="/productos" className="btn-primary mt-6 inline-flex">Ver productos</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="font-display text-3xl font-bold text-charcoal">Tu carrito</h1>

      <div className="mt-6 divide-y divide-line rounded-card border border-line bg-white shadow-soft">
        {cartList.map(({ product, qty }) => (
          <div key={product.id} className="flex items-center gap-4 p-4">
            <img src={product.img} alt={product.name} className="h-16 w-16 rounded-lg object-cover" />
            <div className="flex-1">
              <p className="font-display font-semibold text-charcoal">{product.name}</p>
              <p className="text-xs text-charcoal/50">{product.unit}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="stepper-btn" onClick={() => setQty(product, qty - 1)}>−</button>
              <span className="w-6 text-center text-sm font-semibold">{qty}</span>
              <button className="stepper-btn" onClick={() => setQty(product, qty + 1)}>+</button>
            </div>
            <span className="tag-price w-24 text-right font-bold">
              ${formatPrice(product.price * qty)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-6 flex flex-col items-end gap-4">
        <p className="text-lg">
          Total: <span className="tag-price text-2xl font-bold">${formatPrice(totalPrice)}</span>
        </p>
        <button className="btn-primary">Continuar con el pedido</button>
      </div>
    </div>
  )
}
