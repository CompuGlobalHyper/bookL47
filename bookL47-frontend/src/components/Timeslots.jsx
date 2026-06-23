import React, { useState, useEffect, useContext } from 'react'
import styles from './styles/Timeslots.module.css'
import { CartContext } from '../contexts/CartContext'

export default function Timeslots({ selectedRoom, slots = [], user, selectedDate }) {

    const { addToCart, cart } = useContext(CartContext)
    const [message, setMessage] = useState('')
    const [buttons, setButtons] = useState([
        {
            id: 1,
            name: "10am - 12:30pm",
            start: '10:00:00',
            end: '12:30:00',
            available: true,
            selected: false,
            inCart: false
        },
        {
            id: 2,
            name: "1pm - 3:30pm",
            start: '13:00:00',
            end: '15:30:00',
            available: true,
            selected: false,
            inCart: false
        },
        {
            id: 3,
            name: "4pm - 6:30pm",
            start: '16:00:00',
            end: '18:30:00',
            available: true,
            selected: false,
            inCart: false
        },
        {
            id: 4,
            name: "7:00pm - 9:30pm",
            start: '19:00:00',
            end: '21:30:00',
            available: true,
            selected: false,
            inCart: false
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
    
    const { firstName, lastName, email } = user
    
    function handleClick() {

        buttons.map((button) => {
            if (button.selected && button.available) {
                let booking = {
                    id: crypto.randomUUID(),
                    first_name: firstName || "Phin",
                    last_name: lastName || "Crisp",
                    email: email || "phineas.crisp@afm47.org",
                    date: selectedDate,
                    room: selectedRoom,
                    start: button.start,
                    end: button.end,
                    equipmentRequest: [],
                    description: ''
                }
                addToCart(booking)
            }
        })
    }

    useEffect(() => {
        if (!slots || Object.keys(slots).length === 0) return;
        const filledTimes = slots.filledTimes || []
        console.log(slots)
        const slotSet = new Set(filledTimes.map((time) => time.start));
        const cartSet = new Set(
            cart
            .filter(item =>
                item.date === selectedDate 
                && item.room === selectedRoom
            )
            .map((item) => 
                item.start
            ))
        setButtons((prev) => {
            return prev
            .map((button) => {
                const isInSlot = slotSet.has(button.start);
                const isInCart = cartSet.has(button.start);
                return {
                    ...button,
                    selected: false,
                    available: !isInSlot && !isInCart,
                    inCart: isInCart
                }
            })
        })

        
    }, [slots, cart, selectedDate, selectedRoom]);

    
  return (
    <div className={styles.container}>
      <div className='text'>Available slots:</div>
      <ul className={styles.list}>
        {buttons ? buttons.map((item) => {
            return (
                <li 
                className=
                {`text ${styles.item} 
                ${item.available ? '': styles.unavailableItem} 
                ${item.selected ? styles.isActive : ''}`} 
                key={item.id}
                onClick={() => {
                    if (item.available) {
                        handleSelect(item.id)
                }
                }}><span>{`${item.name}${item.inCart ? ' (in cart)' : ''}`}</span></li>
            )
        }) : <div>Loading...</div>}
      </ul>
      <div className={`${styles.button} text medium`} onClick={handleClick}><span>Add booking</span></div>
    </div>
  )
}

