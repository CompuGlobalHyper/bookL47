import React, { useContext, useEffect, useState } from 'react'
import { Link, useOutletContext } from 'react-router'
import styles from './styles/GuestHome.module.css'
import Register from '../../components/Register'
import setBannerMessage from '../../functions/bannerMessage'
import { UserContext } from '../../contexts/UserContext'
import Login from '../general/Login'
import Loading from '../../components/Loading'

export default function GuestHome() {
  const { setUser } = useContext(UserContext)
  const {setMessage, setViewRegister, viewRegister } = useOutletContext()
  
  return (
    <div className={styles.main}>
       <div className={styles.content}>
          <div className={styles.textContainer}>
            <h1 className={`text large thin`}>Welcome to <em>Book Local 47</em></h1>
            <p className={`text regular`}>This is the home page users will see when they are visiting or have not logged in.</p>
          </div>
          <div className={`${styles.image}`}></div>
        </div>
    </div>
  )
}
