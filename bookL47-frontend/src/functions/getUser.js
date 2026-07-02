export default async function getUser() {
    const API = import.meta.env.VITE_API_URL
    try {
        const res = await fetch(`${API}/api/me`, {
        method: "GET",
        credentials: "include"
        }
        )
        const user = await res.json()
        console.log(user)
    if (user.auth === true) {
        console.log("get user succeeded")
        return user
    } else {
        console.log("get user failed")
        return {role: "guest"}
    }
    } catch(error) {
        console.log(error)
    }
}