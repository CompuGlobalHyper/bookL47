import React, { useEffect, useState } from 'react'
import styles from "./styles/Dropdown.module.css"

export default function Dropdown({ list, selected, setSelected }) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
    }, [selected, list])


  return (
    <div className={styles.container}>
        <div className={`${styles.display} text`}>
            <span className={`${styles.invisibleText}`}>This is placeholder text</span>
            <span className={`${styles.selected}`}>{selected.name}</span>
            <div 
            onClick={() => setOpen((prev) => !prev)}
            className={`${styles.button} bold`}>
                {open ? "-" : "+"}
            </div>
            </div>
        <div className={`${styles.dropdownContainer}`}>
            <ul className={`${styles.dropdown} ${!open ? styles.hidden : ''} text`}>
            { list.map((item) => {
                return (
                    <li key={item.id} 
                    className={`${styles.item} ${!item.available ? styles.unavailable : ''}`}
                    onClick={() => {
                        if (!item.available) {
                            return
                        }
                        console.log(item)
                        setSelected(item)
                        setOpen(false)
                    }}>{item.name}</li>
                )
            })}
            </ul>

        </div>
        
    </div>
  )
}
