export default function generateTimeSlots(start, end) {
    const slots = []

    const startMinutes = start * 60       // 10:00 AM
    const endMinutes = end * 60 + 30    // 8:30 PM

    const getTimeString = (minutes) => {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60

        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`
    }

    const getDisplayTime = (minutes) => {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        const suffix = h >= 12 ? "pm" : "am"
        const hour = h % 12 || 12

        return `${hour}:${String(m).padStart(2, "0")} ${suffix}`
    }

    for (let i = startMinutes; i <= endMinutes; i += 30) {
        slots.push({
            time: getTimeString(i),
            name: getDisplayTime(i),
            available: true
        })
    }

    return slots
}