import React, { createContext, useContext, useState, useEffect } from 'react'
import getUser from '../functions/getUser'


export const UserContext = createContext()
export function UserProvider({ children }) {
    const [user, setUser] = useState({ role: 'guest' })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function init() {
            console.log('User Provider loading')
            const user = await getUser()
            if (user.role === 'guest') {
                console.log("Logging user as guest")
            }
            setUser(user)
            setLoading(false)
        }
        init()
    }, [])
  return (
    <UserContext.Provider 
    value={{
        user,
        setUser,
        loading
    }}>
    {children}  
    </UserContext.Provider>
  )
}
