import { useState } from 'react'
import Calendar from './components/Calendar'
import Rooms from './components/Rooms'
import Timeslots from './components/Timeslots'
import styles from './App.module.css'

function App() {

  return (
    <div className={styles.body}>
      <div className={styles.main}>
        <Calendar></Calendar>
        <div className={styles.side}>
          <Rooms></Rooms>
          <Timeslots></Timeslots>
        </div>
      </div>
      

    </div>
  )
}

export default App
