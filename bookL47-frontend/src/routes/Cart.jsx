import React, { useContext } from 'react'
import { CartContext } from '../contexts/CartContext'

export default function Cart() {
    const { cart, clearCart } = useContext(CartContext)
  return (
    <div>
      {JSON.stringify(cart)}
      <div onClick={clearCart}>Reset</div>
    </div>
  )
}
