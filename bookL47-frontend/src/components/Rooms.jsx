import React, { useState } from 'react'
import styles from './styles/Rooms.module.css'

export default function Rooms() {
    const [selected, setSelected] = useState(null)

    function handleClick(e) {
        e.preventDefault()



    }
    const smallRooms = [
        { id: 1, name: "Room 1", isActive: false },
        { id: 2, name: "Room 2", isActive: false },
        { id: 3, name: "Room 3", isActive: false },
        { id: 4, name: "Room 4", isActive: false }
    ];
    const bigRooms = [
        { id: 5, name: "Room 5", isActive: false },
        { id: 6, name: "Room 6", isActive: false },
        { id: 7, name: "Room 7", isActive: false }
    ];

  return (
    <div className={styles.container}>
        <ul className={styles.list}>
            { smallRooms.map((room) => {
                room.isActive = room.id === selected
                return (
                    <li 
                        key={room.id} 
                        className={`${styles.item} ${room.isActive ? styles.activeItem : ''}`}
                        onClick={() => setSelected(room.id)}>
                        {room.name}
                    </li>)
            })}
        </ul>
        <ul className={styles.list}>
            { bigRooms.map((room) => {
                room.isActive = room.id === selected
                return (
                    <li 
                        key={room.id} 
                        className={`${styles.item} ${room.isActive ? styles.activeItem : ''}`}
                        onClick={() => setSelected(room.id)}>
                        {room.name}
                    </li>)
            })}
        </ul>
    </div>
  )
}
