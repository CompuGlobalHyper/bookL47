import React, { useState, useContext } from 'react'
import { CartContext } from '../contexts/CartContext';
import styles from './styles/CartInfo.module.css'


export default function CartInfo({equipment, setEquipment, description, setDescription, item}) {
  function handleChange(checked, id) {
    setEquipment((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          return {...item, selected: checked}
        } else {
          return item
        }
      })
    })
  }
  const { deleteCartItem, updateCartItem, applyToAllCartItems } = useContext(CartContext)
  return (
    item
    ? <div className={styles.backlineTab}>
        <div className={styles.inputContainer}>
          { equipment?.map((equipmentOption) => {
            return (
              <div className={`text ${styles.checkboxContainer}`}>
                <input 
                type="checkbox" 
                name={equipmentOption.name} 
                id={`${equipmentOption.id}-${item.id}`} 
                onChange={(e) => updateCartItem(e.target.checked, item.id, equipmentOption.name)}
                checked={item?.equipment_request?.includes(equipmentOption.name)}/>
                <label htmlFor={equipmentOption.id}>{equipmentOption.name}</label>
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
          value={item.description}
          onChange={(e) => updateCartItem(undefined, item.id, e.target.value)}></textarea>
        </div>
      </div>
    : <div className={styles.backlineTab}>
        <div className={styles.inputContainer}>
          { equipment.map((equipmentOption) => {
            return (
              <div className={`text ${styles.checkboxContainer}`}>
                <input 
                type="checkbox" 
                name={equipmentOption.name} 
                id={`${equipmentOption.id}`} 
                onChange={(e) => handleChange(e.target.checked, equipmentOption.id)}
                />
                <label htmlFor={equipmentOption.id}>{equipmentOption.name}</label>
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}></textarea>
        </div>
      </div>
  )
}