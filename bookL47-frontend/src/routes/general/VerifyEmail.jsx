import React, { useEffect, useState } from 'react'
import setBannerMessage from '../../functions/bannerMessage'
import { useLocation, useNavigate, useOutletContext } from 'react-router'
import Loading from '../../components/Loading'

export default function VerifyEmail() {
    const API = import.meta.env.VITE_API_URL
    const location = useLocation()
    const navigate = useNavigate()
    const { setMessage } = useOutletContext()
    const [loading, setLoading] = useState(true)
    const [allowVerify, setAllowVerify] = useState(true)

    useEffect(() => {
        const params = new URLSearchParams(location.search)
        const token = params.get("token");
        if (!token) {
            navigate('/')
            return
        }
        setLoading(false)

    }, [])

    async function handleClick() {
        const params = new URLSearchParams(location.search)
        const token = params.get("token");
        try {
            setAllowVerify(false)
            const res = await fetch(`${API}/verify-email`, {
                method:"POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                })
            })
            const data = await res.json()
            if (res.status === 200) {
                setBannerMessage(setMessage, "Email address verified!", false, 5 )
                navigate('/book')
            } else {
                setBannerMessage(setMessage, data.message, true, 3 )
                setAllowVerify(true)

            }
        } catch(error) {
            setBannerMessage(setMessage, "There was an error", true, 3)
            console.log(error)
            setAllowVerify(true)
        }
    }
    
    if (loading) {
        return (<Loading></Loading>)
    }
  return (
    <div>
        <div className='text large thin'>Verify your email address</div>
        <p className='text regular'>Please confirm that you want to use this as your BookL47 account email address.</p>
        <p className='text medium'>Then you can start booking!</p>
        <div className='button text medium' onClick={() => {
            if (allowVerify) {
                handleClick()
            }
        }}>Verify my email</div>
    </div>
  )
}
