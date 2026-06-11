import React, { useState } from 'react'
import styles from './styles/GuestHome.module.css'
import Register from '../../components/Register'

export default function GuestHome() {
  const [viewLogin, setViewLogin] = useState(false)
  const [viewRegister, setViewRegister] = useState(false)
  const [homeMessage, setHomeMessage] = useState('')

  return (
    <div className={styles.main}>
      <div className={styles.message}>{homeMessage}</div>
      <Register
        viewRegister={viewRegister}
        setViewRegister={setViewRegister}
        setHomeMessage={setHomeMessage}
        setViewLogin={setViewLogin}>
      </Register>
      {!viewLogin 
      ? <div className={styles.content}>
          <div className={styles.textContainer}>
            <h1>Welcome to BookL47</h1>
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Pariatur, quos?</p>
          </div>
          <div>Image goes here</div>
          <div>
            <div onClick={() => setViewLogin(true)}>Sign in</div>
            <div>First time? <span onClick={() =>  setViewRegister(true)}>Create an account!</span></div>

          </div>
        </div>
      : <div className={styles.mainFormContainer}>
          <div className={styles.loginContainer}>
            <p onClick={() => setViewLogin(false)}>Back</p>
            <form></form>
          <div onClick={() => {
            setViewRegister(true)
          }}>Create an account</div>
          </div>
        </div>
      }
      
      
    </div>
  )
}
