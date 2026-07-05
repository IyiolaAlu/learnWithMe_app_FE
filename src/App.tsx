import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Navbar from './components/Navbar'
import Courses from './pages/Courses'
import InstructorDash from './pages/InstructorDash'
import SingleCourse from './pages/SingleCourse'
import StudentDash from './pages/StudentDash'
import Homepage from './pages/HomePage'
import AuthGuard from './AuthGuard'
import Footer from './components/Footer'



const App = () => {
  const location = useLocation()
const hideFooter = location.pathname === '/login' || location.pathname === '/signup'
  return (
    <>
      <Navbar />
      <Routes>
        {/* Public */}
        <Route path='/' element={<Homepage />} />
        <Route path='/courses' element={<Courses />} />
        <Route path='/signup' element={<Signup />} />
        <Route path='/login' element={<Login />} />

        {/* AuthGaurd */}
        <Route path='/instructor-dashboard' element={
          <AuthGuard>
            <InstructorDash />
          </AuthGuard>
        } />
        <Route path='/Dashboard' element={
          <AuthGuard>
            <StudentDash />
          </AuthGuard>
        } />
        <Route path="/course/:id" element={
          <AuthGuard>
            <SingleCourse />
          </AuthGuard>
        } />
      </Routes>
       {!hideFooter && <Footer />}
    </>
  )
}

export default App