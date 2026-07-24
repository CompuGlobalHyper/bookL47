import React, { useContext, useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import { CartContext } from '../../contexts/CartContext'
import CartItem from '../../components/CartItem'
import styles from './styles/Cart.module.css'
import CartInfo from '../../components/CartInfo'
import { createTotal } from '../../functions/formatter.js'
import Loading from '../../components/Loading.jsx'
import { UserContext } from '../../contexts/UserContext.jsx'
import setBannerMessage from '../../functions/bannerMessage.js'

const API = import.meta.env.VITE_API_URL
const example = { 
                    id: crypto.randomUUID(),
                    equipment_request: [],
                    description: ''
                }

export default function Cart() {
  const { user } = useContext(UserContext)
  const {setMessage } = useOutletContext()
  const { cart, getCart, setCart, clearCart, loading: cartLoading } = useContext(CartContext)
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
  const [allowSubmit, setAllowSubmit] = useState(true)
  const [active, setActive] = useState(null)
  const { deleteCartItem, updateCartItemEquipment, updateCartItemDescription, applyToAllCartItems } = useContext(CartContext)

  useEffect(() => {
    async function init() {
      const data = await getCart()
      setCart(data)
    }
    init()
  }, [])

  useEffect(() => {
  }, [cart])

  const handleClick = async () => {
    const res = await fetch(`${API}/payment/admin`, {
    method: 'GET',
    credentials: 'include',
    });
    const data = await res.json()
    if (res.status === 200) {
      setBannerMessage(setMessage, 'Added bookings to calendar!', false, 5)
      const cartData = await getCart()
      setCart(cartData)
    } else {
      setBannerMessage(setMessage, data.message, true, 5)
    }

  }
  
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
          : <div className={`text medium thin`}>It looks like your cart is empty.</div> }
        </ul></>
        : <Loading></Loading>}
        
        
      </div>
      <div className={styles.bottom}>
        {cart.length > 0 && !cartLoading && <div className={`${styles.priceContainer}`}>
          <div className={`${styles.totalText} text medium`}>Est. Total</div>
          <div className={`${styles.priceTotal} text medium bold`}>{`$${(createTotal(cart)).toFixed(2)}`}</div>
        </div>}
        <div className={styles.bottom}>
          {user.role !== 'admin' && cart.length > 0 && cart.every(item => item.status !== 'conflict') && <Link className={`${styles.brandButton} button text medium`} to={'/checkout'}><span>Checkout {user.role === 'admin' ? 'as a customer' : ''}</span></Link>}
          {user.role === 'admin' 
          && allowSubmit 
          && cart.length > 0 
          && cart.every(item => item.status !== 'conflict')
          && <div className='text button medium paragraph' onClick={() => handleClick()}>Add without payment</div>}
        </div>
      </div>
      
    </div>
  )
}
