import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { createContext } from 'react'


export interface Course {
    _id: string,
    title: string,
    description: string,
    price: number,
    thumbnail: string,
    instructor: {
        _id: string,
        firstName: string
        lastName: string
        email?: string
    },
    sections: {
        title: string,
        lessons: {
            title: string,
            videoUrl: string
        }[]
    }[],
    published: boolean,
    createdAt?: string
    updatedAt?: string
}

interface ContextProps {
    children: React.ReactNode
}

interface CourseContextType {
    token: null | string,
    setToken: React.Dispatch<React.SetStateAction<null | string>>,
    error: null | string,
    setError: React.Dispatch<React.SetStateAction<null | string>>,
    loading: boolean,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    courses: Course[],
    setCourses: React.Dispatch<React.SetStateAction<Course[]>>,
    refetchCourses: () => Promise<void>
}


export const courseContext = createContext<CourseContextType | null>(null)

export const useCourses = () => {
    const context = useContext(courseContext)
    if (!context) {
        throw new Error('useCourses must be used')
    }
    return context
}
export const CoursesContext = ({ children }: ContextProps) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
    const [error, setError] = useState<null | string>(null)
    const [loading, setLoading] = useState(false)
    const [courses, setCourses] = useState<Course[]>([])

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true)
            try {
                const res = await axios.get('http://localhost:5005/api/courses')
                console.log(res.data);
                if (res) {
                    setCourses(res.data)
                    setLoading(false)
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(error.response?.data?.message || 'Failed to fetch courses');
                } else {
                    setError('Something went wrong');
                }
                setLoading(false);
            }
        }
        fetchCourses()
    }, [])

    const refetchCourses = async () => {
        setLoading(true);
        try {
            const res = await axios.get('http://localhost:5005/api/courses');
            setCourses(res.data);
        } catch (error) {
            setError('Failed to fetch courses');
        } finally {
            setLoading(false);
        }
    };


    return (
        <>
            <courseContext.Provider value={{
                token,
                setToken,
                error,
                setError,
                loading,
                setLoading,
                courses,
                setCourses,
                refetchCourses
            }}>
                {children}
            </courseContext.Provider>
        </>
    )
}

export default CoursesContext