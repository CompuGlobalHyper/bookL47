import React, { useEffect, useState, useRef } from 'react'
import styles from "./styles/Dropdown.module.css"
import { useClickOutside } from '../functions/clickOutside'

export default function Dropdown({ list, selected, setSelected, id, dropdown, setDropdown }) {
    const dropdownRef = useRef(null);
    // useClickOutside(dropdownRef, () => {
    //     if (!dropdown.some((menu) => menu.open)) {
    //          return;
    //     }
    //     setDropdown((prev) => 
    //         prev.map((menu) => {
    //             return {...menu, open: false }
    //         })
    //     )})
    
    const open =
    dropdown?.find(menu => menu.id === id)?.open ?? false;


    const handleClick = () => {
        console.log('hello')
        setDropdown((prev) => 
            prev.map((menu) => 
                menu.id === id 
                    ? {...menu, open: !menu.open }
                    : {...menu, open: false})
    )}

    useEffect(() => {
    }, [selected, list])


  return (
    <div className={styles.container}>
        <div className={`${styles.display} text`} onClick={() => handleClick()}>
            <span className={`${styles.invisibleText}`}>This is placeholder text</span>
            <span className={`${styles.selected}`}>{selected.name}</span>
            <div
            className={`${styles.button} bold`}>
                {open ? "-" : "+"}
            </div>
            </div>
        <div className={`${styles.dropdownContainer}`}>
            <ul ref={dropdownRef} className={`${styles.dropdown} ${!open ? styles.hidden : ''} text`}>
            { list?.map((item) => {
                return (
                    <li key={item.id} 
                    className={`${styles.item} ${!item.available ? styles.unavailable : ''}`}
                    onMouseDown={() => console.log("DOWN")}
                    onClick={() => {
                        console.log("CLICK")
                        console.log(item)
                        if (!item.available) {
                            return
                        }
                        console.log(item)
                        setSelected(item)
                        handleClick()
                    }}>{item.name}</li>
                )
            })}
            </ul>
        </div>
    </div>
  )
}
