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

function findSlotObject(list, room) {
    
    return list.find((item) => item.name === `Room ${room}`
    )
}


export default function Calendar({ events, loading }) {
  const [selectedDate, setSelectedDate] = useState(firstDate)
  const [dateObject, setDateObject] = useState({})
  const [selectedRoom, setSelectedRoom] = useState(4)
  const [slots, setSlots] = useState({})
  const dayCalendarRef = useRef(null)
  const handleClick = (cell) => {
    if (cell.dateStr <= firstDate.toISOString().split('T')[0]) {
        console.log('resetting to first allowed date')
        return setSelectedDate(firstDate.toISOString().split('T')[0])
    }
    setSelectedDate(cell.dateStr)
    console.log(cell.dateStr)

  }
  useEffect(() => {
    if(Object.keys(dateObject).length === 0) return
    setSlots(findSlotObject(dateObject.rooms, selectedRoom))
  }, [selectedRoom])

  useEffect(() => {
    function setInitial() {
        let firstDateStr = firstDate.toISOString().split('T')[0]
        let firstDateObject = findDateObject(events, firstDateStr)
        let firstSlotObject = findSlotObject(firstDateObject.rooms, 4)
        setDateObject(firstDateObject)
        setSlots(firstSlotObject)
    }
    if(!loading) {
        setInitial()
    }
  }, [loading])
  
  useEffect(() => {
    if (!dayCalendarRef.current) return;
    let dateObject = events.find((obj) => obj.date === selectedDate)
    setSlots(findSlotObject(dateObject.rooms, selectedRoom))
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
                ref={dayCalendarRef}
                datesSet={(info) => {
                    console.log(info)
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
                slots={slots}
                ></Timeslots>
            </div>
            </> }
            
        </div> 
  );
}