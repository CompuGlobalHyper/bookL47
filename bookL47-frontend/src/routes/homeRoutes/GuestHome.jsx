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
      <Register
        viewRegister={viewRegister}
        setViewRegister={setViewRegister}
        setMessage={setMessage}>
      </Register>
       <div className={styles.content}>
          <div className={styles.textContainer}>
            <h1 className={`text large thin`}>Practice and Rehearse @ <em>Local 47!</em></h1>
            <p className={`text medium paragraph`}>Comfortable, affordable practice and rehearsal spaces for musicians of all kinds — from solo practice sessions to large orchestras.</p>
            <div className={styles.listContainer}>
              <div>
                <h2 className='paragraph text medium bold' style={{borderBottom: '0.5px solid black'}}>Find the Right Space</h2>
                  <p className='text regular paragraph '> Whether you're practicing alone, teaching a lesson, rehearsing with a band, or preparing a full orchestral program, AFM Local 47 has a room for you.</p>
                  <p className='text small bold paragraph '>Small Rooms</p>
                  <p className='text small  '>Perfect for individual practice, private lessons, and small groups.</p>
                  <p className='text small bold paragraph '>Medium Rooms</p>
                  <p className='text small '>More space for ensembles, bands, and larger rehearsals.</p>
                  <p className='text small bold paragraph '>Large Rooms</p>
                  <p className='text small '>Room to spread out and rehearse with larger groups. Great for big bands.</p>
                  <p className='text small bold paragraph '>Orchestra Room</p>
                  <p className='text small  '>Our newly renovated space accommodates ensembles of up to 55 musicians.</p>
              </div>
              <div>
                <h2 className='paragraph text medium bold' style={{borderBottom: '0.5px solid black'}}>Everything You Need</h2>
                <p className='text regular paragraph '>Our rehearsal rooms are equipped to keep you focused on the music.</p>
                <p className='text regular bold paragraph'>- Sound treated rooms</p>
                <p className='text regular bold paragraph'>- Tuned pianos</p>
                <p className='text regular bold paragraph'>- Drum kits</p>
                <p className='text regular bold paragraph'>- Bass and Guitar Amps</p>
                <p className='text regular bold paragraph'>- PA systems and Microphones</p>
                <p className='text regular bold paragraph'>- Central heating and cooling</p>
              </div>
            </div>
            <h2 className='paragraph text medium bold' style={{borderBottom: '0.5px solid black'}}>Ready to Rehearse?</h2>
              <p className='text regular paragraph bold'>To book, <span className='link blue' onClick={() => setViewRegister(true)}>create a free account</span> and verify your email with us.</p>

            
          </div>
          <div className={`${styles.image}`}></div>
        </div>
    </div>
  )
}
