import React, { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState({}) // { [productId]: { product, qty } }

  function addToCart(product, qty = 1) {
    setItems((prev) => {
      const current = prev[product.id]
      const newQty = (current?.qty || 0) + qty
      if (newQty <= 0) {
        const { [product.id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [product.id]: { product, qty: newQty } }
    })
  }

  function setQty(product, qty) {
    setItems((prev) => {
      if (qty <= 0) {
        const { [product.id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [product.id]: { product, qty } }
    })
  }

  const cartList = useMemo(() => Object.values(items), [items])
  const totalItems = useMemo(() => cartList.reduce((s, i) => s + i.qty, 0), [cartList])
  const totalPrice = useMemo(
    () => cartList.reduce((s, i) => s + i.qty * i.product.price, 0),
    [cartList]
  )

  return (
    <CartContext.Provider value={{ items, cartList, addToCart, setQty, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
