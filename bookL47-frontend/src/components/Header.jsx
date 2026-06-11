import React from 'react'
import { useState } from 'react'
import styles from "./styles/Header.module.css"
import { Link, useOutletContext } from 'react-router'

export default function Header( { user }) {
    const [viewMenu, setViewMenu] = useState(false)
    const navLinks = {
  guest: [
    { name: "Home", link: "/" },
    { name: "About", link: "/about" },
    { name: "Join Local47", link: "/join" },
    { name: "Code of Conduct", link: "/code-of-conduct" },
  ],

  nonmember: [
    { name: "Home", link: "/" },
    { name: "Join Local47", link: "/join" },
    { name: "Book", link: "/book" },
    { name: "About", link: "/about" },
    { name: "Code of Conduct", link: "/code-of-conduct" },
    { name: "Logout", link: "/logout" },
  ],

  member: [
    { name: "Home", link: "/" },
    { name: "Book", link: "/book" },
    { name: "Profile", link: "/profile" },
    { name: "About", link: "/about" },
    { name: "Code of Conduct", link: "/code-of-conduct" },
    { name: "Logout", link: "/logout" },
  ],

  crew: [
    { name: "Home", link: "/" },
    { name: "Events", link: "/events" },
    { name: "Shifts", link: "/shifts" },
    { name: "Logout", link: "/logout" },
  ],

  admin: [
    { name: "Home", link: "/" },
    { name: "Admin Panel", link: "/admin" },
    { name: "Events", link: "/events" },
    { name: "Shifts", link: "/shifts" },
    { name: "Logout", link: "/logout" },
  ],
    };

  return (
    <div className={styles.container}>
        <div className={styles.main}>
            <div className={styles.image}></div>
            <h1 className={styles.title}>{`AFM 47`}</h1>
            <div 
                className={styles.hamburger}
                onClick={() => {
                    setViewMenu(prev => !prev)
                }}>
                { viewMenu ? "Close" : "Menu"}</div>
        </div>
        <div className={`${styles.listContainer}`}>
            <ul className={`${styles.list} ${viewMenu ? styles.open : styles.hidden}`}>
                {navLinks[user.role].map((link) => {
                    return (
                        <li key={link.link} className={styles.item}>
                            <Link to={link.link}
                            onClick={() => {
                                setViewMenu(false)
                            }}>{link.name}</Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    </div>
  )
}
