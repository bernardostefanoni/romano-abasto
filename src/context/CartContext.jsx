import React, { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState({})

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

  function addPackToCart(pack, qty = 1) {
    // Los packs se identifican con "pack-{id}" para no chocar con productos
    const packId = `pack-${pack.id}`
    setItems((prev) => {
      const current = prev[packId]
      const newQty = (current?.qty || 0) + qty
      const packAsProduct = {
        id:            packId,
        name:          pack.name,
        price:         pack.price,
        img:           pack.img,
        unit:          `${pack.components?.length || 0} productos`,
        paso:          1,
        isPack:        true,
        components:    pack.components || [],
      }
      return { ...prev, [packId]: { product: packAsProduct, qty: newQty } }
    })
  }

  function clearCart() {
    setItems({})
  }

  const cartList   = useMemo(() => Object.values(items), [items])
  const totalItems = useMemo(() => cartList.length, [cartList])
  const totalPrice = useMemo(
    () => cartList.reduce((s, i) => s + i.qty * i.product.price, 0),
    [cartList]
  )

  return (
    <CartContext.Provider value={{ items, cartList, addToCart, setQty, addPackToCart, clearCart, totalItems, totalPrice }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
