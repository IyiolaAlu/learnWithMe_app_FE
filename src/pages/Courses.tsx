import React, { useState } from 'react'
import Logout from '../components/Logout'
import { useCourses } from '../context/CoursesContext'
import StudentCourseCard from '../components/StudentCourseCard'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'
import './Courses.css'


const Courses = () => {
  const { loading, courses, token, error, setLoading, setError } = useCourses()
  const [search, setSearch] = useState('')


  interface RazorpayResponse {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }
    const decoded = token? jwtDecode(token) as { id: string; email: string; firstName?: string; lastName?: string } : null
        const user = {
          firstName: decoded?.firstName || 'Student',
          lastName: decoded?.lastName || '',
          email: decoded?.email || 'student@example.com'
        };

  const handleEnroll = async (courseId: string, title: string) => {
    try {
      // Step 1 — create order on your backend
      const orderRes = await axios.post(
        'https://learnwithme-app-be-3.onrender.com/api/payment/create-order',
        { courseId: courseId },
        { headers: { Authorization: `Bearer ${token}` } }
      )

      const { orderId, amount, currency } = orderRes.data



      // Step 2 — open Razorpay popup
      console.log('Razorpay key:', import.meta.env.VITE_RAZORPAY_KEY_ID)
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'LearnWithMe',
        description: title,
        order_id: orderId,

        // Step 3 — runs after successful payment
        handler: async (response: RazorpayResponse) => {
          try {
            // send payment details to backend to verify
            await axios.post(
              'https://learnwithme-app-be-3.onrender.com/api/payment/verify',
              {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                courseId: courseId
              },
              { headers: { Authorization: `Bearer ${token}` } }
            )
            alert('Payment successful! You are now enrolled.')
          } catch (error) {
            alert('Payment verification failed')
          }
        },

      

        prefill: {
          name: user.firstName + ' ' + user.lastName,
          email: user.email
        },
        theme: { color: '#1a1a1a' }
      }

      const razorpay = new window.Razorpay(options)
      razorpay.open()

    } catch (error) {
      console.log(error)
      alert('Something went wrong')
    }
  }

  const searchTerm = search.trim().toLowerCase()
  const filteredArray = courses.filter((course)=>{
    return course.title.toLowerCase().includes(searchTerm)
  })


  return (
    <>
      <div className="courses-page">
      {/* ── Header ── */}
      <div className="courses-hero">
        <h1 className="courses-hero-title">Browse Courses</h1>
        <p className="courses-hero-subtitle">Learn from expert instructors at your own pace</p>
      </div>

      {/* ── Search & filter ── */}
      <div className="courses-toolbar">
        <div className="courses-search-wrap">
          <span className="courses-search-icon">🔍</span>
          <input
          value={search}
          onChange={(e)=>setSearch(e.target.value)}
            className="courses-search"
            type="text"
            placeholder="Search courses..."
          />
        </div>
       
        <span className="courses-count">{courses.length} courses</span>
      </div>

      {/* ── Grid ── */}
      <div className="courses-body">
        {loading ? (
          <div className="courses-spinner">
            <div className="spinner" />
            <p>Loading courses...</p>
          </div>
        ) : courses.length === 0 ? (
          <p className="courses-empty">No courses found.</p>
        ) : (
          <div className="courses-grid">
            {filteredArray.map(({ _id, title, thumbnail, instructor, description, price }) => (
              <StudentCourseCard
                key={_id}
                _id={_id}
                title={title}
                thumbnail={thumbnail}
                instructor={instructor}
                description={description}
                price={price}
                onEnroll={() => handleEnroll(_id, title)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  )
}

export default Courses