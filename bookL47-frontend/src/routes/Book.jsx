import React from 'react'
import Calendar from '../components/Calendar'

export default function Book() {
  return (
    <div className={styles.body}>
      <div className={styles.main}>
        <Calendar events={events} loading={loading}></Calendar>
      </div>
    </div>
  )
}
