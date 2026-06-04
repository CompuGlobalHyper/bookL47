import React, { useState } from 'react'
import styles from './styles/Timeslots.module.css'
const slotsTest = [
        {
            id: 1,
            name: "10am - 12:30pm",
            date: null,
            available: true,
            selected: false,
        },
        {
            id: 2,
            name: "1pm - 3:30pm",
            date: null,
            available: true,
            selected: false,
        },
        {
            id: 3,
            name: "4pm - 6:30pm",
            date: null,
            available: true,
            selected: false,
        },
        {
            id: 4,
            name: "6:30pm - 9:30pm",
            date: null,
            available: true,
            selected: false,
        },
    ];

export default function Timeslots() {
    const [slots, setSlots] = useState(slotsTest)

    function handleSelect(id) {
        setSlots((prev) => {
            return prev.map((slot) => 
            slot.id === id 
            ? {...slot, selected: !slot.selected}
            : slot
            )
        })
    }
    
  return (
    <div className={styles.container}>
      <div>Available slots:</div>
      <ul className={styles.list}>
        {slots ? slots.map((item) => {
            return (
                <li 
                className=
                {`${styles.item} 
                ${item.available ? '': styles.unavailableItem} 
                ${item.selected ? styles.isActive : ''}`} 
                key={item.id}
                onClick={() => {
                    if (item.available) {
                        handleSelect(item.id)
                }
                }}><span>{item.name}</span></li>
            )
        }) : <div>Loading...</div>}
      </ul>
      <div className={styles.button}><span>Add booking</span></div>
    </div>
  )
}
