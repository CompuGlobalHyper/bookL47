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
    validRange,
    events, 
    loading, 
    user }) {
  const dayCalendarRef = useRef(null)

  const handleClick = (cell) => {
    if (user.role !== 'admin') {
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
    } else {
        console.log(cell)
        setSelectedDate(cell.dateStr)  
    }
  }
  
  useEffect(() => {
    if (!dayCalendarRef.current) return;
    const api = dayCalendarRef.current.getApi();
    api.gotoDate(selectedDate);
    }, [selectedDate]);

    return ( 
        <div className={styles.main}>
            <div className={`${styles.dayView} text`}>
                <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView={mobileView}
                initialDate={selectedDate}
                validRange={validRange}
                events={events}
                weekends={user.role === 'admin'}
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
                validRange={validRange}
                dateClick={handleClick}
                weekends={user.role === 'admin'}
                dayCellClassNames={(cell) => {
                    const today = new Date();
                    const tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1)

                    const todayStr = today.toISOString().split('T')[0];
                    const tomorrowStr = tomorrow.toISOString().split('T')[0]
                    cell.date.toISOString().split('T')[0]
                    let formattedDate = cell.date.toISOString().split('T')[0]
                    if (todayStr === formattedDate && user.role !== 'admin') {
                        return [styles.currentDate]
                    }
                    if ((formattedDate < todayStr ||
                        tomorrowStr === formattedDate)
                        && user.role !== 'admin'
                    ) {
                        return [styles.notAllowedDate]
                    }
                    if (selectedDate && formattedDate === selectedDate) {   
                        console.log(formattedDate)   
                        return [styles.activeDate]
                    }
                    return []
                }}
                />
            </div>   
        </div> 
  );
}