import React, { useContext } from 'react'
import { useState, useEffect } from 'react'
import Calendar from '../../components/Calendar'
import { CartContext } from '../../contexts/CartContext'
import styles from './styles/Book.module.css'
import CartItem from '../../components/CartItem'
import Rooms from '../../components/Rooms'
import Timeslots from '../../components/Timeslots'
import CartInfo from '../../components/CartInfo'
import { useOutletContext } from 'react-router'
import generateBookedArray from '../../functions/generateBookedArray'
import generateHourSlots from '../../functions/generateHourSlots'


function findDateObject(list, date) {
    return list.find((item) => item.date === date)
}

function findSlotObject(list, room) {
    if (list.find((item) => item.name === room)) {
        const correctRoom = list.find((item) => item.name === room)
        console.log(correctRoom)
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
  const roomSmallDesc =
  "A professional rehearsal room for up to 8 musicians. Features a Yamaha upright piano and DW Design Series drum kit, making it ideal for solo artists, duos, and small bands.";

  const roomMediumDesc =
  "Designed for groups of up to 15 musicians, this room includes a Yamaha upright piano and DW Design Series drum kit. Perfect for band rehearsals, ensemble practice, and performance preparation.";

  const roomLargeDesc =
  "A rehearsal studio for up to 20 musicians with a Yamaha C3 grand piano and DW drum kit. Suitable for jazz bands, larger ensembles, and professional music rehearsals.";

  const roomXLDesc =
  "The largest rehearsal room accommodates up to 40 musicians and includes a Kawai grand piano and DW Jazz Series drum kit. It is also connected to a recording booth, making it ideal for orchestras, big bands, large ensembles, and professional recording sessions.";

  const [availableRooms, setAvailableRooms] = useState([
    { id: 1, name: "Room 1", selected: false, available: true, description: roomSmallDesc },
    { id: 2, name: "Room 2", selected: false, available: true, description: roomSmallDesc },
    { id: 3, name: "Room 3", selected: false, available: true, description: roomMediumDesc },
    { id: 4, name: "Room 4", selected: false, available: true, description: roomMediumDesc },
    { id: 5, name: "Room 5", selected: false, available: true, description: roomLargeDesc },
    { id: 6, name: "Room 6", selected: false, available: true, description: roomLargeDesc },
    { id: 7, name: "Room 7", selected: false, available: true, description: roomXLDesc }
  ]);
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
  const [availableStarts, setAvailableStarts] = useState(generateHourSlots(10, 20))
  const [availableEnds, setAvailableEnds] = useState(generateHourSlots(11, 21))



  const [selectedStart, setSelectedStart] = useState({})
  const [selectedEnd, setSelectedEnd] = useState({})

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
    },
    {
      id: 3,
      name: 'endTimes',
      open: false
    }
  ])
  useEffect(() => {
      async function setInitial() {
        const res = await fetch(`${API}/calendar`, {
            method: 'GET',
            credentials: "include"
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
        setBookedSlots(findSlotObject(dateObject.rooms, selectedRoom.name))
        setSelectedSlot({})
        setSelectedStart({})
        setSelectedEnd({})
      }, [selectedRoom])

    useEffect(() => {
        if (loading) return
        let tempDateObject = events.find((obj) => obj.date === selectedDate)
        setBookedSlots(findSlotObject(tempDateObject.rooms, selectedRoom))
        console.log(bookedSlots)
        setDateObject(tempDateObject)
      }, [selectedDate]);
    // If booked slots, update available slots.
    useEffect(() => {
        console.log(bookedSlots)
        const bookedSlotSet = new Set(bookedSlots.flatMap(slot => generateBookedArray(slot)));
        console.log(bookedSlotSet)
        const bookedStartSet = new Set(bookedSlots.flatMap(slot => generateBookedArray(slot, 30, 30, true)));
        const bookedEndSet = new Set(bookedSlots.flatMap(slot => generateBookedArray(slot)));
        const cartSet = new Set(
            cart
            .filter(item =>
                item.date === selectedDate 
                && item.location === selectedRoom.name
            )
            .flatMap(slot => generateBookedArray(slot)));
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
        setAvailableStarts((prev) => {
          return prev
          .map((start) => {
            const isInSlot = bookedStartSet.has(start.time)
            const isInCart = cartSet.has(start.time);
            return {
              ...start,
              available: !isInSlot && !isInCart
            }
          })
        })
        setAvailableEnds((prev) => {
          return prev
          .map((start) => {
            const isInSlot = bookedEndSet.has(start.time)
            const isInCart = cartSet.has(start.time);
            return {
              ...start,
              available: !isInSlot && !isInCart
            }
          })
        })
    }, [bookedSlots, cart]);
    useEffect(() => {
      setSelectedEnd({})
      let closestEndTime = Number(selectedStart.time?.split(':')[0]) || 10
      if (selectedStart.time?.split(':')[1] === '30') {
        closestEndTime += 0.5
      }
      if (closestEndTime >= 10) {
        closestEndTime += 1
      }
      if (closestEndTime < 10) {
        closestEndTime += 13
      }
      setAvailableEnds(generateHourSlots(closestEndTime, 21))
    }, [selectedStart])

    function checkSubmit() {
      if (Object.keys(selectedRoom).length === 0) {
        setMessage((prev) => {
            return ({...prev, text: "Please select a room.", error: true})
        })
        setTimeout(() => {
            setMessage((prev) => {
                return ({...prev, text: "", error: false})
            })
        }, 5000)
        return false
      }
      if (user.role === "member") {
        if (Object.keys(selectedSlot).length === 0) {
          setMessage((prev) => {
            return ({...prev, text: "Please select a time.", error: true})
        })
        setTimeout(() => {
            setMessage((prev) => {
                return ({...prev, text: "", error: false})
            })
        }, 5000)
        return false
        }
      } else {
        if (Object.keys(selectedStart).length === 0) {
          setMessage((prev) => {
            return ({...prev, text: "Please select a starting time.", error: true})
        })
        setTimeout(() => {
            setMessage((prev) => {
                return ({...prev, text: "", error: false})
            })
        }, 5000)
        return false
        }
        if (Object.keys(selectedEnd).length === 0) {
            setMessage((prev) => {
              return ({...prev, text: "Please select an ending time.", error: true})
          })
          setTimeout(() => {
              setMessage((prev) => {
                  return ({...prev, text: "", error: false})
              })
          }, 5000)
          return false
        }
      }
      return true  
    }
    
    function handleClick() {
      if (!checkSubmit()) return
      const { firstName, lastName, email } = user
      let start
      let end
      if (user.role === "member") {
        start = selectedSlot.start
        end = selectedSlot.end
      } else {
        start = selectedStart.time
        end = selectedEnd.time
      }
      if (selectedRoom.available && selectedSlot.available
          || selectedRoom.available && selectedStart.available && selectedEnd.available
      ) {
          let booking = {
              id: crypto.randomUUID(),
              first_name: firstName || "Phin",
              last_name: lastName || "Crisp",
              email: email || "phineas.crisp@afm47.org",
              date: selectedDate,
              location: selectedRoom.name,
              start,
              end,
              equipmentRequest: [],
              description: ''
          }
          console.log(booking)
          addToCart(booking)
      }      
    }
    
    return (
      <div className={styles.body}>
        {loading ? <div className={`text medium`}>Loading...</div> 
        : <div className={styles.main}>
            <div className={`${styles.calendar}`}>
              <div className={`${styles.note}`}><em>Note: All bookings must be made <span className='bold'>48 hours</span> in advance.</em></div>
              <Calendar 
              events={events} 
              loading={loading} 
              user={user}
              validRange={() => {
                const start = new Date()
                const end = new Date()
                end.setDate(start.getDate() + 181)
                return {start, end}
              }}
              selectedRoom={selectedRoom}
              firstDate={firstDate}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              dateObject={dateObject}
              setDateObject={setDateObject}>
              </Calendar>
            </div>
            <div className={`${styles.side}`}>
              <div className={styles.sideMenus}>
                    <Rooms
                    availableRooms={availableRooms}
                    dropdown={dropdown}
                    setDropdown={setDropdown}
                    selectedRoom={selectedRoom}
                    setSelectedRoom={setSelectedRoom} 
                    ></Rooms>
                    {user.role === "nonMember" 
                    ? <Timeslots
                    dropdown={dropdown}
                    setDropdown={setDropdown}
                    selectedRoom={selectedRoom}
                    availableStarts={availableStarts}
                    selectedStart={selectedStart}
                    setSelectedStart={setSelectedStart}
                    availableEnds={availableEnds}
                    selectedEnd={selectedEnd}
                    setSelectedEnd={setSelectedEnd}
                    bookedSlots={bookedSlots}
                    user={user}
                    ></Timeslots>
                    : <Timeslots
                    dropdown={dropdown}
                    selectedRoom={selectedRoom}
                    setDropdown={setDropdown}
                    selectedSlot={selectedSlot}
                    setSelectedSlot={setSelectedSlot}
                    availableSlots={availableSlots}
                    setAvailableSlots={setAvailableSlots}
                    bookedSlots={bookedSlots}
                    user={user}
                    ></Timeslots>}
                    
              </div>
              <CartInfo></CartInfo>
              <div className={`${styles.submitButtonContainer}`}>
                <div className={`${styles.submitButton} text medium bold`} onClick={handleClick}><span>Add booking</span></div>
              </div>
            </div>
        </div> } 
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
