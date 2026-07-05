import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';
import { useCourses } from '../context/CoursesContext';

const Login = () => {
    const [error, seterror] = useState<{ email?: string; password?: string } | null>(null)
    const [loading, setLoading] = useState(false)
    const [form, setform] = useState({ email: '', password: '' })
    const navigate = useNavigate()
    const { setToken, refetchCourses} = useCourses()

    const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        try {
            setLoading(true)
            const res = await axios.post('https://learnwithme-app-be-3.onrender.com/api/users/login', {
                email: form.email,
                password: form.password
            })
            const token = res.data.token
            localStorage.setItem('token', token)
            if (token) { await refetchCourses(); setToken(token); setLoading(false); navigate('/'); }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const data = error.response?.data;
                if (data?.errors) { seterror(data.errors) }
                else { seterror({ email: data?.message || 'Login failed' }) }
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
                    Unlock your potential with expert-led courses built for the modern learner.
                </p>
                <div className="auth-features">
                    <div className="auth-feature-item">
                        <span className="auth-feature-icon">🎬</span>
                        High quality video lessons
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-icon">📱</span>
                        Learn on any device
                    </div>
                    <div className="auth-feature-item">
                        <span className="auth-feature-icon">♾️</span>
                        Lifetime access to enrolled courses
                    </div>
                </div>
            </div>

            {/* ── Right panel ── */}
            <div className="auth-right">
                <div className="auth-card">
                    <div className="auth-header">
                        <div className="auth-icon">🔐</div>
                        <h1 className="auth-title">Welcome Back</h1>
                        <p className="auth-subtitle">Sign in to continue learning</p>
                    </div>

                    <form className="auth-form" onSubmit={handleSubmit}>
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
                                type="password" className="form-input" placeholder="Enter your password"
                            />
                            {error?.password && <p className="error-message">{error.password}</p>}
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="auth-footer">
                        Don't have an account? <a href="/signup">Sign up</a>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login