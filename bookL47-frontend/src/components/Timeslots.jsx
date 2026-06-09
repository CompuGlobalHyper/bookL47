import React, { useState, useEffect } from 'react'
import styles from './styles/Timeslots.module.css'

export default function Timeslots({ selectedRoom, slots = [] }) {
    const [message, setMessage] = useState('')
    const [buttons, setButtons] = useState([
        {
            id: 1,
            name: "10am - 12:30pm",
            dateTime: '10:00:00',
            available: true,
            selected: false,
        },
        {
            id: 2,
            name: "1pm - 3:30pm",
            dateTime: '13:00:00',
            available: true,
            selected: false,
        },
        {
            id: 3,
            name: "4pm - 6:30pm",
            dateTime: '16:00:00',
            available: true,
            selected: false,
        },
        {
            id: 4,
            name: "7:00pm - 9:30pm",
            dateTime: '19:00:00',
            available: true,
            selected: false,
        },
    ])

    function handleSelect(id) {
        setButtons((prev) => {
            return prev.map((button) => 
            button.id === id 
            ? {...button, selected: !button.selected}
            : button
            )
        })
    }

    useEffect(() => {
        if (!slots || Object.keys(slots).length === 0) return;
        console.log(JSON.stringify(slots))
        const filledTimes = slots?.filledTimes;
        const filledSet = new Set(
            filledTimes.map((time) => time.startTime)
        );

        setButtons(prev =>
            prev.map(button => ({
                ...button,
                available: !filledSet.has(button.dateTime)
            }))
        );
    }, [slots]);

    
  return (
    <div className={styles.container}>
      <div>Available slots:</div>
      <ul className={styles.list}>
        {buttons ? buttons.map((item) => {
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

