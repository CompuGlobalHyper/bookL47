import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import Calendar from '../components/Calendar'
import { CartContext } from '../contexts/CartContext'
import styles from './styles/Book.module.css'
import CartItem from '../components/CartItem'
import Rooms from '../components/Rooms'
import Timeslots from '../components/Timeslots'
import CartInfo from '../components/CartInfo'
import { useOutletContext } from 'react-router'


function findDateObject(list, date) {
    return list.find((item) => item.date === date)
}

function findSlotObject(list, room) {
    if (list.find((item) => item.name === room)) {
        const correctRoom = list.find((item) => item.name === room)
        return correctRoom.filledTimes
    } else {
        return []
    }
}

export default function Book() {
  const { user, setMessage} = useOutletContext()
  const { cart, addToCart, deleteCartItem } = useContext(CartContext)
  const API = import.meta.env.VITE_API_URL
  const firstDate = new Date();
  firstDate.setDate(firstDate.getDate() + 2)

  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState(firstDate)
  const [dateObject, setDateObject] = useState({})
  const [selectedRoom, setSelectedRoom] = useState({})
  const [selectedSlot, setSelectedSlot] = useState({})
  const [bookedSlots, setBookedSlots] = useState([])
  const [availableRooms, setAvailableRooms] = useState([
    { id: 1, name: "Room 1", selected: false, available: true },
    { id: 2, name: "Room 2", selected: false, available: true },
    { id: 3, name: "Room 3", selected: false, available: true },
    { id: 4, name: "Room 4", selected: false, available: true },
    { id: 5, name: "Room 5", selected: false, available: true },
    { id: 6, name: "Room 6", selected: false, available: true },
    { id: 7, name: "Room 7", selected: false, available: true }
  ])
  const [availableSlots, setAvailableSlots] = useState([
          {
              id: 1,
              name: "10:00am - 12:30pm",
              start: '10:00:00',
              end: '12:30:00',
              available: true,
              inCart: false
          },
          {
              id: 2,
              name: "1:00pm - 3:30pm",
              start: '13:00:00',
              end: '15:30:00',
              available: true,
              inCart: false
          },
          {
              id: 3,
              name: "4:00pm - 6:30pm",
              start: '16:00:00',
              end: '18:30:00',
              available: true,
              inCart: false
          },
          {
              id: 4,
              name: "7:00pm - 9:30pm",
              start: '19:00:00',
              end: '21:30:00',
              available: true,
              inCart: false
          },
      ])
  const [dropdown, setDropdown] = useState([
    {
      id: 1,
      name: 'rooms',
      open: false
    },
    {
      id: 2,
      name: 'times',
      open: false
    }
  ])
  useEffect(() => {
      async function setInitial() {
        const res = await fetch(`${API}/calendar`, {
            method: 'GET'
        })
        const data = await res.json()
        console.log('retrieving data...')
        setEvents(data)
        setLoading(false)
      }
      setInitial()
  }, [])
    useEffect(() => {
      if (events.length === 0) return
      let firstDateStr = firstDate.toISOString().split('T')[0]
      let firstDateObject = findDateObject(events, firstDateStr)
      setDateObject(firstDateObject)
    }, [events])

    useEffect(() => {
        if(Object.keys(dateObject).length === 0) return
        console.log(dateObject.rooms)
        console.log(findSlotObject(dateObject.rooms, selectedRoom))
        setBookedSlots(findSlotObject(dateObject.rooms, selectedRoom.name))
        setSelectedSlot({})
      }, [selectedRoom])

    useEffect(() => {
        if (loading) return
        let tempDateObject = events.find((obj) => obj.date === selectedDate)
        setBookedSlots(findSlotObject(tempDateObject.rooms, selectedRoom))
        console.log(bookedSlots)
        setDateObject(tempDateObject)
      }, [selectedDate]);
    // If booked slots, the cart, the date, or the room change, 
    // update available slots.
    useEffect(() => {
        const bookedSlotSet = new Set(bookedSlots.map((time) => time.start));
        console.log(bookedSlotSet)
        const cartSet = new Set(
            cart
            .filter(item =>
                item.date === selectedDate 
                && item.location === selectedRoom.name
            )
            .map((item) => 
                item.start
            ))
        setAvailableSlots((prev) => {
            return prev
            .map((slot) => {
                const isInSlot = bookedSlotSet.has(slot.start);
                const isInCart = cartSet.has(slot.start);
                return {
                    ...slot,
                    selected: false,
                    available: !isInSlot && !isInCart,
                    inCart: isInCart
                }
            })
        })
    }, [bookedSlots, cart]);


    function handleClick() {
      const { firstName, lastName, email } = user
        if (selectedRoom.available && selectedSlot.available) {
            let booking = {
                id: crypto.randomUUID(),
                first_name: firstName || "Phin",
                last_name: lastName || "Crisp",
                email: email || "phineas.crisp@afm47.org",
                date: selectedDate,
                location: selectedRoom.name,
                start: selectedSlot.start,
                end: selectedSlot.end,
                equipmentRequest: [],
                description: ''
            }
            addToCart(booking)
        }
        console.log("hello")
        if (Object.keys(selectedRoom).length === 0) {
          setMessage((prev) => {
              return ({...prev, text: "Please select a room.", error: true})
          })
          setTimeout(() => {
              setMessage((prev) => {
                  return ({...prev, text: "", error: false})
              })
          }, 5000)
        }
        if (Object.keys(selectedSlot).length === 0) {
           setMessage((prev) => {
              return ({...prev, text: "Please select a time.", error: true})
          })
          setTimeout(() => {
              setMessage((prev) => {
                  return ({...prev, text: "", error: false})
              })
          }, 5000)
        }
          
      }
    
    return (
      <div className={styles.body}>
        <div className={styles.main}>
          <div className={`${styles.calendar}`}>
            <Calendar 
            events={events} 
            loading={loading} 
            user={user}
            selectedRoom={selectedRoom}
            firstDate={firstDate}
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            dateObject={dateObject}
            setDateObject={setDateObject}>
            </Calendar>
          </div>
          <div className={`${styles.side}`}>
            <div className={`${styles.note}`}><em>Please note: All bookings must be made 48 hours in advance.</em></div>
            <div className={styles.sideMenus}>
                  <Rooms
                  availableRooms={availableRooms}
                  dropdown={dropdown}
                  setDropdown={setDropdown}
                  selectedRoom={selectedRoom}
                  setSelectedRoom={setSelectedRoom} 
                  ></Rooms>
                  <Timeslots
                  dropdown={dropdown}
                  setDropdown={setDropdown}
                  selectedSlot={selectedSlot}
                  setSelectedSlot={setSelectedSlot}
                  availableSlots={availableSlots}
                  setAvailableSlots={setAvailableSlots}
                  bookedSlots={bookedSlots}
                  user={user}
                  ></Timeslots>
            </div>
            <CartInfo></CartInfo>
            <div className={`${styles.submitButtonContainer}`}>
              <div className={`${styles.submitButton} text medium bold`} onClick={handleClick}><span>Add booking</span></div>
            </div>
          </div>
        </div>
        <div className={`${styles.inCart} medium text`}>Cart:</div>
        <ul>
          { cart.length > 0 ? 
              cart.map((item) => {
                return (
                <li key={item.id}>
                  <CartItem
                    abridged={true}
                    item={item} 
                    active={false} 
                    setActive={(() => {})}>
                  </CartItem>
                </li>
                )
              })
          : <div className={`text thin`}>Your cart is empty.</div> }
        </ul>
      </div>
    )
}
