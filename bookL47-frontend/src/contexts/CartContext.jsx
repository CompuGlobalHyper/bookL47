import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from './UserContext'
import { createContext } from 'react'

const API = import.meta.env.VITE_API_URL

export const CartContext = createContext()
export function CartProvider({ children }) {
    const { user, loading: userLoading } = useContext(UserContext)
    const [cart, setCart] = useState([])
    const [loading, setLoading] = useState(true)
    
    useEffect(() => {
      async function init() {
        if (user.role === "guest" || userLoading) {
          return setLoading(false)
        }
        const sortedCart = await getCart()
        setCart(sortedCart)
        setLoading(false)
      }
      init()
    }, [userLoading, user])

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
      return sortCart(data)
    }
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
      if (res.status === 200) {
        let sortedCart = await getCart()
        console.log(sortedCart)
        setCart(sortedCart)
        return true
      } else {
        return false
      }
      
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
    async function updateCartItem(checked = undefined, id, newItem) {
      setCart(prevCart => 
        prevCart.map(item => {
          if (item.id !== id) return item
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
      try {
        const res = await fetch(`${API}/cart`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({checked, id, newItem})
        })
        console.log('after fetch')
        if (!res.ok) {
          throw new Error("Failed updating cart");
        } 
      } finally {
        return
      }    
    }

  return (
   <CartContext.Provider 
   value={{
    cart,
    loading, 
    setCart,
    getCart, 
    addToCart, 
    deleteCartItem, 
    updateCartItem
   }}>
    {children}
   </CartContext.Provider>
  )
}
