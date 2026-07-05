import React from 'react'
import './CourseCard.css'

interface InstructorCourseCardProps {
    _id: string
    title: string
    description: string
    price: number
    thumbnail?: string
    published: boolean
    onEdit?: () => void
    onDelete?: () => void
    onPublish?: () => void
}

const InstructorCourseCard = ({
    title, description, price, thumbnail, published, onEdit, onDelete, onPublish
}: InstructorCourseCardProps) => {
    return (
        <div className="course-card">
            <div className="course-image-container">
                {thumbnail && <img src={thumbnail} alt={title} className="course-image" />}
                <span className={`course-badge ${published ? 'badge-published' : 'badge-draft'}`}>
                    {published ? 'Published' : 'Draft'}
                </span>
            </div>
            <div className="course-info">
                <h3 className="course-title">{title}</h3>
                <p className="course-description">{description}</p>
                <div className="course-footer">
                    <span className="course-price">${price}</span>
                    <div className="instructor-actions">
                        <button onClick={onEdit} className="action-btn edit-btn" type="button">Edit</button>
                        <button onClick={onDelete} className="action-btn delete-btn">Delete</button>
                        {!published && (
                            <button onClick={onPublish} className="action-btn publish-btn">Publish</button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InstructorCourseCard