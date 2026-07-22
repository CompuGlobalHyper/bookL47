export default async function getUser() {
    const API = import.meta.env.VITE_API_URL
    try {
        const res = await fetch(`${API}/api/me`, {
            method: "GET",
            credentials: "include"
        })
        const user = await res.json()
    if (user.auth === true) {
        console.log("user signed in")
        return user
    } else {
        return { role: "guest" }
    }
    } catch(error) {
        console.log(error)
        return { role: "guest" }
    }
}