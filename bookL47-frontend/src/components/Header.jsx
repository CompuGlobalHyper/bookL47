import React, { useContext } from 'react'
import { useState } from 'react'
import styles from "./styles/Header.module.css"
import { Link, useOutletContext } from 'react-router'
import { CartContext } from '../contexts/CartContext'
import setBannerMessage from '../functions/bannerMessage'
import { UserContext } from '../contexts/UserContext'

export default function Header( { setMessage }) {
    const API = import.meta.env.VITE_API_URL
    const { user, setUser } = useContext(UserContext)
    const { cart } = useContext(CartContext)

    const [viewMenu, setViewMenu] = useState(false)
    const navLinks = {
  guest: [
    { name: "Home", link: "/" },
    { name: "Book a Room", link: "/rooms" },
    { name: "Join Local 47", link: "/join-L47" },
    { name: "About", link: "/about" },
    { name: "Code of Conduct", link: "/code-of-conduct" },
    { name: "Login", link: "/login" },
  ],

  nonMember: [
    { name: "Home", link: "/" },,
    { name: "Book a Room", link: "/book" },
    { name: "Join Local 47", link: "/join" },
    { name: "My Bookings", link: "/bookings" },
    { name: "Profile", link: "/profile" },
    { name: "Code of Conduct", link: "/code-of-conduct" },
    { name: "Logout", link: "/" },
  ],

  member: [
    { name: "Home", link: "/" },
    { name: "Book a Room", link: "/book" },
    { name: "My Bookings", link: "/bookings" },,
    { name: "Profile", link: "/profile" },
    { name: "Logout", link: "/" },
  ],

  life: [
    { name: "Home", link: "/" },
    { name: "Book a Room", link: "/book" },
    { name: "My Bookings", link: "/bookings" },,
    { name: "Profile", link: "/profile" },
    { name: "Logout", link: "/" },
  ],

  crew: [
    { name: "Home", link: "/" },
    { name: "Events", link: "/events" },
    { name: "Shifts", link: "/shifts" },
    { name: "Profile", link: "/profile" },
    { name: "Logout", link: "/" },
  ],

  admin: [
    { name: "Home", link: "/" },
    { name: "Admin Panel", link: "/admin" },
    { name: "Manage Bookings", link: "/admin/bookings" },
    { name: "Rooms", link: "/admin/rooms" },
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
      const data = await res.json()
      setUser(data)
      setBannerMessage(setMessage, "Successfully signed out", false, 5)
    } catch (error) {
      console.log(error)
      console.log('Failed to log out')
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
                className={`${styles.cart} text bold`}
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
                                  setUser({ role: guest })
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
