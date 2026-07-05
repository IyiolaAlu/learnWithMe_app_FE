import React from 'react'
import { Link } from 'react-router-dom'
import './Footer.css'

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">

        <div className="footer-brand-col">
          <Link to="/" className="footer-brand">Learn<span>With</span>Me</Link>
          <p className="footer-tagline">Expert-led courses built for the modern learner. Start where you are, go where you want to be.</p>
        </div>

        <div className="footer-links-grid">
          <div className="footer-col">
            <h4 className="footer-col-title">Platform</h4>
            <ul>
              <li><Link to="/courses">Browse Courses</Link></li>
              {/* <li><Link to="/signup">Become a Student</Link></li>
              <li><Link to="/signup">Become an Instructor</Link></li> */}
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Account</h4>
            <ul>
              {/* <li><Link to="/login">Sign In</Link></li>
              <li><Link to="/signup">Get Started</Link></li> */}
              <li><Link to="/dashboard">My Courses</Link></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4 className="footer-col-title">Company</h4>
            <ul>
              <li><a href="#">About</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} LearnWithMe. All rights reserved.</p>
        <div className="footer-legal">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
        </div>
      </div>
    </footer>
  )
}

export default Footer