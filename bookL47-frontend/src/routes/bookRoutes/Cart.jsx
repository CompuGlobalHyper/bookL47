import React, { useContext, useState } from 'react'
import { Link } from 'react-router'
import { CartContext } from '../../contexts/CartContext'
import CartItem from '../../components/CartItem'
import styles from './styles/Cart.module.css'
import CartInfo from '../../components/CartInfo'

const example = { 
                    id: crypto.randomUUID(),
                    equipment_request: [],
                    description: ''
                }

export default function Cart() {
  const { cart, clearCart } = useContext(CartContext)
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
        name: "Vibes",
        id: "vibes",
        selected: false
      },
    ])
  const [ exampleItem, setExampleItem ] = useState(example)
  const [active, setActive] = useState(null)
  const [viewCart, setViewCart] = useState(true)
  const { deleteCartItem, updateCartItemEquipment, updateCartItemDescription, applyToAllCartItems } = useContext(CartContext)

  console.log(equipment)
  
  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.cartHeader}>
          <div 
          className={`${viewCart && styles.open} ${styles.header} text`}
          onClick={() => setViewCart(true)}
          >View Cart</div>
          <div 
          className={`${!viewCart && styles.open} ${styles.header} text`}
          onClick={() => setViewCart(false)}>Add Backline</div>
        </div>
        {!viewCart 
        && <div className={`${styles.bookingInfo}`}>
            <CartInfo item={exampleItem} active={exampleItem.id} setActive={setActive} equipment={equipment} setEquipment={setEquipment}></CartInfo>
            <div className={`${styles.applyAll} text bold`}
                    onClick={() => applyToAllCartItems(exampleItem.id)}
                    ><span>Apply to all bookings</span>
            </div>
          </div>
        }
        { viewCart 
        && <ul className={styles.list}>
          { cart.length > 0 ? 
              cart.map((item) => {
                return (
                <li key={item.id}>
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
        </ul>
        }
      </div>
      {cart.length > 0 && <div className={`${styles.priceContainer}`}>
        <div className={`${styles.totalText} text medium`}>Est. Total</div>
        <div className={`${styles.priceTotal} text medium bold`}>{`$${cart.reduce((acc, item) => {
          return acc + item.price}, 0)}.00`}</div>
      </div>}
      <div className={styles.bottomButtons}>
        {cart.length > 0 && <Link className={`${styles.brandButton} bold text`} to={'/checkout'}><span>Checkout</span></Link>}
        <div onClick={() => clearCart()} className={`${styles.button} bold text`}><span>Clear cart</span></div>
      </div>
      
    </div>
  )
}
