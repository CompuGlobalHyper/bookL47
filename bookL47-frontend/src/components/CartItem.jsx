import React, { useContext, useState } from 'react'
import styles from './styles/CartItem.module.css'
import { CartContext } from '../contexts/CartContext';

const equipmentOptions = [
  {
    name: "PA System and Microphone",
    id: "paAndMic",
  },
  {
    name: "Bass Amp",
    id: "bassAmp",
  },
  {
    name: "Guitar Amp",
    id: "guitarAmp",
  },
  {
    name: "Keyboard Amp",
    id: "keyboardAmp",
  },
  {
    name: "Vibes",
    id: "vibes",
  },
];


export default function CartItem({ item, active, setActive }) {

  const { deleteCartItem, updateCartItemEquipment, updateCartItemDescription, applyToAllCartItems } = useContext(CartContext)

  function formatDate(dateString) {
    const date = new Date(dateString)

    const formatted = date.toLocaleDateString('en-US',
      {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }
    )
    return formatted
  }
  function formatTime(timeString = '12:30:00') {
    const [ hours, minutes ] = timeString.split(':')
    const hour = Number(hours)
    const period = hour >= 12 ? 'pm' : 'am'
    const displayHour = hour % 12 || 12

    return `${displayHour}${minutes !== '00' ? ":" + minutes : ""} ${period}`

  }
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.date}>{formatDate(item.date)}</div>
        <div className={styles.room}>{`Room ${item.room}`}</div>
        <div className={styles.time}>{`${formatTime(item.start)} - ${formatTime(item.end)}`}</div>
        <div onClick={ () =>
          active === item.id 
          ? setActive(null) 
          : setActive(item.id)} >{active === item.id ? 'Close options menu' : 'Options'}</div>
        { active === item.id
        ? <div className={styles.backlineTab}>
            <div className={styles.inputContainer}>
              { equipmentOptions.map((equipment) => {
                return (
                  <div className={styles.checkboxContainer}>
                    <input 
                    type="checkbox" 
                    name={equipment.name} 
                    id={`${equipment.id}:${item.id}`} 
                    onChange={(e) => updateCartItemEquipment(e.target.checked, item.id, equipment.name)}
                    checked={item.equipmentRequest.includes(equipment.name)}/>
                    <label htmlFor={equipment.id}>{equipment.name}</label>
                  </div>
                )
              })}
            </div>
            <div className={styles.infoBox}>
              <span>Anything else we should know?</span>
              <textarea 
              name="info" 
              id="info"
              placeholder='We will need 3 microphones as well as microphone stands. We will arrive 30 minutes later than our scheduled time.'
              maxLength={250}
              value={item.description}
              onChange={(e) => updateCartItemDescription(item.id, e.target.value)}></textarea>
            </div>
             <div 
             className={styles.button}
             onClick={() => applyToAllCartItems(item.id)}
             >Apply these requests to all bookings</div>
          </div> 
        : <></>}
        <div onClick={() => deleteCartItem(item.id)}>Delete booking from cart</div>
      </div>
        
      
    </div>
  )
}
