import React from 'react'
import styles from "./styles/Header.module.css"
import { Link } from 'react-router'

export default function Header({ user }) {
    const role = user?.role || "member";

  const links = {
    guest: ["Home", "About", "Join Local47", "Code of Conduct"],
    nonmember: ["Home", "Join Local47", "Book", "About", "Code of Conduct", "Logout"],
    member: ["Home", "Book", "Profile", "About", "Code of Conduct", "Logout"],
    crew: ["Home", "Events", "Shifts", "Logout"],
    admin: ["Home", "Admin Panel", "Events", "Shifts", "Logout"],
  };
  return (
    <div className={styles.container}>
        <div className={styles.main}>
            <h1 className={styles.image}>{`{image goes here}`}</h1>
        </div>
        <div className={styles.listContainer}>
            <ul className={styles.list}>
                {links[role].map((link) => {
                    return (
                        <li key={link} className={styles.item}>
                            <Link to={`/${link.toLowerCase()}`}>{link}</Link>
                        </li>
                    )
                })}
            </ul>
        </div>
    </div>
  )
}
