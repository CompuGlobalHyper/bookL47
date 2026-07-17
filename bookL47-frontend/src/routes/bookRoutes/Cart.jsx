import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import { CartContext } from '../../contexts/CartContext'
import CartItem from '../../components/CartItem'
import styles from './styles/Cart.module.css'
import CartInfo from '../../components/CartInfo'
import { createTotal } from '../../functions/formatter.js'
import Loading from '../../components/Loading.jsx'

const example = { 
                    id: crypto.randomUUID(),
                    equipment_request: [],
                    description: ''
                }

export default function Cart() {
  const { cart, clearCart, loading: cartLoading } = useContext(CartContext)
  const [equipment, setEquipment] = useState([
      {
        name: "PA System and Microphone",
        id: "paAndMic",
        selected: false
      },
      {
        name: "Bass Amp",
        id: "bassAmp",
        selected: false
      },
      {
        name: "Guitar Amp",
        id: "guitarAmp",
        selected: false
      },
      {
        name: "Keyboard Amp",
        id: "keyboardAmp",
        selected: false
      },
      {
        name: "Vibraphone",
        id: "vibes",
        selected: false
      },
    ])
  const [ exampleItem, setExampleItem ] = useState(example)
  const [active, setActive] = useState(null)
  const { deleteCartItem, updateCartItemEquipment, updateCartItemDescription, applyToAllCartItems } = useContext(CartContext)

  useEffect(() => {

  }, [cart])
  
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={`${styles.cartHeader} text large`}>
          <div 
          className={`${styles.open} ${styles.header} text`}
          >Your Cart {cart.some(item => item.status === 'conflict') && <div className='text small error'>Error: One or more of your bookings is no longer available.</div>}</div>
        </div>
        {!cartLoading
        ? <>
          <ul className={styles.list}>
          { cart.length > 0 ? 
              cart.map((item) => {
                return (
                <li key={item?.id}>
                  <CartItem
                    abridged={false}
                    item={item} 
                    active={active} 
                    setActive={setActive}
                    equipment={equipment}
                    setEquipment={setEquipment}>
                  </CartItem>
                </li>
                )
              })
          : <div className={`text large`}>It looks like your cart is empty..</div> }
        </ul></>
        : <Loading></Loading>}
        
        
      </div>
      <div className={styles.bottom}>
        {cart.length > 0 && !cartLoading && <div className={`${styles.priceContainer}`}>
          <div className={`${styles.totalText} text medium`}>Est. Total</div>
          <div className={`${styles.priceTotal} text medium bold`}>{`$${(createTotal(cart)).toFixed(2)}`}</div>
        </div>}
        <div className={styles.bottom}>
          {cart.length > 0 && cart.every(item => item.status !== 'conflict') && <Link className={`${styles.brandButton} button text medium`} to={'/checkout'}><span>Checkout</span></Link>}
        </div>
      </div>
      
    </div>
  )
}
