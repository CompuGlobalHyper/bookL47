import React from 'react'
import { Link } from 'react-router'

export default function NotFound() {
  return (
    <div>
      <h1 className='text'>Error 404</h1>
      <p className='text'>We couldn't find the page you were looking for..</p>
      <Link to={'/'}><p className='link text blue'>Take me home!</p></Link>
    </div>
  )
}
