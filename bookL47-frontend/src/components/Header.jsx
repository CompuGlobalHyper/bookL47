import React, { useContext } from 'react'
import { useState } from 'react'
import styles from "./styles/Header.module.css"
import { Link, useOutletContext } from 'react-router'
import { CartContext } from '../contexts/CartContext'
import setBannerMessage from '../functions/bannerMessage'
import { UserContext } from '../contexts/UserContext'
import MenuIcon from '../assets/menu.svg?react'
import CalendarIcon from '../assets/calendar.svg?react'
import ChecklistIcon from '../assets/checklist.svg?react'
import MusicIcon from '../assets/music.svg?react'
import HomeIcon from '../assets/home.svg?react'
import InfoCircleIcon from '../assets/infoCircle.svg?react'
import UserIcon from '../assets/user.svg?react'
import DashboardIcon from '../assets/dashboard.svg?react'
import CalendarEventIcon from '../assets/calendarEvent.svg?react'
import ShiftsIcon from '../assets/shifts.svg?react'
import LogoutIcon from '../assets/logout.svg?react'



export default function Header( { setMessage }) {
    const API = import.meta.env.VITE_API_URL
    const { user, setUser } = useContext(UserContext)
    const { cart } = useContext(CartContext)

    const [viewMenu, setViewMenu] = useState(false)
    const navLinks = {
      guest: [
        { name: "Home", link: "/", icon: HomeIcon },
        { name: "Book a Room", link: "/rooms", icon: CalendarIcon },
        { name: "Join Local 47", link: "/join-L47", icon: MusicIcon },
        { name: "About", link: "/about", icon: InfoCircleIcon },
        { name: "Code of Conduct", link: "/code-of-conduct", icon: ChecklistIcon },
      ],

      nonMember: [
        { name: "Home", link: "/", icon: HomeIcon },
        { name: "Book a Room", link: "/book", icon: CalendarIcon },
        { name: "Join Local 47", link: "/join-L47", icon: MusicIcon },
        { name: "My Bookings", link: "/bookings", icon: CalendarEventIcon },
        { name: "Profile", link: "/profile", icon: UserIcon },
        { name: "Code of Conduct", link: "/code-of-conduct", icon: ChecklistIcon },
        { name: "Logout", link: "/", icon: LogoutIcon },
      ],

      member: [
        { name: "Home", link: "/", icon: HomeIcon },
        { name: "Book a Room", link: "/book", icon: CalendarIcon },
        { name: "My Bookings", link: "/bookings", icon: CalendarEventIcon },
        { name: "Profile", link: "/profile", icon: UserIcon },
        { name: "Logout", link: "/", icon: LogoutIcon },
      ],

      life: [
        { name: "Home", link: "/", icon: HomeIcon },
        { name: "Book a Room", link: "/book", icon: CalendarIcon },
        { name: "My Bookings", link: "/bookings", icon: CalendarEventIcon },
        { name: "Profile", link: "/profile", icon: UserIcon },
        { name: "Logout", link: "/", icon: LogoutIcon },
      ],

      crew: [
        { name: "Home", link: "/", icon: HomeIcon },
        { name: "Events", link: "/events", icon: CalendarEventIcon },
        { name: "Shifts", link: "/shifts", icon: ShiftsIcon },
        { name: "Profile", link: "/profile", icon: UserIcon },
        { name: "Logout", link: "/", icon: LogoutIcon },
      ],

      admin: [
        { name: "Home", link: "/", icon: HomeIcon },
        { name: "Admin Panel", link: "/admin", icon: DashboardIcon },
        { name: "Create Bookings", link: "/admin/bookings", icon: CalendarIcon },
        { name: "Events", link: "/events", icon: CalendarEventIcon },
        { name: "Shifts", link: "/shifts", icon: ShiftsIcon },
        { name: "Logout", link: "/", icon: LogoutIcon },
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
                { viewMenu ? <MenuIcon className={`${styles.menuOpen} ${styles.icon}`} alt='hamburger menu icon'/> : <MenuIcon className={`${styles.menuClose} ${styles.icon}`} alt='hamburger menu icon'/>}</div>
        </div>
        <div className={`${styles.listContainer}`}>
            <ul className={`text regular ${styles.list} ${viewMenu ? styles.open : styles.hidden}`}>
                {navLinks[user.role].map((link) => {
                    return (
                        <li key={link.name} className={styles.item}>
                          <link.icon src={link.icon} alt='' className={`${styles.icon} text`}/>
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
