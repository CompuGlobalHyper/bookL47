import React, { useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import './styles/fullCalendarStyles.css'
import styles from "./styles/Calendar.module.css"


export default function Calendar({ events = [{title: 'Hello World', start: '2026-06-03'}] }) {
  const [selectedDate, setSelectedDate] = useState(null)
  const handleClick = (cell) => {
    setSelectedDate(cell.dateStr)
    console.log(cell.dateStr)

  }
    return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
      dateClick={handleClick}
      dayCellClassNames={(cell) => {
        const today = new Date();
        const tomorrow = new Date();
        const dayAfter = new Date();
        tomorrow.setDate(today.getDate() + 1)
        dayAfter.setDate(today.getDate() + 2)

        const todayStr = today.toISOString().split('T')[0];
        const tomorrowStr = tomorrow.toISOString().split('T')[0]
        const dayAfterStr = dayAfter.toISOString().split('T')[0];

        console.log('hello')
        let formattedDate = cell.date.toISOString().split('T')[0]
        if (todayStr === formattedDate) {
            return [styles.currentDate]
        }
        if (formattedDate < todayStr ||
            tomorrowStr === formattedDate || 
            dayAfterStr === formattedDate) {
            return [styles.notAllowedDate]
        }
        if (selectedDate && formattedDate === selectedDate) {      
            return [styles.activeDate]
        }
        
        return []
      }}
    />
  );
}
