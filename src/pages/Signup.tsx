import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { useCourses } from '../context/CoursesContext';

const Signup = () => {
    const [error, seterror] = useState<{ email?: string; password?: string; firstName?: string; lastName?: string } | null>(null)
    const [loading, setLoading] = useState(false)
    const [image, setImage] = useState<string | null>(null)
    const [uploading, setUploading] = useState(false)
        const { setToken, refetchCourses} = useCourses()
    const [form, setform] = useState({
        firstName: '', lastName: '', email: '', password: '', role: 'student',
    })
    const navigate = useNavigate()

    const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        const formData = new FormData()
        formData.append('image', file)
        try {
            const res = await axios.post('https://learnwithme-app-be-3.onrender.com/api/upload/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
            setImage(res.data.url)
            setUploading(false)
        } catch (error) {
            console.error('Upload failed:', error)
            setUploading(false)
        }
    }

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post('https://learnwithme-app-be-3.onrender.com/api/users/signup', {
                firstName: form.firstName, lastName: form.lastName,
                email: form.email, password: form.password,
                role: form.role, profileImage: image
            })
            const token = res.data.token
            localStorage.setItem('token', token)
            if (token) { await refetchCourses(); setToken(token); setLoading(false); navigate('/'); }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data
                if (data?.errors) { seterror(data.errors) }
                else { seterror({ email: data?.message || 'Signup failed' }) }
            } else {
                seterror({ email: 'Something went wrong' })
            }
            setLoading(false)
        }
    }

    return (
        <div className="auth-container">
            {/* ── Left panel ── */}
            <div className="auth-left">
                <h1 className="auth-brand">Learn<span>With</span>Me</h1>
                <p className="auth-tagline">
                    Join thousands of learners and instructors building skills that matter.
                </p>
                <div className="auth-features">
                    <div className="auth-feature-item">
                        <span className="auth-feature-icon">🎓</span>
                        Learn from expert instructors
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-icon">💳</span>
                        Secure payments with Razorpay
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-icon">📈</span>
                        Track your learning progress
                    </div>
                </div>
            </div>

            {/* ── Right panel ── */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-icon">📝</div>
                        <h1 className="auth-title">Create Account</h1>
                        <p className="auth-subtitle">Start your learning journey today</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        {/* Profile image */}
                        <div className="form-group">
                            <label className="form-label">Profile Image (optional)</label>
                            <label className="upload-label">
                                {image
                                    ? <img src={image} alt="preview" className="upload-preview" />
                                    : <span>📷</span>
                                }
                                <span>{uploading ? 'Uploading...' : image ? 'Change photo' : 'Click to upload photo'}</span>
                                <input onChange={handleImage} type="file" accept="image/*" disabled={uploading} style={{ display: 'none' }} />
                            </label>
                        </div>

                        {/* Name row */}
                        <div className="form-row">
                            <div className="form-group">
                                <label className="form-label">First Name</label>
                                <input
                                    value={form.firstName}
                                    onChange={(e) => setform({ ...form, firstName: e.target.value })}
                                    type="text" className="form-input" placeholder="John"
                                />
                                {error?.firstName && <p className="error-message">{error.firstName}</p>}
                            </div>
                            <div className="form-group">
                                <label className="form-label">Last Name</label>
                                <input
                                    value={form.lastName}
                                    onChange={(e) => setform({ ...form, lastName: e.target.value })}
                                    type="text" className="form-input" placeholder="Doe"
                                />
                                {error?.lastName && <p className="error-message">{error.lastName}</p>}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email</label>
                            <input
                                value={form.email}
                                onChange={(e) => setform({ ...form, email: e.target.value })}
                                type="email" className="form-input" placeholder="you@example.com"
                            />
                            {error?.email && <p className="error-message">{error.email}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">Password</label>
                            <input
                                value={form.password}
                                onChange={(e) => setform({ ...form, password: e.target.value })}
                                type="password" className="form-input" placeholder="Create a password"
                            />
                            {error?.password && <p className="error-message">{error.password}</p>}
                        </div>

                        <div className="form-group">
                            <label className="form-label">I want to</label>
                            <select
                                value={form.role}
                                onChange={(e) => setform({ ...form, role: e.target.value })}
                                className="form-input"
                            >
                                <option value="student">Learn (Student)</option>
                                <option value="instructor">Teach (Instructor)</option>
                            </select>
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading || uploading}>
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Already have an account? <a href="/login">Log in</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Signup