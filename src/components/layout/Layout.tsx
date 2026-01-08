import React from 'react'
import { TabBar } from './TabBar'
import { useTrainingStore } from '@/stores'
import { FloatingTimer } from '../training/FloatingTimer'

interface LayoutProps {
    children: React.ReactNode
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    const { isWorkoutActive, restTimerActive, isTimerMinimized } = useTrainingStore()

    return (
        <div className="app-container">
            {children}
            {isWorkoutActive && restTimerActive && isTimerMinimized && <FloatingTimer />}
            {!isWorkoutActive && <TabBar />}
        </div>
    )
}
