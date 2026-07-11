export default function generateBookedArray({ start , end }, buffer = 30, interval = 30) {
    
    const getMinutes = (timeString) => {
        const [h, m] = timeString.split(":").map(Number)
        return h * 60 + m
    }

    const getString = (minutes) => {
        const h = Math.floor(minutes / 60)
        const m = minutes % 60
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00`
    }

    const startMinutes = getMinutes(start) - buffer
    const endMinutes = getMinutes(end)

    let times = []

    for (let i = startMinutes - buffer; i <= endMinutes; i += interval) {
        times.push(getString(i))
    }
    
    console.log(times)
    return times
}