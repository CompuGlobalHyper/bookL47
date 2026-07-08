import React, { useContext, useState } from 'react'
import styles from './styles/CartItem.module.css'
import { CartContext } from '../contexts/CartContext';
import CartInfo from './CartInfo'
import { formatDate, formatTime } from '../functions/formatter.js'



export default function CartItem({ abridged, item, active, setActive, equipment, setEquipment }) {

  const { deleteCartItem, updateCartItem, applyToAllCartItems } = useContext(CartContext)

  
  return (
    
    <div className={styles.main}>
      <div className={styles.container}>
        <div className={`${styles.date} text bold medium`}>{formatDate(item.date)}</div>
        <div className={`${styles.time} text bold`}>{`${formatTime(item.start)} - ${formatTime(item.end)}`}</div>
        <div className={`${styles.room} text bold`}>{item.location}</div>
        { !abridged && <div>
              { active === item.id 
              ? <>
              <span className={`text bold`} 
              onClick={() => setActive(null)}>
                    - Close details</span>
              <CartInfo item={item} active={active} setActive={setActive} equipment={equipment}></CartInfo> 
              
              </>
              
              : <span className={`text bold`} 
              onClick={ () => 
                active === item.id 
                  ? setActive(null) 
                  : setActive(item.id)}>+ View details</span>}
              </div>
        }
        {}
        <div 
        onClick={() => deleteCartItem(item.id)}
        className={`${styles.delete} text bold`}><span>Delete</span></div>
      </div>
        
      
    </div>
  )
}
