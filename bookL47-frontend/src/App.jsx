import { useState, useEffect } from 'react'
import { Outlet } from 'react-router'
import styles from './App.module.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const [loading, setLoading] = useState(true)
  const user = { role: "guest" }

  return (
    <div className={styles.body}>
      <Header user={user} ></Header>
      <div className={styles.main}>
        <Outlet context={{ user, setLoading }}/>
      </div>
      <div className={styles.footer}><Footer/></div>  
    </div>
  )
}

export default App
