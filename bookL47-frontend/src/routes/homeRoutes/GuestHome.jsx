import React, { useState } from 'react'
import styles from './styles/GuestHome.module.css'
import Register from '../../components/Register'

export default function GuestHome() {
  const [viewLogin, setViewLogin] = useState(false)
  const [viewRegister, setViewRegister] = useState(false)
  const [homeMessage, setHomeMessage] = useState('')

  return (
    <div className={styles.main}>
      <div className={styles.message}></div>
      <Register
        viewRegister={viewRegister}
        setViewRegister={setViewRegister}
        setHomeMessage={setHomeMessage}>
      </Register>
      <div className={styles.content}>
        <div>Welcome to BookL47</div>
        <div>Image goes here</div>

      </div>
      <div className={styles.mainFormContainer}>
          <div className={styles.loginContainer}>
            <form></form>
          <div onClick={() => {
            setViewRegister(true)
          }}>Create an account</div>
          </div>
      </div>
    </div>
  )
}
