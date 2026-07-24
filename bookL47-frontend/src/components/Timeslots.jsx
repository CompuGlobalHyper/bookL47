import React, { useState, useEffect, useContext } from 'react'
import styles from './styles/Timeslots.module.css'
import { CartContext } from '../contexts/CartContext'
import Dropdown from './Dropdown'

export default function Timeslots({ 
    dropdown,
    setDropdown,
    selectedRoom,
    selectedSlot,
    setSelectedSlot,
    availableSlots, 
    setAvailableSlots,
    availableStarts,
    selectedStart,
    setSelectedStart,
    selectedEnd,
    setSelectedEnd,
    availableEnds,
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
        <div className={`${Object.keys(selectedRoom).length === 0 ? styles.hidden : ''}`}>
            { user.role === "nonMember" || user.role === "admin" 
            ? <div className={`${styles.startEnd}`}>
                <div className={`${styles.timeContainer}`}>
                    <div className={`${styles.title} text bold medium`}>Start:</div>
                    <Dropdown 
                        list={availableStarts} 
                        selected={selectedStart} 
                        setSelected={setSelectedStart}
                        dropdown={dropdown}
                        setDropdown={setDropdown}
                        id={2}>
                    </Dropdown>
                </div>
                <div className={`${styles.timeContainer} ${Object.keys(selectedStart).length > 0 ? "" : styles.hiddenEnd}`}>
                    <div className={`${styles.title} text bold medium`}>End:</div>
                    <Dropdown 
                        list={availableEnds} 
                        selected={selectedEnd} 
                        setSelected={setSelectedEnd}
                        dropdown={dropdown}
                        setDropdown={setDropdown}
                        id={3}>
                    </Dropdown>
                </div>
            </div>
            :  <div className={`${styles.container}`}>
                    <div className={`${styles.title} text bold medium`}>Slots:</div>
                    <Dropdown 
                    list={availableSlots} 
                    selected={selectedSlot} 
                    setSelected={setSelectedSlot}
                    dropdown={dropdown}
                    setDropdown={setDropdown}
                    id={2}></Dropdown>
                </div> }
            
        </div>
    </div>
    
  )
}

