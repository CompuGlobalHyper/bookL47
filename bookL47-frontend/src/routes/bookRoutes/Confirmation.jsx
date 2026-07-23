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
  useEffect(() => {
    async function load() {
      const params = new URLSearchParams(location.search)
      const payment = params.get('payment')
      if (!payment) navigate('/')
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
    load()
  })
  return (
    <div>
      <div className='text large thin'>You're all set!</div>
      <div className='text medium'>Thank you for booking with AFM Local 47. </div>
      <div className='text medium'>Click <Link className='link blue text' to={'/bookings'}>here</Link> to view your upcoming bookings.</div>
    </div>
  )
}
