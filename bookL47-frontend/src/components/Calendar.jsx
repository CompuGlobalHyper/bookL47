import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import './styles/fullCalendarStyles.css'
import styles from "./styles/Calendar.module.css"

const fullView = "dayGridMonth"
const mobileView = 'timeGridDay'


export default function Calendar({
    firstDate,
    selectedDate, 
    setSelectedDate, 
    dateObject, 
    setDateObject,
    events, 
    loading, 
    user }) {
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
    if (!dayCalendarRef.current) return;
    const api = dayCalendarRef.current.getApi();
    api.gotoDate(selectedDate);
    }, [selectedDate]);

    return ( 
        <div className={styles.main}>
            {loading ? <div>Loading...</div> : 
            <>
            <div className={`${styles.dayView} text`}>
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
            <div className={`${styles.monthView} text`}>
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
            </> }
            
        </div> 
  );
}