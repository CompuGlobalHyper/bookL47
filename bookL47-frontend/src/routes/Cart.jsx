import React, { useContext, useState } from 'react'
import { CartContext } from '../contexts/CartContext'
import CartItem from '../components/CartItem'

export default function Cart() {
  const { cart, clearCart } = useContext(CartContext)
  const [active, setActive] = useState(null)

  console.log(cart)
  
  return (
    <div>
      <div onClick={() => clearCart()}>Reset cart</div>
      <ul>
      { cart.length > 0 ? 
          cart.map((item) => {
            return (
            <li key={item.id}>
              <CartItem 
                item={item} 
                active={active} 
                setActive={setActive}>
              </CartItem>
            </li>
            )
          })
      : <div>It looks like your cart is empty</div> }
      </ul> 
    </div>
  )
}
