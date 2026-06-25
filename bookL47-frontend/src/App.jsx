import { useState, useEffect } from 'react'
import { Outlet } from 'react-router'
import styles from './App.module.css'
import Header from './components/Header'
import Footer from './components/Footer'
import getUser from './functions/getUser'

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
      setUser(await getUser())
    }
    loadData()
    setTimeout(() => {
      setLoading(false)
    }, 1000)
    
  }, [])

  return (
    <div className={styles.body}>
      { loading ? <div className={`medium text`}>Loading...</div> 
      : 
      <> {user.role === 'admin' ? <div className={`${styles.adminMessage} text bold medium`}><span>You are in admin mode</span></div> : <div></div>}
      <Header 
        user={user} 
        setUser={setUser}
        setMessage={setMessage}>
      </Header>
      <div className={!message.error ? styles.message : styles.error}>
        <p>{message.text}</p>
      </div>
       <div className={styles.main}>
          <Outlet context={{ user, setUser, loading, setLoading, setMessage }}/>
      </div>
      <div className={styles.footer}><Footer/></div> 
      </>
      } 
    </div>
  )
}

export default App
