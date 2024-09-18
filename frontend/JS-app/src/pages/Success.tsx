import React from 'react'
import { Link } from 'react-router-dom'

export default function Success() {
  return (
    <>
    <div>Payment confirmed</div>
    <Link to="/">Go to home</Link>
    </>
  )
}
