import { useState, useEffect } from 'react'
import styles from './App.module.css'

function App() {
  const user = "member"
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
      <Header user={user} ></Header>
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
