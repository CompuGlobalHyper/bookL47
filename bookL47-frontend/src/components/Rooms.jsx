import React, { useState } from 'react'
import styles from './styles/Rooms.module.css'
import Dropdown from './Dropdown';

export default function Rooms({ availableRooms, selectedRoom, setSelectedRoom, dropdown, setDropdown }) {

  return (
    <div className={styles.main}>
        <div className={styles.container}>
            <span className={`${styles.title} text bold medium`}>Rooms:</span>
            <Dropdown 
            list={availableRooms} 
            selected={selectedRoom} 
            setSelected={setSelectedRoom}
            id={1}
            dropdown={dropdown}
            setDropdown={setDropdown}></Dropdown>
        </div>
        <div className={`${styles.description}`}><em>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam fugit nostrum optio distinctio assumenda veritatis dolor esse ut. Odio, consequuntur.</em></div>
    </div>
  )
}
