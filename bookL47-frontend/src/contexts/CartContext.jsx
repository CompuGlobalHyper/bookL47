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

    function sortCart(cart) {
      return cart.toSorted((a, b) => new Date(`${a.date}T${a.start}`) - new Date(`${b.date}T${b.start}`))
    }
    function addToCart(booking) {
      setCart(prev => sortCart([...prev, booking]))
    }
    function deleteCartItem(id) {
      setCart(prev => sortCart(prev.filter((item) => item.id !== id)))
    }
    function updateCartItemEquipment(checked, id, equipmentName) {
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
    function updateCartItemDescription(id, newDescription) {
      setCart((prev) => {
        return prev.map((item) => {
          if (item.id !== id) return item
          return {
            ...item, description: newDescription
          }
        })
      })

    }
    function applyToAllCartItems(sourceID) {
      const source = cart.find(item => item.id === sourceID)

      setCart((prev) => {
        return prev.map(item => {
          return {
            ...item, 
            equipmentRequest: source.equipmentRequest,
            description: source.description}
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
    cart, 
    setCart, 
    addToCart, 
    clearCart, 
    deleteCartItem, 
    updateCartItemEquipment, 
    updateCartItemDescription,
    applyToAllCartItems
   }}>
    {children}
   </CartContext.Provider>
  )
}
