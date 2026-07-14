import { useState, useEffect, useContext } from 'react'
import { Outlet, Link, useLocation } from 'react-router'
import styles from './App.module.css'
import Header from './components/Header'
import Footer from './components/Footer'
import getUser from './functions/getUser'
import { UserContext } from './contexts/UserContext'
import Loading from './components/Loading'
import ScrollToTop from './components/ScrollToTop'

function App() {
  const location = useLocation();
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
      <div className={`${styles.messageContainer} text regular`}>
        <p className={`
          ${styles.message} 
          ${message.text.length > 0 ? styles.visible : ''}
          ${!message.error ? styles.notif : styles.error}
          `}><span>{message.text}</span></p>
      </div>
      <ScrollToTop></ScrollToTop>
       <div className={styles.main} key={location.pathname}>
          <Outlet context={{ setMessage }}/>
      </div>
      <div className={styles.footer}><Footer/></div> 
      </>
       
    </div>
  )
}

export default App
