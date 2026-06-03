import React, { useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interPlugin from "@fullcalendar/inter";


export default function Calendar({ events = [{title: 'Hello World', start: '2026-06-03'}] }) {
  const [selectedDate, setSelectedDate] = useState(null)
    return (
    <FullCalendar
      plugins={[dayGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      events={events}
    />
  );
}
