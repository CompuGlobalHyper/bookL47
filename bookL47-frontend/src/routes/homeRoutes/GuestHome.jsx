import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router'
import styles from './styles/GuestHome.module.css'
import Register from '../../components/Register'
import setBannerMessage from '../../functions/bannerMessage'
import { UserContext } from '../../contexts/UserContext'
import Login from '../general/Login'
import Loading from '../../components/Loading'

export default function GuestHome({ setMessage }) {
  const { setUser } = useContext(UserContext)
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
        setMessage={setMessage}>
      </Register>
       <div className={styles.content}>
          <div className={styles.textContainer}>
            <h1 className={`text`}>Welcome to Book L47</h1>
            <p className={`text`}>This is the home page users will see when they are visiting or have not logged in.</p>
          </div>
          <div className={`${styles.image} text`}></div>
          <div>
            <Link to={'/login'}className={`${styles.registerLink} text link blue`}>Sign in</Link>
            <div className={`text`}>First time? <span onClick={() =>  setViewRegister(true)}
              className={`${styles.registerLink} text link`}>
                Create an account!
              </span>
            </div>

          </div>
        </div>
    </div>
  )
}
