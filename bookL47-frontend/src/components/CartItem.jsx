import React, { useContext, useState } from 'react'
import styles from './styles/CartItem.module.css'
import { CartContext } from '../contexts/CartContext';
import CartInfo from './CartInfo'




export default function CartItem({ abridged, item, active, setActive }) {

  const { deleteCartItem, updateCartItemEquipment, updateCartItemDescription, applyToAllCartItems } = useContext(CartContext)

  function formatDate(dateString) {
    const date = new Date(`${dateString}T12:00:00Z`)

    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Los_Angeles',
    });
    
    return formatter.format(date)
  }
  function formatTime(timeString = '12:30:00') {
    const [ hours, minutes ] = timeString.split(':')
    const hour = Number(hours)
    const period = hour >= 12 ? 'pm' : 'am'
    const displayHour = hour % 12 || 12

    return `${displayHour}${minutes !== '00' ? ":" + minutes : ""}${period}`

  }
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
              <CartInfo item={item} active={active} setActive={setActive}></CartInfo> 
              
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
