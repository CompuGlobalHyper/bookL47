import React, { useContext, useState } from 'react'
import { CartContext } from '../../contexts/CartContext'
import CartItem from '../../components/CartItem'
import styles from './styles/Cart.module.css'
import CartInfo from '../../components/CartInfo'

const example = { 
                    id: crypto.randomUUID(),
                    equipmentRequest: [],
                    description: ''
                }

export default function Cart() {
  const { cart, clearCart } = useContext(CartContext)
  const [ exampleItem, setExampleItem ] = useState(example)
  const [active, setActive] = useState(null)
  const [viewCart, setViewCart] = useState(true)
  const { deleteCartItem, updateCartItemEquipment, updateCartItemDescription, applyToAllCartItems } = useContext(CartContext)

  
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
            <CartInfo item={exampleItem} active={exampleItem.id} setActive={setActive}></CartInfo>
            <div className={`${styles.applyAll} text bold`}
                    onClick={() => applyToAllCartItems(exampleItem.id)}
                    ><span>Apply to all bookings</span>
            </div>
          </div>
        }
        {viewCart 
        && <ul className={styles.list}>
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
        
        }
         
      </div>
      <div className={styles.bottomButtons}>
        <div onClick={() => clearCart()} className={`${styles.brandButton} bold text`}><span>Next</span></div>
        <div onClick={() => clearCart()} className={`${styles.button} bold text`}><span>Clear cart</span></div>
      </div>
      
    </div>
  )
}
