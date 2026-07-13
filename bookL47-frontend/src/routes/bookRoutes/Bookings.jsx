import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import styles from './styles/Bookings.module.css'
import Loading from '../../components/Loading'
import { formatDate, formatTime } from '../../functions/formatter'
import Modal from '../../components/Modal'

function getTotalPages(array, perPage = 5) {
  return Math.ceiling(array / perPage)

}
export default function Bookings() {
  const API = import.meta.env.VITE_API_URL
  const { user } = useContext(UserContext)
  const currentDate = new Date()
  const [viewPast, setViewPast] = useState(false)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [loadingNewData, setLoadingNewData] = useState(false)
  const [active, setActive] = useState({})
  const [showCancel, setShowCancel] = useState(false)
  
  
  async function fetchBookings(page) {
    const res = await fetch(`${API}/bookings?page=${page}&amount=5`, {
      method: "GET",
      credentials: "include"   
    })
    const data = await res.json()
    console.log(data)
    return data
  }
  
  const [bookings, setBookings] = useState({
    upcoming: [],
    past: []
  })

  async function handleCancel() {

  }
  
  useEffect(() => {
    async function init() {
      const bookings = await fetchBookings(1)
      setBookings({upcoming: bookings.upcoming, past: bookings.past})
      setLoading(false)
    }
    init()
    
  }, [])

  useEffect(() => {
    async function getNewData() {
      const bookings = await fetchBookings(page)
      setBookings({upcoming: bookings.upcoming, past: bookings.past})
    }
    setLoadingNewData(true)
    getNewData()
    setLoadingNewData(false)

  }, [page])
  useEffect(() => {
    setPage(1)
  }, [viewPast])

  if (loading) {
    return <Loading></Loading>
  }

  return (
    <div>
      <div className={`${styles.bookingsContainer}`}>
        <div className={`${styles.title} text large`} onClick={() => setViewPast(false)}><span>Upcoming Bookings</span></div>
        { !viewPast 
        ? <>
        { loadingNewData
        ? <Loading></Loading>
        : <>
          { bookings.upcoming.length > 0 
          ? <ul>
            {bookings.upcoming.map((item) => {
              return (
                <li key={item.id} className={`${styles.container}`}>
                  <div className={`${styles.date} text medium`}>{formatDate(item.date)}</div>
                  <div className={`${styles.time} text regular`}>{`${formatTime(item.start)} - ${formatTime(item.end)}`}</div>
                  <div className={`${styles.room} text small`}>{item.location}</div>
                  <span className={`text regular `} onClick={() => setActive(item)}> {active.id !== item.id ? 'Details' : ''}</span>
                  { active.id === item.id && 
                    <div className={`${styles.options} text regular`}>
                      <div className={`${styles.edit} text regular button`}>Edit</div>
                      <div className={`${styles.cancel} text regular button`} onClick={() => setShowCancel(true)}>Cancel</div>
                    </div>
                  }
                </li>
              )
            })}
          </ul>
          : <div>You have no upcoming bookings</div> }
          { bookings.upcoming.length > 5 
            && <div className={`${styles.pageContainer}`}>
                <div className={`${page === 1 ? 'hiddenOpacity': ''}`} onClick={() => setPage(prev => prev - 1)}>Previous</div>
                <div>Page {page} of {getTotalPages(bookings.upcoming)}</div>
                <div className={`${page === getTotalPages(bookings.upcoming) ? 'hiddenOpacity': ''}`} onClick={() => setPage(prev => prev + 1)}>Next</div>
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
          : <div className='text '>You have no past bookings</div> }
          { bookings.past.length > 5 
          && <div className={`${styles.pageContainer}`}>
              <div className={`${page === 1 ? 'hiddenOpacity': ''}`} onClick={() => setPage(prev => prev - 1)}>Previous</div>
              <div>Page {page} of {getTotalPages(bookings.past)}</div>
              <div className={`${page === getTotalPages(bookings.past) ? 'hiddenOpacity': ''}`} onClick={() => setPage(prev => prev + 1)}>Next</div>
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
            <div className={`${styles.nevermind} button text`} onClick={() => setShowCancel(false)}>Nevermind</div>
            <div className={`${styles.cancel} button text bold`}>Cancel</div>
          </div>
          <div className={`${styles.note} text small`}><em>Note: Bookings cancelled with less than 48 hours notice will <span className='bold'>not</span> be refunded.</em></div>
          </div>
      </Modal>
    </div>
  )
}
