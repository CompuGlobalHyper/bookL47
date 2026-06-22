import React, { createContext, useEffect, useState } from 'react'

export const CartContext = createContext()
export function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
      const saved = localStorage.getItem("cart")
      return saved ? JSON.parse(saved) : []
    })

    useEffect(() => {
      localStorage.setItem("cart", JSON.stringify(cart))

    }, [cart])
    function addToCart(booking) {
      setCart(prev => [...prev, booking])
    }
    function deleteCartItem(id) {
      setCart(prev => prev.filter((item) => item.id !== id))
    }
    function updateCartItem(checked, id, equipmentName) {
      setCart((prev) => {
        return prev.map((item) => {
          if (item.id !== id) return item
          return {
            ...item, equipmentRequest: checked 
            ? [...item.equipmentRequest, equipmentName]
            : item.equipmentRequest.filter(d => d !== equipmentName)
          }
        })
      })

    }
    function clearCart() {
      localStorage.removeItem("cart")
      setCart([])
    }

  return (
   <CartContext.Provider 
   value={{
    cart, setCart, addToCart, clearCart, deleteCartItem, updateCartItem
   }}>
    {children}
   </CartContext.Provider>
  )
}
