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
        <div className={`${styles.room} text bold`}>{`Room ${item.room}`}</div>
        { abridged ? <></> : 
        <div 
        className={`${styles.option} text`}
        onClick={ () =>
          active === item.id 
          ? setActive(null) 
          : setActive(item.id)} >{active === item.id ? '' : 'View options'}</div>
        }
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
            <div className={`${styles.buttonContainer}`}>
              <div className={`${styles.applyAll} text bold`}
                    onClick={() => applyToAllCartItems(item.id)}
                    ><span>Apply to all bookings</span>
              </div>
              <div className={`${styles.closeButton} text bold`}
                    onClick={() => setActive(null)}
                    ><span>Close</span>
              </div>
            </div>
          </div> 
        : <></>}
        <div 
        onClick={() => deleteCartItem(item.id)}
        className={`${styles.delete} text bold`}><span>Delete</span></div>
      </div>
        
      
    </div>
  )
}
