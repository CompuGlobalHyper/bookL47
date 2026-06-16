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
    function clearCart() {
      localStorage.removeItem("cart")
      setCart([])
    }

  return (
   <CartContext.Provider 
   value={{
    cart, setCart, addToCart, clearCart
   }}>
    {children}
   </CartContext.Provider>
  )
}
