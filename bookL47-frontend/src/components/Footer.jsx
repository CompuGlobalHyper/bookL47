import React from 'react'
import styles from './styles/Footer.module.css'

export default function Footer() {
  return (
    <div className={styles.container}>
      <p className={`small ${styles.text} text`}>© American Federation of Musicians, Local 47</p>
    </div>
  )
}
