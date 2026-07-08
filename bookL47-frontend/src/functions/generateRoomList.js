 //selected: false, available: true

 const roomSmallDesc =
  "A professional rehearsal room for up to 8 musicians. Features a Yamaha upright piano and DW Design Series drum kit, making it ideal for solo artists, duos, and small bands.";

  const roomMediumDesc =
  "Designed for groups of up to 15 musicians, this room includes a Yamaha upright piano and DW Design Series drum kit. Perfect for band rehearsals, ensemble practice, and performance preparation.";

  const roomLargeDesc =
  "A rehearsal studio for up to 20 musicians with a Yamaha C3 grand piano and DW drum kit. Suitable for jazz bands, larger ensembles, and professional music rehearsals.";

  const roomXLDesc =
  "The largest rehearsal room accommodates up to 40 musicians and includes a Kawai grand piano and DW Jazz Series drum kit. It is also connected to a recording booth, making it ideal for orchestras, big bands, large ensembles, and professional recording sessions.";

export default async function generateRoomList() {
    const API = import.meta.env.VITE_API_URL
    const res = await fetch(`${API}/rooms`, {
            method: 'GET',
            credentials: "include"
        })
    const data = await res.json()
    const roomList = data.map((item) => {
        if (item.name === "Room 1" || item.name === "Room 2") {
            return {...item, selected: false, available: true, description: roomSmallDesc}
        }
        if (item.name === "Room 3" || item.name === "Room 4") {
            return {...item, selected: false, available: true, description: roomMediumDesc}
        }
        if (item.name === "Room 5" || item.name === "Room 6") {
            return {...item, selected: false, available: true, description: roomLargeDesc}
        }
        if (item.name === "Room 7") {
            return {...item, selected: false, available: true, description: roomXLDesc}
        }  
    })
    return roomList
}
