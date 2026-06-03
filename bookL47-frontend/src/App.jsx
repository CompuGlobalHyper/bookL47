import { useState } from 'react'
import Calendar from './components/Calendar'
import Rooms from './components/Rooms'
import styles from './App.module.css'

function App() {

  return (
    <div className={styles.container}>
      <Rooms></Rooms>
      <Calendar></Calendar>
    </div>
  )
}

export default App
