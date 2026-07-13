import { useState, useEffect, useContext } from 'react'
import { Outlet, Link } from 'react-router'
import styles from './App.module.css'
import Header from './components/Header'
import Footer from './components/Footer'
import getUser from './functions/getUser'
import { UserContext } from './contexts/UserContext'
import Loading from './components/Loading'

function App() {
  const {user, setUser, loading: userLoading} = useContext(UserContext)
  const [message, setMessage] = useState({
    text: '',
    error: false
  })

  useEffect(() => {
  }, [userLoading])

  if (userLoading) {
    return (
      <Loading></Loading>
    )
  }
  return (
    <div className={styles.body}>
      <> {user?.role === 'admin' ? <div className={`${styles.adminMessage} text bold medium`}><span>You are in admin mode</span></div> : <div></div>}
      <Header 
        setMessage={setMessage}>
      </Header>
      <div className={!message.error ? styles.message : styles.error}>
        <p>{message.text}</p>
      </div>
       <div className={styles.main}>
          <Outlet context={{ setMessage }}/>
      </div>
      <div className={styles.footer}><Footer/></div> 
      </>
       
    </div>
  )
}

export default App
