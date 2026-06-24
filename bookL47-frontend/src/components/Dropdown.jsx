import React, { useState } from 'react'
import styles from "./styles/Dropdown.module.css"

export default function Dropdown() {
    const [open, setOpen] = useState(false)
    const [selected, setSelected] = useState('')
    const list = ["example1", "example2", "example3"]

  return (
    <div className={styles.container}>
        <div className={`${styles.display} text`}>
            <span className={`${styles.invisibleText}`}>Placeholder text</span>
            <span className={`${styles.selected}`}>{selected}</span>
            <div 
            onClick={() => setOpen((prev) => !prev)}
            className={`${styles.button} bold`}>
                {open ? "-" : "+"}
            </div>
            </div>
        <ul className={`${styles.dropdown} ${!open ? styles.hidden : ''} text`}>
            {list.map((item) => {
                return (
                    <li key={item} 
                    className={`${styles.item}`}
                    onClick={() => {
                        setSelected(item)
                        setOpen(false)
                    }}>{item}</li>
                )
            })}
        </ul>
    </div>
  )
}
