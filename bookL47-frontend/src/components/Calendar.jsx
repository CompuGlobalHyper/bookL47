import React, { useEffect, useRef, useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from "@fullcalendar/interaction";
import './styles/fullCalendarStyles.css'
import styles from "./styles/Calendar.module.css"

const fullView = "dayGridMonth"
const mobileView = 'timeGridDay'
const firstDate = new Date();
firstDate.setDate(firstDate.getDate() + 2)

//700px width

export default function Calendar({ events = [{title: 'Hello World', start: '2026-06-03'}] }) {
  const [selectedDate, setSelectedDate] = useState(firstDate)
  const dayCalendarRef = useRef(null)
  const handleClick = (cell) => {
    setSelectedDate(cell.dateStr)
    console.log(cell.dateStr)

  }
  useEffect(() => {
    if (!dayCalendarRef.current) return;

    const api = dayCalendarRef.current.getApi();

    api.gotoDate(selectedDate);
    }, [selectedDate]);
    return (
        <>  
            <div className={styles.dayView}>
                <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView={mobileView}
                initialDate={selectedDate}
                events={events}
                ref={dayCalendarRef}
                datesSet={(info) => {
                    const date = new Date(info.view.currentStart)
                    const dateStr = date.toISOString().split('T')[0]
                    setSelectedDate(dateStr)
                }}
                >
                </FullCalendar>
            </div>
            <div className={styles.monthView}>
                <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
                initialView={fullView}
                height={'auto'}
                events={events}
                dateClick={handleClick}
                dayCellClassNames={(cell) => {
                    const today = new Date();
                    const tomorrow = new Date();
                    tomorrow.setDate(today.getDate() + 1)

                    const todayStr = today.toISOString().split('T')[0];
                    const tomorrowStr = tomorrow.toISOString().split('T')[0]

                    console.log('hello')
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
        </>
    
  );
}
