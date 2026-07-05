import React, { useEffect, useState } from 'react'
import { useCourses } from '../context/CoursesContext'
import type { Course } from '../context/CoursesContext'
import axios from 'axios'
import InstructorCourseCard from '../components/InstructorCourseCard'
import './Dashboard.css'

const InstructorDash = () => {
  const { error, setError, courses, loading, setCourses, setLoading, token, setToken } = useCourses()
  const [image, setImage] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [instructorCourse, setInstructorCourse] = useState<Course[]>([])
  const [publish, setPublish] = useState(false)

  const [form, setForm] = useState({
    title: '', price: '', description: '',
    sections: [{ title: "", lessons: [{ title: "", videoUrl: "" }] }]
  })

  const [editForm, setEditForm] = useState({
    newTitle: '', newPrice: '', newDescription: '',
    newSections: [{ newTitle: "", newLessons: [{ newTitle: "", newVideoUrl: "" }] }]
  })

  const openCourse = (course: Course) => {
    setEditId(course._id)
    setEditForm({
      newTitle: course.title,
      newPrice: String(course.price),
      newDescription: course.description,
      newSections: course.sections?.map((section) => ({
        newTitle: section.title,
        newLessons: section.lessons?.map((lesson) => ({
          newTitle: lesson.title,
          newVideoUrl: lesson.videoUrl
        }))
      }))
    })
    setShowEditModal(true)
  }

  const updateCourse = async () => {
    setLoading(true)
    try {
      await axios.put(`https://learnwithme-app-be-3.onrender.com/api/courses/${editId}`, {
        title: editForm.newTitle,
        price: editForm.newPrice,
        thumbnail: image,
        description: editForm.newDescription,
        sections: editForm.newSections.map(s => ({
          title: s.newTitle,
          lessons: s.newLessons.map(l => ({ title: l.newTitle, videoUrl: l.newVideoUrl }))
        }))
      }, { headers: { Authorization: `Bearer ${token}` } })

      const newEdit = courses.map((course) => {
        if (course._id === editId) {
          return {
            ...course,
            title: editForm.newTitle,
            price: Number(editForm.newPrice),
            description: editForm.newDescription,
            sections: editForm.newSections.map(s => ({
              title: s.newTitle,
              lessons: s.newLessons.map(l => ({ title: l.newTitle, videoUrl: l.newVideoUrl }))
            }))
          }
        }
        return course
      })
      setCourses(newEdit)
      setShowEditModal(false)
      setLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) { setError(error.response?.data?.message) }
      else { setError('Something went wrong') }
      setLoading(false)
    }
  }

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => { setImage(reader.result as string) }
  }

  const createCourse = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await axios.post('https://learnwithme-app-be-3.onrender.com/api/courses', {
        title: form.title, price: form.price,
        description: form.description, thumbnail: image, sections: form.sections
      }, { headers: { Authorization: `Bearer ${token}` } })
      setCourses(prev => [...prev, res.data])
      setForm({ title: '', price: '', description: '', sections: [{ title: '', lessons: [{ title: '', videoUrl: '' }] }] })
      setImage(null)
      setLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) { setError(error.response?.data?.message) }
      else { setError('Something went wrong') }
      setLoading(false)
    }
  }

  const addSection = () => setForm({ ...form, sections: [...form.sections, { title: '', lessons: [{ title: '', videoUrl: '' }] }] })
  const removeSection = (i: number) => setForm({ ...form, sections: form.sections.filter((_, idx) => idx !== i) })
  const addLesson = (si: number) => { const s = [...form.sections]; s[si].lessons.push({ title: '', videoUrl: '' }); setForm({ ...form, sections: s }) }
  const removeLesson = (si: number, li: number) => { const s = [...form.sections]; s[si].lessons = s[si].lessons.filter((_, i) => i !== li); setForm({ ...form, sections: s }) }

  const deleteCourse = async (id: string) => {
    setLoading(true)
    try {
      await axios.delete(`https://learnwithme-app-be-3.onrender.com/api/courses/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setCourses(courses.filter((c) => c._id !== id))
      setLoading(false)
    } catch (error) {
      if (axios.isAxiosError(error)) { setError(error.response?.data?.message) }
      else { setError('Something went wrong') }
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchCourse = async () => {
      setLoading(true)
      try {
        const res = await axios.get('https://learnwithme-app-be-3.onrender.com/api/courses/mycourses', { headers: { Authorization: `Bearer ${token}` } })
        setInstructorCourse(res.data)
        setToken(token)
        setLoading(false)
      }catch (error) {
      if (axios.isAxiosError(error)) { setError(error.response?.data?.message) }
      else { setError('Something went wrong') }
      setLoading(false)
    }
    }
    fetchCourse()
  }, [])

  const handlePublish = async (id: string) => {
    setLoading(true)
    try {
      const res = await axios.put(`https://learnwithme-app-be-3.onrender.com/api/courses/publish/${id}`, {}, {
        'headers': { 'Authorization': `Bearer ${token}` }
      })
      if (res.data.course) {
        setPublish(true)
      }
    } catch (error) {
      if (axios.isAxiosError(error)) { setError(error.response?.data?.message) }
      else { setError('Something went wrong') }
      setLoading(false)
    }
  }

  return (
    <div className="dash-page">
      <div className="dash-header">
        <h1 className="dash-title">Instructor Dashboard</h1>
        <p className="dash-subtitle">Create and manage your courses</p>
      </div>

      {/* ── Create course ── */}
      <div className="create-form-block">
        <div className="create-form-header">
          <h2 className="create-form-title">Create New Course</h2>
        </div>
        <form className="create-form-body" onSubmit={createCourse}>
          <div className="cf-row">
            <div className="cf-field">
              <label className="cf-label">Course Title</label>
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="cf-input" type="text" placeholder="e.g. React Mastery 2025" />
            </div>
            <div className="cf-field">
              <label className="cf-label">Price (₹)</label>
              <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="cf-input" type="number" placeholder="0" />
            </div>
          </div>

          <div className="cf-field">
            <label className="cf-label">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="cf-textarea" placeholder="What will students learn?" />
          </div>

          <div className="cf-field">
            <label className="cf-label">Thumbnail</label>
            <input onChange={handleImage} type="file" accept="image/*" className="cf-input" style={{ padding: '8px 14px' }} />
          </div>

          <div className="sections-block">
            <p className="sections-label">Sections & Lessons</p>
            {form.sections.map((section, si) => (
              <div key={si} className="section-card">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <input value={section.title} onChange={(e) => { const s = [...form.sections]; s[si].title = e.target.value; setForm({ ...form, sections: s }) }} className="cf-input" type="text" placeholder={`Section ${si + 1} title`} />
                  <button type="button" onClick={() => removeSection(si)} className="btn-ghost danger">Remove</button>
                </div>
                {section.lessons.map((lesson, li) => (
                  <div key={li} className="lesson-item">
                    <input value={lesson.title} onChange={(e) => { const s = [...form.sections]; s[si].lessons[li].title = e.target.value; setForm({ ...form, sections: s }) }} className="cf-input" type="text" placeholder="Lesson title" />
                    <input value={lesson.videoUrl} onChange={(e) => { const s = [...form.sections]; s[si].lessons[li].videoUrl = e.target.value; setForm({ ...form, sections: s }) }} className="cf-input" type="text" placeholder="YouTube URL" />
                    <button type="button" onClick={() => removeLesson(si, li)} className="btn-ghost danger">✕</button>
                  </div>
                ))}
                <button type="button" onClick={() => addLesson(si)} className="btn-ghost">+ Add Lesson</button>
              </div>
            ))}
            <button type="button" onClick={addSection} className="btn-ghost">+ Add Section</button>
          </div>

          <button type="submit" className="btn-primary">{loading ? 'Creating...' : 'Create Course'}</button>
        </form>
      </div>

      {/* ── My courses ── */}
      <div className="my-courses-header">
        <h2 className="my-courses-title">My Courses</h2>
      </div>

      {loading ? (
        <div className="spinner-overlay">
          <div className="spinner" />
          <p className="spinner-text">Loading your courses...</p>
        </div>
      ) : instructorCourse.length === 0 ? (
        <div className="empty-state">
          <p>No courses yet. Create your first course above.</p>
        </div>
      ) : (
        <div className="courses-grid">
          {instructorCourse.map((course) => (
            <InstructorCourseCard
              key={course._id}
              _id={course._id}
              title={course.title}
              description={course.description}
              price={course.price}
              thumbnail={course.thumbnail}
              published={course.published}
              onDelete={() => deleteCourse(course._id)}
              onEdit={() => openCourse(course)}
              onPublish={()=>handlePublish(course._id)}
            />
          ))}
        </div>
      )}

      {/* ── Edit modal ── */}
      {showEditModal && (
        <div className="edit-modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="edit-modal-header">
              <h2 className="edit-modal-title">Edit Course</h2>
              <button className="edit-modal-close" onClick={() => setShowEditModal(false)}>✕</button>
            </div>
            <div className="edit-modal-body">
              <div className="cf-row">
                <div className="cf-field">
                  <label className="cf-label">Title</label>
                  <input value={editForm.newTitle} onChange={(e) => setEditForm({ ...editForm, newTitle: e.target.value })} className="cf-input" type="text" />
                </div>
                <div className="cf-field">
                  <label className="cf-label">Price</label>
                  <input value={editForm.newPrice} onChange={(e) => setEditForm({ ...editForm, newPrice: e.target.value })} className="cf-input" type="number" />
                </div>
              </div>
              <div className="cf-field">
                <label className="cf-label">Description</label>
                <textarea value={editForm.newDescription} onChange={(e) => setEditForm({ ...editForm, newDescription: e.target.value })} className="cf-textarea" />
              </div>
              <div className="cf-field">
                <label className="cf-label">New Thumbnail (optional)</label>
                <input onChange={handleImage} type="file" accept="image/*" className="cf-input" style={{ padding: '8px 14px' }} />
              </div>
              <div className="sections-block">
                <p className="sections-label">Sections & Lessons</p>
                {editForm.newSections.map((section, si) => (
                  <div key={si} className="section-card">
                    <input value={section.newTitle} onChange={(e) => { const s = [...editForm.newSections]; s[si].newTitle = e.target.value; setEditForm({ ...editForm, newSections: s }) }} className="cf-input" type="text" placeholder="Section title" />
                    {section.newLessons.map((lesson, li) => (
                      <div key={li} className="lesson-item">
                        <input value={lesson.newTitle} onChange={(e) => { const s = [...editForm.newSections]; s[si].newLessons[li].newTitle = e.target.value; setEditForm({ ...editForm, newSections: s }) }} className="cf-input" type="text" placeholder="Lesson title" />
                        <input value={lesson.newVideoUrl} onChange={(e) => { const s = [...editForm.newSections]; s[si].newLessons[li].newVideoUrl = e.target.value; setEditForm({ ...editForm, newSections: s }) }} className="cf-input" type="text" placeholder="Video URL" />
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
            <div className="edit-modal-footer">
              <button className="btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={updateCourse}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default InstructorDash