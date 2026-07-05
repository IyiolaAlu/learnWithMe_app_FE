import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useCourses } from '../context/CoursesContext'
import { Link } from 'react-router-dom'
import './Dashboard.css'

interface EnrollCourse {
  _id: string
  student: string
  progress: number
  completed: boolean
  course: {
    _id: string
    title: string
    description: string
    price: number
    thumbnail: string
    instructor: {
      _id: string
      firstName: string
      lastName: string
      email?: string
    }
  }
}

const StudentDash = () => {
  const { token, setError, loading, setLoading } = useCourses()
  const [enrolledCourse, setEnrolledCourse] = useState<EnrollCourse[]>([])

  useEffect(() => {
    const fetchEnrolled = async () => {
      setLoading(true)
      try {
        const res = await axios.get('http://localhost:5005/api/enroll', {
          headers: { Authorization: `Bearer ${token}` }
        })
        setEnrolledCourse(res.data)
        setLoading(false)
      } catch (error) {
        if (axios.isAxiosError(error)) { setError(error.response?.data?.message) }
        else { setError('Something went wrong') }
        setLoading(false)
      }
    }
    fetchEnrolled()
  }, [token, setError, setLoading])

  if (loading) {
    return (
      <div className="spinner-overlay">
        <div className="spinner" />
        <p className="spinner-text">Loading your courses...</p>
      </div>
    )
  }

  if (!enrolledCourse || enrolledCourse.length === 0) {
    return (
      <div className="no-courses">
        <p>You haven't enrolled in any courses yet.</p>
        <Link to="/courses" className="browse-btn">Browse Courses</Link>
      </div>
    )
  }

  return (
    <div className="student-dash-page">
      <div className="student-dash-header">
        <div>
          <h1 className="student-dash-title">My Learning</h1>
          <p className="student-dash-subtitle">{enrolledCourse.length} course{enrolledCourse.length !== 1 ? 's' : ''} enrolled</p>
        </div>
        <Link to="/courses" className="browse-btn">Browse More</Link>
      </div>

      <div className="courses-grid">
        {enrolledCourse.map((enrollment: EnrollCourse) => {
          const course = enrollment?.course
          if (!course) return null
          const { _id, title, description, price, instructor, thumbnail } = course

          return (
            <div className="course-card" key={enrollment._id}>
              <div className="course-image-container">
                <img
                  src={thumbnail || 'https://via.placeholder.com/300x200?text=Course'}
                  alt={title}
                  className="course-image"
                />
                {enrollment.completed && (
                  <span className="course-badge badge-published">✅ Completed</span>
                )}
              </div>
              <div className="course-info">
                <h3 className="course-title">{title}</h3>
                <p className="course-instructor">
                  By {instructor?.firstName} {instructor?.lastName}
                </p>
                <p className="course-description">{description}</p>

                <div className="course-progress">
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${enrollment.progress || 0}%` }} />
                  </div>
                  <span className="progress-text">
                    {enrollment.completed ? '🎉 Completed' : `${enrollment.progress || 0}% complete`}
                  </span>
                </div>

                <div className="course-footer">
                  <span className="course-price">${price}</span>
                  <div className="course-actions">
                    <Link to={`/course/${_id}`} className="enroll-btn" style={{ textDecoration: 'none', textAlign: 'center' }}>
                      {enrollment.completed ? 'Review' : 'Continue'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default StudentDash