import { useState, useEffect } from 'react'
import { Outlet } from 'react-router'
import styles from './App.module.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [user, setUser] = useState({
    role: 'guest'
  })
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({
    text: '',
    error: false
  })

  useEffect(() => {
    const loadData = async () => {
      const API = import.meta.env.VITE_API_URL
      try {
        const res = await fetch(`${API}/api/me`, {
        method: "GET",
        credentials: "include"
        }
      )
      const data = await res.json()
      console.log(data)
      if (data.auth === true) {
        setUser(data)
      } else {
        setUser({role: "guest"})
      }
      } catch(error) {
        console.log(error)
      }
    }
    loadData()
  }, [])

  return (
    <div className={styles.body}>
      {user.role === 'admin' ? <div className={`${styles.adminMessage} text bold medium`}><span>You are in admin mode</span></div> : <div></div>}
      <Header user={user} setMessage={setMessage}></Header>
      <div className={!message.error ? styles.message : styles.error}>
        <p>{message.text}</p>
      </div>
      <div className={styles.main}>
        <Outlet context={{ user, setUser, loading, setLoading, setMessage }}/>
      </div>
      <div className={styles.footer}><Footer/></div>  
    </div>
  )
}

export default App
