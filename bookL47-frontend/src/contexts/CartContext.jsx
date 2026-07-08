import React, { createContext, useEffect, useState } from 'react'

const API = import.meta.env.VITE_API_URL

export const CartContext = createContext()
export function CartProvider({ children }) {
    const [cart, setCart] = useState([])
    async function getCart() {
      console.log('fetching cart info..')
      const res = await fetch(`${API}/cart`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include"
      })
      const data = await res.json()
      return data

    }
    useEffect(() => {
      async function init() {
        const cart = await getCart()
        setCart(cart)
      }
      init()
    }, [])

    function sortCart(cart) {
      return cart.toSorted((a, b) => new Date(`${a.date}T${a.start}`) - new Date(`${b.date}T${b.start}`))
    }
    async function addToCart(booking) {
      const res = await fetch(`${API}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({booking: booking})
      })
      let cart = await getCart()
      let sortedCart = sortCart(cart)
      setCart(sortedCart)
    }
    async function deleteCartItem(id) {
      const res = await fetch(`${API}/cart`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({id})
      })
      setCart(prev => sortCart(prev.filter((item) => item.id !== id)))
    }
    async function  updateCartItem(checked = undefined, id, newItem) {
      setCart(prevCart => 
        prevCart.map(item => {
          if (item.id === id) {
            if (checked === undefined) {
              return {...item, description: newItem}
            }
            if (checked) {
              return {...item, equipment_request: item.equipment_request.includes(newItem)
                                                ? item.equipment_request
                                                : [...item.equipment_request, newItem]}
            }
            if (!checked)
              return {...item, equipment_request: item.equipment_request.filter(string => string !== newItem)}
          return item
          }
        })
      );
      const res = await fetch(`${API}/cart`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({checked, id, newItem})
      })
      if (!res.ok) {
      console.error("Failed updating cart");
      return;
}
    }
    // function applyToAllCartItems(sourceID, exampleItem = false) {
    //   const source = cart.find(item => item.id === sourceID) || exampleItem

    //   setCart((prev) => {
    //     return prev.map(item => {
    //       return {
    //         ...item, 
    //         equipmentRequest: source.equipmentRequest,
    //         description: source.description}
    //     })
    //   })
    // }
    function clearCart() {
      return
    }

  return (
   <CartContext.Provider 
   value={{
    cart, 
    setCart, 
    addToCart, 
    clearCart, 
    deleteCartItem, 
    updateCartItem
   }}>
    {children}
   </CartContext.Provider>
  )
}
