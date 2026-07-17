import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { Link } from 'react-router'

export default function Confirmation() {
  const API = import.meta.env.VITE_API_URL
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const payment = params.get('payment')
  useEffect(() => {
    async function load() {
      const res = await fetch(`${API}/confirmation?payment=${payment}`, {
        method: "GET",
        credentials: 'include'
      })
      if (res.status === 200) {
        setLoading(false)
      } else {
        navigate('/')
      }
    }
  })
  return (
    <div>
      <div className='text large'>You're all set!</div>
      <div className='text medium'>Thank you for booking with AFM Local 47. Click <Link className='link blue text' to={'/bookings'}>here</Link> to view you're upcoming bookings.</div>
    </div>
  )
}
