import React from 'react'
import { useRouteError } from 'react-router'

export default function ErrorPage() {
  const error = useRouteError()

  console.log(error)
  
  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error?.message}</p>
    </div>
  )
}
