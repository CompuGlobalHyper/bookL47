import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar'
import { CartContext } from '../contexts/CartContext'
import styles from './styles/Book.module.css'
import CartItem from '../components/CartItem'

export default function Book(user) {
    const { cart } = useContext(CartContext)
    const API = import.meta.env.VITE_API_URL
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function fetchEvents() {
        const res = await fetch(`${API}/calendar`, {
            method: 'GET'
        })
        console.log('retrieving data...')
        const data = await res.json()
        setEvents(data)
        setLoading(false)
        }
        fetchEvents()
    }, [])
    return (
    <div className={styles.body}>
      <div className={styles.main}>
        <Calendar events={events} loading={loading} user={user}></Calendar>
      </div>
      <div className={`${styles.inCart} medium text`}>Cart:</div>
      <ul>
        { cart.length > 0 ? 
            cart.map((item) => {
              return (
              <li key={item.id}>
                <CartItem
                  abridged={true}
                  item={item} 
                  active={false} 
                  setActive={(() => {})}>
                </CartItem>
              </li>
              )
            })
        : <div className={`text thin`}>It looks like your cart is empty</div> }
      </ul>
    </div>
  )
}
