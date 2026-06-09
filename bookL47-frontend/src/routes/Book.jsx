import React from 'react'
import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar'
import styles from './styles/Book.module.css'

export default function Book() {
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
        <Calendar events={events} loading={loading}></Calendar>
      </div>
    </div>
  )
}
