import React, { type ReactNode } from 'react'
import { useCourses } from './context/CoursesContext'
import { Navigate } from 'react-router-dom'

interface AuthProps {
    children: ReactNode
}
const AuthGuard = ({ children }: AuthProps) => {
    const { token } = useCourses()
    if (!token) {
        return <Navigate to="/login" replace />
    }

    return (
        <>
            {children}
        </>
    )
}

export default AuthGuard