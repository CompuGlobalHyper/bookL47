import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from './styles/Bookings.module.css'
import Loading from '../../components/Loading'
import { formatDate, formatTime } from '../../functions/formatter'
import Modal from '../../components/Modal'
import setBannerMessage from '../../functions/bannerMessage'
import { useOutlet, useOutletContext } from 'react-router'

function getTotalPages(count, perPage = 5) {
  return Math.ceil(count / perPage)

}
export default function Bookings() {
  const API = import.meta.env.VITE_API_URL
  const { user } = useContext(UserContext)
  const { setMessage } = useOutletContext()
  const currentDate = new Date()
  const [viewPast, setViewPast] = useState(false)
  const [upcomingPage, setUpcomingPage] = useState(1)
  const [pastPage, setPastPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingNewData, setLoadingNewData] = useState(false)
  const [active, setActive] = useState({})
  const [showCancel, setShowCancel] = useState(false)
  
  
  async function fetchBookings() {
    const res = await fetch(`${API}/bookings?upcomingPage=${upcomingPage}&pastPage=${pastPage}&amount=5`, {
      method: "GET",
      credentials: "include"   
    })
    const data = await res.json()
    return data
  }
  
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: []
  })

  async function load() {
      if (loading) {
        setLoading(true);
      } else {
        setLoadingNewData(true);
      }

    const bookings = await fetchBookings();
    setBookings(bookings);
    setLoading(false);
    setLoadingNewData(false);
  }

  async function handleCancel(id) {
    const res = await fetch(`${API}/cancel`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({id})
      })
    const { message } = await res.json()
    load()
    setActive({})
    setBannerMessage(setMessage, message, false, 5)
    setShowCancel(false)
  }
  
  useEffect(() => {
    load()
  }, [upcomingPage, pastPage])


  if (loading) {
    return <Loading></Loading>
  }

  return (
    <div>
      <div className={`${styles.bookingsContainer}`}>
        <div className={`${styles.title} text large link`} onClick={() => setViewPast(false)}><span>Upcoming Bookings</span></div>
        { !viewPast 
        ? <>
        { loadingNewData
        ? <Loading></Loading>
        : <>
          { bookings.upcoming.length > 0
          ? <ul>
            {bookings.upcoming.map((item) => {
              return (
                <li key={item.id} className={`${styles.container} ${item.status === 'cancelled' ? styles.disabled : ''}`}>
                  <div className={`${styles.date} text medium`}>{formatDate(item.date)} {item.status === 'cancelled' ? <em className='text medium'>(Cancelled)</em> : ''}</div>
                  <div className={`${styles.time} text regular`}>{`${formatTime(item.start)} - ${formatTime(item.end)}`}</div>
                  <div className={`${styles.room} text small`}>{item.location}</div>
                  <span className={`text regular ${styles.details}`} onClick={() => setActive(item)}> {active.id !== item.id ? 'Details' : ''}</span>
                  { active.id === item.id 
                  && <>
                    <div className={`${styles.options} text regular`}>
                        <div className={styles.equipment}><div className='text small'>{item.equipment_request.join(', ')}</div></div>
                        <div className={`${styles.cancel} text regular button`} onClick={() => setShowCancel(true)}>Cancel</div>
                      </div>
                  </>
                    
                  }
                </li>
              )
            })}
          </ul>
          : <div className='text'>You have no upcoming bookings.</div> }
          { bookings.upcomingCount > 5 
            && <div className={`${styles.pageContainer} text`}>
                <div className={`link ${upcomingPage === 1 ? styles.disabled : ''}`} onClick={() => setUpcomingPage(prev => prev - 1)}>Previous</div>
                <div>Page {upcomingPage} of {getTotalPages(bookings.upcomingCount)}</div>
                <div className={`link ${upcomingPage === getTotalPages(bookings.upcomingCount) ? styles.disabled : ''}`} onClick={() => setUpcomingPage(prev => prev + 1)}>Next</div>
              </div> }
        </>
        } </>
        : <></>}
      </div>
      <div className={`${styles.pastContainer}`}>
        <div className={`${styles.title} text large link`} onClick={() => setViewPast(true)}><span>Past Bookings</span></div>
        { viewPast 
        ? <>
        { loadingNewData
        ? <Loading></Loading>
        : <>
          { bookings.past.length > 0
          ? <ul>
            {bookings.past.map((item) => {
              return (
                <li></li>
              )
            })}
          </ul>
          : <div className='text '>You have no past bookings.</div> }
          { bookings.pastCount > 5 
          && <div className={`${styles.pageContainer} text`}>
              <div className={` link ${pastPage === 1 ? styles.disabled : ''}`} onClick={() => setPastPage(prev => prev - 1)}>Previous</div>
              <div>Page {pastpage} of {getTotalPages(bookings.pastCount)}</div>
              <div className={` link ${pastpage === getTotalPages(bookings.pastCount) ? styles.disabled : ''}`} onClick={() => setPastPage(prev => prev + 1)}>Next</div>
            </div> }
        </>
        }
          </> 
        : <></>}
        
      </div>
      <Modal open={showCancel} onClose={() => setShowCancel(false)}>
        <div className={styles.modalContainer}>
          <div className={`${styles.question} text regular bold`}>Are you sure you want to cancel:</div>
          <div className={`${styles.date} text regular`}>{formatDate(active?.date)}</div>
          <div className={`${styles.time} text regular`}>{`${formatTime(active?.start)} - ${formatTime(active?.end)}`}</div>
          <div className={`${styles.room} text small`}>{active?.location}</div>
          <div className={`${styles.modalOptions}`}>
            <div className={`${styles.confirmCancel} button text bold`} onClick={() => handleCancel(active.id)}>Cancel</div>
            <div className={`${styles.nevermind} button text`} onClick={() => setShowCancel(false)}>Back</div>
          </div>
          <div className={`${styles.note} text small`}><em>Note: Bookings cancelled with less than 48 hours notice will <span className='bold'>not</span> be refunded.</em></div>
          </div>
      </Modal>
    </div>
  )
}
