import React from 'react'
import styles from './styles/Loading.module.css'

export default function Loading() {
  return (
    <div>
      <div className={`text medium bold ${styles.text}`}>Loading...</div>
      <div className={`${styles.loading}`}></div>
      
    </div>
  )
}
