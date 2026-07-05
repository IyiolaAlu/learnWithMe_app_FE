import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useCourses } from '../context/CoursesContext'
import './Logout.css'

const Logout = () => {
  const { setToken } = useCourses()
  const navigate = useNavigate()
  
  const handleLogout = () => {
    localStorage.removeItem('token')
    setToken(null)
    navigate('/login')
  }
  
  return (
    <button className="logout-btn" onClick={handleLogout}>
      <svg className="logout-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
      <span>Logout</span>
    </button>
  )
}

export default Logout