import React, { useState, useEffect, useContext } from 'react'
import styles from './styles/Timeslots.module.css'
import { CartContext } from '../contexts/CartContext'
import Dropdown from './Dropdown'

export default function Timeslots({ 
    selectedSlot,
    setSelectedSlot,
    availableSlots, 
    setAvailableSlots, 
    selectedRoom, 
    bookedSlots = [], 
    user, 
    selectedDate }) {

    const { addToCart, cart } = useContext(CartContext)


    function handleSelect(id) {
        setAvailableSlots((prev) => {
            return prev.map((slot) => 
            slot.id === id 
            ? {...slot, selected: true}
            : {...slot, selected: false}
            )
        })
    }

  return (
    <div className={styles.main}>
        <div className={styles.container}>
            <div className={`${styles.title} text bold medium`}>Available slots:</div>
            <Dropdown list={availableSlots} selected={selectedSlot} setSelected={setSelectedSlot}></Dropdown>
        </div>
    </div>
    
  )
}

