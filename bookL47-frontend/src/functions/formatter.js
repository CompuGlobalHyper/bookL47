export function formatDate(dateString) {
    const date = new Date(`${dateString}T12:00:00Z`)

    const formatter = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'America/Los_Angeles',
    });
    
    return formatter.format(date)
  }
  export function formatTime(timeString = '12:30:00') {
    const [ hours, minutes ] = timeString.split(':')
    const hour = Number(hours)
    const period = hour >= 12 ? 'pm' : 'am'
    const displayHour = hour % 12 || 12

    return `${displayHour}${minutes !== '00' ? ":" + minutes : ""}${period}`

  }

  export function createTotal(cart) {
    return cart.reduce((acc, item) => {
        return acc + item.price
    }, 0)
  }

  export function createFee(price) {
  return (price * 0.029 + 0.30).toFixed(2);
}