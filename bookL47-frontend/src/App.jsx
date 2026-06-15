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

  }, [])

  return (
    <div className={styles.body}>
      {user.role === 'admin' ? <div className={styles.adminMessage}><span>You are in admin mode</span></div> : <div></div>}
      <Header user={user} setMessage={setMessage}></Header>
      <div className={!message.error ? styles.message : styles.error}>
        <p>{message.text}</p>
      </div>
      <div className={styles.main}>
        <Outlet context={{ user, setLoading, setMessage }}/>
      </div>
      <div className={styles.footer}><Footer/></div>  
    </div>
  )
}

export default App
