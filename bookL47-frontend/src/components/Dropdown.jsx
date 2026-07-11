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
        setDropdown((prev) => 
            prev.map((menu) => 
                menu.id === id 
                    ? {...menu, open: !menu.open }
                    : {...menu, open: false})
    )}

    useEffect(() => {
    }, [])


  return (
    <div className={styles.container}>
        <div className={`${styles.display} text bold`} onClick={() => handleClick()}>
            <span className={`${styles.invisibleText}`}>This is placeholder text</span>
            <span className={`${styles.selected}`}>{selected.name}</span>
            <div
            className={`${styles.button} bold`}>
                {open ? "-" : "+"}
            </div>
            </div>
        <div className={`${styles.dropdownContainer}`}>
            <ul ref={dropdownRef} className={`${styles.dropdown} ${!open ? styles.hidden : ''} text`}>
            { list && list.map((item) => {
                return (
                    <li key={item?.id} 
                    className={`${styles.item} button ${!item?.available ? styles.unavailable : ''}`}
                    onClick={() => {
                        if (!item.available) {
                            return
                        }
                        setSelected(item)
                        handleClick()
                    }}>{item?.name}</li>
                )
            })}
            </ul>
        </div>
    </div>
  )
}
