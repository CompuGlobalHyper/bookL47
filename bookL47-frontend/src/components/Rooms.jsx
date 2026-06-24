import React, { useState } from 'react'
import styles from './styles/Rooms.module.css'
import Dropdown from './Dropdown';

export default function Rooms({ selectedRoom, setSelectedRoom }) {

    const rooms = [
        { id: 1, name: "Room 1", selected: false, available: true },
        { id: 2, name: "Room 2", selected: false, available: true },
        { id: 3, name: "Room 3", selected: false, available: true },
        { id: 4, name: "Room 4", selected: false, available: true },
        { id: 5, name: "Room 5", selected: false, available: true },
        { id: 6, name: "Room 6", selected: false, available: true },
        { id: 7, name: "Room 7", selected: false, available: true }
    ];

  return (
    <div className={styles.main}>
        <div className={styles.container}>
            <span className={`${styles.title} text bold medium`}>Rooms:</span>
            <Dropdown list={rooms} selected={selectedRoom} setSelected={setSelectedRoom}></Dropdown>
        </div>
        <div className={`${styles.description}`}><em>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam fugit nostrum optio distinctio assumenda veritatis dolor esse ut. Odio, consequuntur.</em></div>
    </div>
  )
}
