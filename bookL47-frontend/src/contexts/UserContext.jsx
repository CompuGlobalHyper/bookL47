import React, { createContext, useContext, useState, useEffect } from 'react'
import getUser from '../functions/getUser'


export const UserContext = createContext()
export function UserProvider({ children }) {
    const [user, setUser] = useState({ role: 'guest' })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function init() {
            const data = await getUser()
            if (data.role === 'guest') {
                console.log("Logging user as guest")
            }
            setUser(data)
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
