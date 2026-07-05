import React from 'react'
import { Link } from 'react-router-dom'
import './Home.css'
import { useCourses } from '../context/CoursesContext'

const HomePage = () => {
    const { courses  } = useCourses()

    const courseLength = courses? courses.length : 0
   
    
  return (
    <>
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">The Modern Learning Platform</p>
          <h1 className="hero-title">
            Learn skills that<br />
            <span className="hero-title-accent">actually matter.</span>
          </h1>
          <p className="hero-subtitle">
            Expert-led courses built for the modern learner. Start where you are,
            go where you want to be.
          </p>
          <div className="hero-actions">
            <Link to="/courses" className="hero-btn-primary">Browse Courses</Link>
            <Link to="/signup" className="hero-btn-secondary">Start Teaching</Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-number">500+</span>
              <span className="hero-stat-label">Students</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number">{courseLength}+</span>
              <span className="hero-stat-label">Courses</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-number">20+</span>
              <span className="hero-stat-label">Instructors</span>
            </div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-card">
            <div className="hero-card-top">
              <span className="hero-card-badge">Bestseller</span>
            </div>
            <div className="hero-card-body">
              <p className="hero-card-label">FEATURED COURSE</p>
              <h3 className="hero-card-title">React Mastery 2025</h3>
              <p className="hero-card-meta">By Olu Iyiola</p>
              <div className="hero-card-progress">
                <div className="hero-card-bar">
                  <div className="hero-card-fill" style={{ width: '72%' }} />
                </div>
                <span className="hero-card-pct">72% complete</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how-section">
        <div className="how-inner">
          <p className="section-label">How it works</p>
          <h2 className="section-title">Three steps to start learning</h2>
          <div className="how-grid">
            <div className="how-card">
              <div className="how-number">01</div>
              <h3 className="how-card-title">Create an account</h3>
              <p className="how-card-text">Sign up as a student or instructor in seconds. No credit card required to browse.</p>
            </div>
            <div className="how-card">
              <div className="how-number">02</div>
              <h3 className="how-card-title">Browse & enroll</h3>
              <p className="how-card-text">Find the course that fits your goals. Secure checkout powered by Razorpay.</p>
            </div>
            <div className="how-card">
              <div className="how-number">03</div>
              <h3 className="how-card-title">Learn & grow</h3>
              <p className="how-card-text">Watch lessons at your own pace. Track your progress and mark courses complete.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="features-inner">
          <div className="features-text">
            <p className="section-label">Why LearnWithMe</p>
            <h2 className="section-title">Everything you need<br />to learn faster.</h2>
            <p className="features-subtitle">
              We built LearnWithMe with one goal — make quality education accessible
              and straightforward for everyone.
            </p>
            <Link to="/courses" className="features-cta">Explore Courses →</Link>
          </div>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">🎬</span>
              <div>
                <h4 className="feature-title">Video lessons</h4>
                <p className="feature-text">High quality content from expert instructors.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📈</span>
              <div>
                <h4 className="feature-title">Progress tracking</h4>
                <p className="feature-text">See exactly how far you've come in every course.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">♾️</span>
              <div>
                <h4 className="feature-title">Lifetime access</h4>
                <p className="feature-text">Enroll once, learn forever. No subscriptions.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">💳</span>
              <div>
                <h4 className="feature-title">Secure payments</h4>
                <p className="feature-text">Powered by Razorpay — fast and safe checkout.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">📱</span>
              <div>
                <h4 className="feature-title">Any device</h4>
                <p className="feature-text">Learn on your laptop, tablet, or phone.</p>
              </div>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🎓</span>
              <div>
                <h4 className="feature-title">Expert instructors</h4>
                <p className="feature-text">Learn from practitioners who do the work daily.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-inner">
          <h2 className="cta-title">Ready to start learning?</h2>
          <p className="cta-subtitle">Join thousands of learners building skills that matter.</p>
          <div className="cta-actions">
            <Link to="/signup" className="hero-btn-primary">Get Started Free</Link>
            <Link to="/courses" className="cta-btn-ghost">Browse Courses</Link>
          </div>
        </div>
      </section>

    </div>  
    </>
  )
}

export default HomePage