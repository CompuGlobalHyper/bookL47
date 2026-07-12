import React from 'react'
import { useRouteError, Link } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()

  console.log(error)
  
  return (
    <div>
      <div>
      <h1 className='text'>Something went wrong.</h1>
      <p className='text'>An unexpected error occurred. Please try <span onClick={() => window.location.reload()} className='link blue'>refreshing</span> the page. If the problem continues, <Link to={'/contact'} className='link blue'>contact us.</Link></p>
      <Link to={'/'}><p className='link text blue medium'>Take me home!</p></Link>
    </div>
    </div>
  )
}
