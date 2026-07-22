import React, { useContext, useState } from 'react'
import { UserContext } from '../../contexts/UserContext'
import { useOutletContext } from 'react-router'
import setBannerMessage from '../../functions/bannerMessage'

export default function UserHome() {
  const {user} = useContext(UserContext)
  const { setMessage } = useOutletContext()
  const API = import.meta.env.VITE_API_URL
  const [allowSend, setAllowSend] = useState(true)

  async function handleClick() {
    try {
        setAllowSend(false)
        const res = await fetch(`${API}/resend-email-verification`, {
            method:"GET",
            credentials: 'include'
        })
        console.log(res.status)
        const data = await res.json()
        if (res.status === 200) {
            setBannerMessage(setMessage, `Email verification sent to: ${user.email}`, false, 5 )
             setAllowSend(true)
  
        } else {
            setBannerMessage(setMessage, data.message, true, 5 )
             setAllowSend(true)
        }
    } catch (error) {
        setBannerMessage(setMessage, `Error: ${error}` ) , true, 3
        console.log(error)
    }
    
  }

  return (
    <div>
      <div className='large text'>Hello {user.firstName}!</div>
      {!user.verified 
      && <div>
          <p className='text'>You must verfiy your email to gain full access.</p>
          <div className='button text' onClick={() => handleClick()}>Resend verification email</div>
        </div>}
    </div>
  )
}
