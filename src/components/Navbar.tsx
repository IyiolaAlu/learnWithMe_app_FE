import React from 'react'
import { Link } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useCourses } from '../context/CoursesContext'
import Logout from './Logout'
import './Navbar.css'

const Navbar = () => {

  const { token, setToken } = useCourses()
  const decoded = token ? jwtDecode(token || '') as { id: string; role: string; isAdmin: boolean } : null
  const userRole = decoded?.role

  return (
    <nav className="navbar navbar-expand-lg navbar-custom fixed-top">
      <div className="container-fluid">
      <Link className="navbar-brand" to="/">
  Learn<span>With</span>Me
</Link>

        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarSupportedContent" 
          aria-controls="navbarSupportedContent" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link to={'/'} className="nav-link">Home</Link>
            </li>
            <li className="nav-item">
              <Link to={'/courses'} className="nav-link">Courses</Link>
            </li>

            {token && (
              <>
                {userRole === 'instructor' ? (
                  <li className="nav-item">
                    <Link to={'/instructor-dashboard'} className="nav-link">Dashboard</Link>
                  </li>
                ) : (
                  <li className="nav-item">
                    <Link to={'/dashboard'} className="nav-link">My Courses</Link>
                  </li>
                )}
              </>
            )}
          </ul>

          <div className="auth-buttons">
            {token ? (
              <Logout />
            ) : (
              <>
                <Link to={'/login'} className="auth-link">Sign In</Link>
                <Link to={'/signup'} className="auth-btn-primary">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar