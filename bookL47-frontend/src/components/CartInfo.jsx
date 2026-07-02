import React, { useState, useContext } from 'react'
import { CartContext } from '../contexts/CartContext';
import styles from './styles/CartInfo.module.css'


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

export default function CartInfo({item, active, setActive}) {
  const { deleteCartItem, updateCartItemEquipment, updateCartItemDescription, applyToAllCartItems } = useContext(CartContext)
  return (
    true
    ? <div className={styles.backlineTab}>
        <div className={styles.inputContainer}>
          { equipmentOptions.map((equipment) => {
            return (
              <div className={`text ${styles.checkboxContainer}`}>
                <input 
                type="checkbox" 
                name={equipment.name} 
                id={`${equipment.id}:${equipment?.id}`} 
                onChange={(e) => updateCartItemEquipment(e.target.checked, equipment.id, equipment.name)}
                checked={item?.equipmentRequest.includes(equipment.name)}/>
                <label htmlFor={equipment.id}>{equipment.name}</label>
              </div>
            )
          })}
        </div>
        <div className={`${styles.infoBox} text`}>
          <span>Anything else we should know?</span>
          <textarea 
          name="info" 
          id={`info-${item?.id}`}
          placeholder='We will need 3 microphones as well as microphone stands. We will arrive 30 minutes later than our scheduled time.'
          maxLength={250}
          value={item?.description}
          onChange={(e) => updateCartItemDescription(item?.id, e.target.value)}></textarea>
        </div>
      </div>
    : <></>
  )
}
