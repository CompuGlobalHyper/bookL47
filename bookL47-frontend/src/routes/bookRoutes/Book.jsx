import React, { use, useContext } from 'react'
import { useState, useEffect } from 'react'
import Calendar from '../../components/Calendar'
import { CartContext } from '../../contexts/CartContext'
import { UserContext } from '../../contexts/UserContext'
import styles from './styles/Book.module.css'
import CartItem from '../../components/CartItem'
import Rooms from '../../components/Rooms'
import Timeslots from '../../components/Timeslots'
import CartInfo from '../../components/CartInfo'
import { useOutletContext } from 'react-router'
import generateBookedArray from '../../functions/generateBookedArray'
import generateHourSlots from '../../functions/generateHourSlots'
import generateHourlyPrice from '../../functions/generateHourlyPrice'
import setBannerMessage from '../../functions/bannerMessage'
import generateRoomList from '../../functions/generateRoomList'
import Loading from '../../components/Loading'
import { Link } from 'react-router'
import ChevronUpIcon from '../../assets/chevronUp.svg?react'
import ChevronDownIcon from '../../assets/chevronDown.svg?react'

import { fromZonedTime } from "date-fns-tz"


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
  const { setMessage} = useOutletContext()
  const { user, loading: userLoading } = useContext(UserContext)



  const { cart, loading: cartLoading, addToCart, deleteCartItem } = useContext(CartContext)
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


  const [availableRooms, setAvailableRooms] = useState([]);
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

  const [equipment, setEquipment] = useState([
    {
      name: "PA System and Microphone",
      id: "paAndMic",
      selected: false
    },
    {
      name: "Bass Amp",
      id: "bassAmp",
      selected: false
    },
    {
      name: "Guitar Amp",
      id: "guitarAmp",
      selected: false
    },
    {
      name: "Keyboard Amp",
      id: "keyboardAmp",
      selected: false
    },
    {
      name: "Vibraphone",
      id: "vibes",
      selected: false
    },
  ])
  const [description, setDescription] = useState('')

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

  const [showBackline, setShowBackline] = useState(false)

  const [viewCart, setViewCart] = useState(false)

  function checkAllSelected() {
    if (Object.keys(selectedRoom).length > 0
    && Object.keys(selectedSlot).length > 0) {
      return true
    }
    if (Object.keys(selectedRoom).length > 0
    && Object.keys(selectedStart).length > 0
    && Object.keys(selectedEnd).length > 0) {
      return true
    }
    return false
  }
  useEffect(() => {
      if (cartLoading || userLoading) return
      async function setInitial() {
        const calendarRes = await fetch(`${API}/calendar`, {
            method: 'GET',
            credentials: "include"
        })
        const data = await calendarRes.json()
        console.log('retrieving data...')
        setEvents(data)
        const rooms = await generateRoomList()
        setAvailableRooms(rooms)
        setLoading(false)
      }
      setInitial()
  }, [cartLoading, userLoading])
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
        setBookedSlots(findSlotObject(tempDateObject.rooms, selectedRoom.name))
        setDateObject(tempDateObject)
        setDropdown((prev) => {
          return prev.map((item) => {
            return {...item, open: false}
          })
        })
        setSelectedSlot({})
        setSelectedStart({})
        setSelectedEnd({})
      }, [selectedDate]);
    // If booked slots, update available slots.
    useEffect(() => { 
      if (cartLoading) return
        const bookedSlotSet = new Set(bookedSlots.flatMap(slot => generateBookedArray(slot)));
        console.log(bookedSlotSet)
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
          .map((time) => {
            const isInSlot = bookedSlotSet.has(time.time)
            const isInCart = cartSet.has(time.time);
            return {
              ...time,
              available: !isInSlot && !isInCart
            }
          })
        })
        setAvailableEnds((prev) => {
          return prev
          .map((time) => {
            
          })
        })
    }, [bookedSlots, cart]);
    useEffect(() => {
      setSelectedEnd({})
      setAvailableEnds(generateHourSlots(11, 21))
      //booked slots that allow for back to back ends
      const bookedEndSet = new Set(bookedSlots.flatMap(slot => generateBookedArray(slot, 0)));
      const cartEndSet = new Set(
            cart
            .filter(item =>
                item.date === selectedDate 
                && item.location === selectedRoom.name
            )
            .flatMap(slot => generateBookedArray(slot, 0)))
      //the minimum one hour time slot
      let closestEndTime = Number(selectedStart.time?.split(':')[0]) + 1
      if (selectedStart.time?.split(':')[1] === '30') {
        closestEndTime += 0.5
      }

      setAvailableEnds((prev) => {
        let foundMiddleBooking = false
          return prev
          .map((time) => {
            let currentEndTime = Number(time.time.split(':')[0])
            if (time.time.split(':')[1] === '30') {
              currentEndTime += 0.5
            }
            //if the ending time is before the soonest allowable end, mark it unavailable
            if (currentEndTime < closestEndTime) {
              return {
                ...time,
                available: false
              }
            }
            //if the ending time is within the range of existing cart or bookings, mark it unavailable
            const isInSlot = bookedEndSet.has(time.time)
            const isInCart = cartEndSet.has(time.time);
            if (isInSlot || isInCart) {
              foundMiddleBooking = true
              return {
                ...time,
                available: !isInSlot && !isInCart
              }
            }
            //if foundMiddleBooking return false, else return true
            return {...time, available: !foundMiddleBooking}
          })
        })
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
      if (user.role === "member" || user.role === "life") {
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
      if (!checkSubmit()) {
        return
      }
      const { firstName, lastName, email } = user
      let start
      let end
      let price
      let chosenEquipment = equipment
      .filter(item => item.selected)
      .map(item => item.name)
      if (user.role === "member" || user.role === "life") {
        start = selectedSlot.start
        end = selectedSlot.end
      } else {
        start = selectedStart.time
        end = selectedEnd.time
      }
      const timezone = selectedRoom.timezone
      const starts_at = fromZonedTime(
        `${selectedDate}T${start}`,
        timezone
      ).toISOString();

      const ends_at = fromZonedTime(
        `${selectedDate}T${end}`,
        timezone
      ).toISOString();
      if (selectedRoom.available && selectedSlot.available
          || selectedRoom.available && selectedStart.available && selectedEnd.available
      ) {
          let booking = {
              id: crypto.randomUUID(),
              first_name: firstName || "Phin",
              last_name: lastName || "Crisp",
              created_at: new Date(), 
              email: email || "phineas.crisp@afm47.org",
              date: selectedDate,
              location: selectedRoom.name,
              location_id: selectedRoom.id,
              timezone,
              starts_at,
              ends_at,
              start,
              end,
              equipment_request: chosenEquipment,
              description: description,
              status: 'pending'
          }
          console.log(booking)
          const success = addToCart(booking)
          if (success) {
            setBannerMessage(setMessage, "Added booking to cart!", false, 5)
          } else {
            setBannerMessage(setMessage, "Something went wrong, please try again.", true, 5)
          }
          setShowBackline(false)
          setSelectedSlot({})
          setSelectedStart({})
          setSelectedEnd({})
      }      
    }

    if (loading) {
      return (
        <Loading></Loading>
      )
    }
    
    return (
      <div className={styles.body}>
        <div className={styles.main}>
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
                    { user.role !== "member" && user.role !== "life"
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
              <div className={`${styles.backlineText} ${checkAllSelected() && !showBackline ? '' : 'hiddenDisplay'} text medium link`}
              onClick={() => {setShowBackline(true)}}>Add backline?</div>
              <div className={`${styles.backlineContainer} ${showBackline ? '' : 'hiddenDisplay'}`}>
                <CartInfo 
                  equipment={equipment}
                  setEquipment={setEquipment}
                  description={description}
                  setDescription={setDescription}
                ></CartInfo>
              </div>
              <div className={`${styles.submitButtonContainer}`}>
                <div className={`${styles.submitButton} button text medium ${checkAllSelected() ? '' : 'hiddenOpacity'}`} onClick={handleClick}><span>Add booking</span></div>
              </div>
            </div>
        </div>
        <div className={`${styles.checkoutContainer}`}>
        { viewCart 
        ? <div className={`${styles.inCart} medium text link`} onClick={() => setViewCart(false)}><span>Cart</span><ChevronUpIcon className='largeIcon'></ChevronUpIcon></div>
        : <div className={`${styles.inCart} medium text link`} onClick={() => {
          setViewCart(true) 
          setDropdown((prev) => {
          return prev.map((item) => {
            return {...item, open: false}
          })
        })}}><span>Cart ({cart.length})</span><ChevronDownIcon className='largeIcon'></ChevronDownIcon></div>}
        {viewCart 
        ? <ul className={styles.checkoutList}>
          { cart.length > 0 
          ?   
          <div>
            {cart.map((item) => {
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
          })}
          <Link to={'/cart'}><div className={`${styles.checkoutButton} button medium text`}>Continue to checkout</div></Link>
          </div>
          : <div className={`text thin`}>Your cart is empty.</div> }
        </ul>
        : <></>}
        </div>
      </div>
    )
}
