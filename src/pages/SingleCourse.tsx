import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import type { Course } from '../context/CoursesContext'
import { useCourses } from '../context/CoursesContext'
import './SingleCourse.css'

const SingleCourse = () => {
    const { id } = useParams<{ id: string }>()
    const { token } = useCourses()
    const [course, setCourse] = useState<Course | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [openSection, setOpenSection] = useState<number | null>(0)
    const [progress, setProgress] = useState(0)
    const [completed, setCompleted] = useState(false)
    const [isEnrolled, setIsEnrolled] = useState(false)


    useEffect(() => {
        if (!id) return
        const fetchCourse = async () => {
            try {
                const res = await axios.get(`https://learnwithme-app-be-3.onrender.com/api/courses/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                console.log('course data:', res.data)  // 👈 add this
                setCourse(res.data.course)
                setIsEnrolled(res.data.enrolled)
                setLoading(false)
            } catch (err) {
                console.log('fetch error:', err)
                setError('Failed to load course')
                setLoading(false)
            }
        }
        fetchCourse()
    }, [id, token])

        useEffect(() => {
        if (!isEnrolled || !id) return
        const fetchEnrollmentStatus = async () => {
            try {
                const res = await axios.get(`https://learnwithme-app-be-3.onrender.com/api/enroll/status/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setProgress(res.data.progress)
                setCompleted(res.data.completed)
            } catch (err) {
                console.log('enrollment status error:', err)
            }
        }
        fetchEnrollmentStatus()
    }, [isEnrolled, id, token])

    const handleComplete = async () => {
        try {
            await axios.put(
                `https://learnwithme-app-be-3.onrender.com/api/enroll/complete/${id}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            )
            setCompleted(true)
            setProgress(100)
        } catch (err) {
            console.log('complete error:', err)
        }
    }



    const totalLessons = course?.sections?.reduce((acc, section) => acc + section.lessons.length, 0) ?? 0

    if (loading) return <div className="sc-loading">Loading course...</div>
    if (error) return <div className="sc-loading">{error}</div>
    if (!course) return <div className="sc-loading">Course not found</div>

    return (
        <div className="sc-page">
            {/* ── Hero ── */}
            <div className="sc-hero">
                <div className="sc-hero-content">
                    <p className="sc-label">Course</p>
                    <h1 className="sc-title">{course.title}</h1>
                    <p className="sc-description">{course.description}</p>
                    <div className="sc-meta">
                        <span className="sc-meta-item">
                            👨‍🏫 {course.instructor?.firstName} {course.instructor?.lastName}
                        </span>
                        <span className="sc-meta-item">📚 {course.sections?.length} sections</span>
                        <span className="sc-meta-item">🎬 {totalLessons} lessons</span>
                    </div>
                    <p className="sc-price">${course.price}</p>
                    {
                        !isEnrolled ? (
                            <button className="sc-enroll-btn">
                                Enroll Now — ${course.price}
                            </button>
                        ) : (
                            <>
                                <p className="sc-enrolled-badge">✅ You are enrolled in this course</p>
                                <div className="sc-progress-block">
                                    <div className="sc-progress-bar-container">
                                        <div
                                            className="sc-progress-bar"
                                            style={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="sc-progress-text">
                                        {completed ? '🎉 Course Completed!' : `${progress}% complete`}
                                    </p>
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="sc-hero-image">
                    <img src={course.thumbnail} alt={course.title} />
                </div>
            </div>

            {/* ── Body ── */}
            <div className="sc-body">

                {/* ── What you'll learn ── */}
                <div className="sc-section-block">
                    <h2 className="sc-section-title">What's included</h2>
                    <div className="sc-includes">
                        <div className="sc-include-item">✅ {totalLessons} lessons</div>
                        <div className="sc-include-item">📁 {course.sections?.length || 0} sections</div>
                        <div className="sc-include-item">♾️ Full lifetime access</div>
                        <div className="sc-include-item">📱 Access on all devices</div>
                    </div>
                </div>

                {/* ── Curriculum ── */}
                <div className="sc-section-block">
                    <h2 className="sc-section-title">Course Curriculum</h2>
                    {isEnrolled ? (
                        <div className="sc-curriculum">
                            {(course.sections || []).map((section, sectionIndex) => (
                                <div key={sectionIndex} className="sc-section">
                                    <button
                                        className="sc-section-header"
                                        onClick={() => setOpenSection(openSection === sectionIndex ? null : sectionIndex)}
                                    >
                                        <span className="sc-section-name">
                                            <span className="sc-section-number">{sectionIndex + 1}</span>
                                            {section.title}
                                        </span>
                                        <span className="sc-section-toggle">
                                            {openSection === sectionIndex ? '▲' : '▼'}
                                        </span>
                                    </button>

                                    {openSection === sectionIndex && (
                                        <div className="sc-lessons">
                                            {(section.lessons || []).map((lesson, lessonIndex) => (
                                                <a
                                                    key={lessonIndex}
                                                    href={lesson.videoUrl}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="sc-lesson"
                                                >
                                                    <span className="sc-lesson-icon">▶</span>
                                                    <span className="sc-lesson-title">{lesson.title}</span>
                                                </a>
                                            ))}

                                            {isEnrolled && !completed && (
                                                <button onClick={handleComplete} className="sc-complete-btn">
                                                    ✅ Mark Course as Complete
                                                </button>
                                            )}

                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="sc-locked">
                            <p>🔒 Enroll in this course to access the curriculum</p>
                        </div>
                    )}


                </div>

                {/* ── Instructor ── */}
                <div className="sc-section-block">
                    <h2 className="sc-section-title">Your Instructor</h2>
                    <div className="sc-instructor">
                        <div className="sc-instructor-avatar">
                            {course.instructor?.firstName?.[0]}{course.instructor?.lastName?.[0]}
                        </div>
                        <div className="sc-instructor-info">
                            <h3>{course.instructor?.firstName} {course.instructor?.lastName}</h3>
                            {course.instructor?.email && <p>{course.instructor?.email}</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleCourse