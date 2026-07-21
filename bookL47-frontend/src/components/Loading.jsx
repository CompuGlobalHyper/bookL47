import React, { useEffect, useState } from 'react'
import styles from './styles/Loading.module.css'
import { useNavigate } from 'react-router'

export default function Loading() {
  const navigate = useNavigate()
  const [loadingMessage, setLoadingMessage] = useState('Loading...')

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoadingMessage('App restarting, please wait...')
    }, 30000)

    const error = setTimeout(() => {
      navigate('/error')
    }, 60000)

    return () => {
      clearTimeout(timeout)
      clearTimeout(error)
    }

  }, [navigate])

  return (
    <div className={styles.container}>
      <div className={`text medium bold ${styles.text}`}>{loadingMessage}
        <div className={`${styles.loading}`}></div>
      </div>
      
      
    </div>
  )
}
