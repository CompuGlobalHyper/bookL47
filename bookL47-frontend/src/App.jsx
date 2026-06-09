import { useState, useEffect } from 'react'
import { Outlet } from 'react-router'
import styles from './App.module.css'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  const user = { role: "member" }

  return (
    <div className={styles.body}>
      <Header user={user} ></Header>
      <Outlet context={user}/>
      <Footer />
    </div>
  )
}

export default App
