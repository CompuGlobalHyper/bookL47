import React, { useContext, useState } from 'react'
import { CartContext } from '../contexts/CartContext'
import CartItem from '../components/CartItem'
import styles from './styles/Cart.module.css'

export default function Cart() {
  const { cart, clearCart } = useContext(CartContext)
  const [active, setActive] = useState(null)

  console.log(cart)
  
  return (
    <div>
      <ul>
      { cart.length > 0 ? 
          cart.map((item) => {
            return (
            <li key={item.id}>
              <CartItem
                abridged={false}
                item={item} 
                active={active} 
                setActive={setActive}>
              </CartItem>
            </li>
            )
          })
      : <div className={`text large`}>It looks like your cart is empty..</div> }
      </ul>
      <div onClick={() => clearCart()} className={`${styles.button} bold text`}><span>Clear cart</span></div> 
    </div>
  )
}
