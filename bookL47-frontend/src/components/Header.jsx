import React, { useContext } from 'react'
import { useState } from 'react'
import styles from "./styles/Header.module.css"
import { Link, useOutletContext } from 'react-router'
import { CartContext } from '../contexts/CartContext'

export default function Header( { setUser, user }) {
    const API = import.meta.env.VITE_API_URL

    const { cart } = useContext(CartContext)

    const [viewMenu, setViewMenu] = useState(false)
    const navLinks = {
      guest: [
        { name: "Home", link: "/" },
        { name: "About", link: "/about" },
        { name: "Join Local47", link: "/join" },
        { name: "Code of Conduct", link: "/code-of-conduct" },
      ],

      nonMember: [
        { name: "Home", link: "/" },
        { name: "Join Local47", link: "/join" },
        { name: "Book", link: "/book" },
        { name: "About", link: "/about" },
        { name: "Code of Conduct", link: "/code-of-conduct" },
        { name: "Logout", link: "/" },
      ],

      member: [
        { name: "Home", link: "/" },
        { name: "Book", link: "/book" },
        { name: "Profile", link: "/profile" },
        { name: "About", link: "/about" },
        { name: "Code of Conduct", link: "/code-of-conduct" },
        { name: "Logout", link: "/" },
      ],

      crew: [
        { name: "Home", link: "/" },
        { name: "Events", link: "/events" },
        { name: "Shifts", link: "/shifts" },
        { name: "Logout", link: "/" },
      ],

      admin: [
        { name: "Home", link: "/" },
        { name: "Admin Panel", link: "/admin" },
        { name: "Events", link: "/events" },
        { name: "Shifts", link: "/shifts" },
        { name: "Logout", link: "/" },
      ],
    };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${API}/logout`, {
        method: "GET",
        credentials: 'include'
      });
      console.log(res.status)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className={styles.container}>
        <div className={styles.main}>
            <div className={styles.image}></div>
            <Link to='/' className={`${styles.title} text large bold`} onClick={() => setViewMenu(false)}>{`AFM 47`}</Link>
            {user.role === 'guest' 
            ? <></> 
            : <Link 
                to='/cart'
                className={`${styles.cart} text`}
                onClick={() => setViewMenu(false)}>Cart ({cart.length})</Link>}
            <div 
                className={`${styles.hamburger} text`}
                onClick={() => {
                    setViewMenu(prev => !prev)
                }}>
                { viewMenu ? "Close" : "Menu"}</div>
        </div>
        <div className={`${styles.listContainer}`}>
            <ul className={`text thin ${styles.list} ${viewMenu ? styles.open : styles.hidden}`}>
                {navLinks[user.role].map((link) => {
                    return (
                        <li key={link.name} className={styles.item}>
                            <Link to={link.link}
                            onClick={() => {
                                if (link.name === 'Logout') {
                                  handleLogout()
                                  setUser({role: guest})
                                }
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
