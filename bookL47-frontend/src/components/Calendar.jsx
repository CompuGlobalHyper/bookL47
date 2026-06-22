import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import './styles/fullCalendarStyles.css'
import styles from "./styles/Calendar.module.css"
import Rooms from './Rooms';
import Timeslots from './Timeslots';

const fullView = "dayGridMonth"
const mobileView = 'timeGridDay'
const firstDate = new Date();
firstDate.setDate(firstDate.getDate() + 2)

function findDateObject(list, date) {
    return list.find((item) => item.date === date)
}

// {room: 'Room 6, filledSlots: [{start: x, end, x}]}
function findSlotObject(list, room) {
    if (list.find((item) => item.room === `Room ${room}`)) {
        return list.find((item) => item.room === `Room ${room}`)
    } else {
        let roomValue = `Room ${room}` 
        return {room: roomValue, filledSlots: []}
    }
}


export default function Calendar({ events, loading, user }) {
  const [selectedDate, setSelectedDate] = useState(firstDate)
  const [dateObject, setDateObject] = useState({})
  const [selectedRoom, setSelectedRoom] = useState(4)
  const [slots, setSlots] = useState({})
  const dayCalendarRef = useRef(null)

  const handleClick = (cell) => {
    if (cell.date.getDay() === 0 || cell.date.getDay() === 6) {
        console.log('no weekends')
        return
    }
    if (cell.dateStr < firstDate.toISOString().split('T')[0]) {
        console.log('not an allowed date')
        return
    }
    console.log(cell)
    setSelectedDate(cell.dateStr)

  }
  useEffect(() => {
    if(Object.keys(dateObject).length === 0) return
    console.log(dateObject)
    setSlots(findSlotObject(dateObject.rooms, selectedRoom))
  }, [selectedRoom])

  useEffect(() => {
    function setInitial() {
        let firstDateStr = firstDate.toISOString().split('T')[0]
        let firstDateObject = findDateObject(events, firstDateStr)
        let firstSlotObject = findSlotObject(firstDateObject.rooms, 4)
        console.log(firstSlotObject)
        console.log(firstDateObject)
        setDateObject(firstDateObject)
        setSlots(firstSlotObject)
    }
    if(!loading) {
        setInitial()
    }
  }, [loading])
  
  useEffect(() => {
    if (!dayCalendarRef.current) return;
    let tempDateObject = events.find((obj) => obj.date === selectedDate)
    setSlots(findSlotObject(tempDateObject.rooms, selectedRoom))
    setDateObject(tempDateObject)
    const api = dayCalendarRef.current.getApi();
    api.gotoDate(selectedDate);
    }, [selectedDate]);

    return ( 
        <div className={styles.main}>
            {loading ? <div>Loading...</div> : 
            <>
            <div className={styles.dayView}>
                <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView={mobileView}
                initialDate={selectedDate}
                events={events}
                weekends={false}
                titleFormat={{weekday: "long", month: "long", day: "numeric"}}
                ref={dayCalendarRef}
                datesSet={(info) => {
                    const date = new Date(info.view.currentStart)
                    const dateStr = date.toISOString().split('T')[0]
                    setSelectedDate(dateStr)
                }}
                validRange={{
                    start: firstDate
                }}
                >
                </FullCalendar>
            </div>
            <div className={styles.monthView}>
                <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView={fullView}
                height={'auto'}
                events={[]}
                dateClick={handleClick}
                weekends={false}
                dayCellClassNames={(cell) => {
                    const today = new Date();
                    const tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1)

                    const todayStr = today.toISOString().split('T')[0];
                    const tomorrowStr = tomorrow.toISOString().split('T')[0]

                    let formattedDate = cell.date.toISOString().split('T')[0]
                    if (todayStr === formattedDate) {
                        return [styles.currentDate]
                    }
                    if (formattedDate < todayStr ||
                        tomorrowStr === formattedDate) {
                        return [styles.notAllowedDate]
                    }
                    if (selectedDate && formattedDate === selectedDate) {      
                        return [styles.activeDate]
                    }
                    
                    return []
                }}
                />
            </div>
            <div className={styles.side}>
                <Rooms
                selectedRoom={selectedRoom}
                setSelectedRoom={setSelectedRoom} 
                ></Rooms>
                <Timeslots 
                selectedRoom={selectedRoom} 
                selectedDate={selectedDate}
                slots={slots}
                user={user}
                ></Timeslots>
            </div>
            </> }
            
        </div> 
  );
}