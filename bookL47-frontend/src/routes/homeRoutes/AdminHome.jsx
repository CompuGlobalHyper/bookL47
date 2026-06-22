import React from 'react'
import { Link } from 'react-router'

export default function AdminHome() {
  return (
    <div>
      <div>Links:</div>
      <Link to='/book'>Book</Link>
    </div>
  )
}
