import React, { useEffect } from 'react'
import styles from './styles/Loading.module.css'
import { useNavigate } from 'react-router'

export default function Loading() {
  const navigate = useNavigate()

  useEffect(() => {
    const timeout = setTimeout(() => {
      navigate('/error')
    }, 30000)

    return () => clearTimeout(timeout)

  }, [navigate])

  return (
    <div>
      <div className={`text medium bold ${styles.text}`}>Loading...</div>
      <div className={`${styles.loading}`}></div>
      
    </div>
  )
}
