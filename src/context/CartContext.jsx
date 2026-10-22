import React, { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

// Tope de bolsas/cajones (y medias bolsas/medios cajones) por pedido — los
// productos sueltos (por kg, atado, unidad) no tienen límite, solo esta
// presentación cerrada. Se identifica por el nombre de la variante/producto
// porque no es una categoría propia en la web, sino un tipo de presentación
// dentro de "Frutas y verduras" (ver sync_productos_web.py).
const LIMITE_BOLSA_CAJON = 2

function normalizar(txt) {
  return (txt || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
}

function pesoBolsaCajon(product) {
  const texto = normalizar(product.variante || product.name)
  if (!texto.includes('bolsa') && !texto.includes('cajon')) return 0
  const esMedio = texto.includes('medio') || texto.includes('media') ||
                  texto.includes('1/2') || product.variante?.includes('½') || product.name?.includes('½')
  return esMedio ? 0.5 : 1
}

function pesoTotalBolsaCajon(items, excludeId) {
  return Object.entries(items).reduce((sum, [id, { product, qty }]) => {
    if (id === String(excludeId)) return sum
    return sum + pesoBolsaCajon(product) * qty
  }, 0)
}

export function CartProvider({ children }) {
  const [items, setItems] = useState({})

  function addToCart(product, qty = 1) {
    let resultado = { ok: true }
    setItems((prev) => {
      const current = prev[product.id]
      const newQty = (current?.qty || 0) + qty
      const peso = pesoBolsaCajon(product)
      if (peso > 0 && newQty > 0) {
        const otros = pesoTotalBolsaCajon(prev, product.id)
        if (otros + peso * newQty > LIMITE_BOLSA_CAJON + 1e-9) {
          resultado = {
            ok: false,
            reason: `Máximo ${LIMITE_BOLSA_CAJON} bolsas/cajones por pedido (sumando medias bolsas y medios cajones).`,
          }
          return prev
        }
      }
      if (newQty <= 0) {
        const { [product.id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [product.id]: { product, qty: newQty } }
    })
    return resultado
  }

  function setQty(product, qty) {
    let resultado = { ok: true }
    setItems((prev) => {
      const peso = pesoBolsaCajon(product)
      if (peso > 0 && qty > 0) {
        const otros = pesoTotalBolsaCajon(prev, product.id)
        if (otros + peso * qty > LIMITE_BOLSA_CAJON + 1e-9) {
          resultado = {
            ok: false,
            reason: `Máximo ${LIMITE_BOLSA_CAJON} bolsas/cajones por pedido (sumando medias bolsas y medios cajones).`,
          }
          return prev
        }
      }
      if (qty <= 0) {
        const { [product.id]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [product.id]: { product, qty } }
    })
    return resultado
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
