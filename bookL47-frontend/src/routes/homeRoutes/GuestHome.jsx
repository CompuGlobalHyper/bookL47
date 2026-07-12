import React, { useContext, useEffect, useState } from 'react'
import styles from './styles/GuestHome.module.css'
import Register from '../../components/Register'
import setBannerMessage from '../../functions/bannerMessage'
import { UserContext } from '../../contexts/UserContext'
import Login from '../../components/Login'

export default function GuestHome({ setMessage }) {
  const { setUser } = useContext(UserContext)
  const [viewLogin, setViewLogin] = useState(false)
  const [viewRegister, setViewRegister] = useState(false)
  const [formData, setFormData] = useState({
          email: "",
          password: ""
    });
  const [passwordType, setPasswordType] = useState("password");
  const [errors, setErrors] = useState('')
  

  

  return (
    <div className={styles.main}>
      <Register
        viewRegister={viewRegister}
        setViewRegister={setViewRegister}
        setMessage={setMessage}
        setViewLogin={setViewLogin}>
      </Register>
      {!viewLogin 
      ? <div className={styles.content}>
          <div className={styles.textContainer}>
            <h1 className={`text`}>Welcome to Book L47</h1>
            <p className={`text`}>This is the home page users will see when they are visiting or have not logged in.</p>
          </div>
          <div className={`${styles.image} text`}></div>
          <div>
            <div onClick={() => setViewLogin(true)} className={`${styles.registerLink} text link blue`}>Sign in</div>
            <div className={`text`}>First time? <span onClick={() =>  setViewRegister(true)}
              className={`${styles.registerLink} text link blue`}>
                Create an account!
              </span>
            </div>

          </div>
        </div>
      : <Login
        setViewLogin={setViewLogin}
        viewLogin={viewLogin}
        formData={formData}
        setFormData={setFormData}
        setViewRegister={setViewRegister}
        passwordType={passwordType}
        setPasswordType={setPasswordType}
        setMessage={setMessage}></Login>
      }
      
      
    </div>
  )
}
