import React, { useState, useEffect, useCallback } from 'react'
import { useTrainingStore } from '@/stores'
import { TimerIcon } from '../ui/Icons'

export const FloatingTimer: React.FC = () => {
    const {
        restTimerSeconds,
        restTimerStarted,
        restTimerActive,
        stopRestTimer,
        setTimerMinimized
    } = useTrainingStore()

    const [timeLeft, setTimeLeft] = useState(restTimerSeconds)

    useEffect(() => {
        if (!restTimerActive || !restTimerStarted) return

        const interval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - restTimerStarted) / 1000)
            const remaining = Math.max(0, restTimerSeconds - elapsed)
            setTimeLeft(remaining)

            if (remaining <= 0) {
                // Vibrate when timer ends
                if ('vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200, 100, 200])
                }
                stopRestTimer()
            }
        }, 100)

        return () => clearInterval(interval)
    }, [restTimerActive, restTimerStarted, restTimerSeconds, stopRestTimer])

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }, [])

    const handleClick = () => {
        setTimerMinimized(false)
    }

    return (
        <div className="floating-bubble" onClick={handleClick}>
            <TimerIcon size={20} />
            <span className="floating-bubble-time">{formatTime(timeLeft)}</span>
        </div>
    )
}
