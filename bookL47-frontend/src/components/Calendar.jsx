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
        let formattedDate = cell.date.toISOString().split('T')[0]
        if (selectedDate && formattedDate === selectedDate) {      
            return [styles.activeDate]
        }
        return []
      }}
    />
  );
}
