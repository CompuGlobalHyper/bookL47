import React from 'react'
import { Link } from 'react-router'
import Dropdown from '../../components/Dropdown'

export default function AdminHome() {
  return (
    <div>
      <div>Links:</div>
      <Link to='/book'>Book</Link>
      <Dropdown></Dropdown>
    </div>
  )
}
