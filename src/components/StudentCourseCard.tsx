import React from 'react'
import { Link } from 'react-router-dom'
import './CourseCard.css'

interface StudentCourseCardProps {
    _id: string
    title: string
    description: string
    price: number
    thumbnail: string
    instructor: {
        firstName: string
        lastName: string
        email?: string
    }
    onEnroll?: () => void
}

const StudentCourseCard = ({
    _id, title, description, price, thumbnail, instructor, onEnroll
}: StudentCourseCardProps) => {
    return (
        <div className="course-card">
            <div className="course-image-container">
                <img src={thumbnail} alt={title} className="course-image" />
            </div>
            <div className="course-info">
                <h3 className="course-title">{title}</h3>
                <p className="course-instructor">
                    By {instructor?.firstName}
                </p>
                <p className="course-description">{description}</p>
                <div className="course-footer">
                    <span className="course-price">${price}</span>
                    <div className="course-actions">
                        <button onClick={onEnroll} className="enroll-btn">Enroll Now</button>
                        <Link to={`/course/${_id}`} className="view-btn">View Course</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default StudentCourseCard