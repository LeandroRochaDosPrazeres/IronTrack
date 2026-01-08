import React, { useState, useEffect, useCallback } from 'react'
import { useTrainingStore } from '@/stores'
import { Button, XIcon } from '../ui'

interface RestTimerProps {
    onClose: () => void
}

export const RestTimer: React.FC<RestTimerProps> = ({ onClose }) => {
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
                if ('vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200, 100, 200])
                }
                // Play sound
                try {
                    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
                    const oscillator = audioContext.createOscillator()
                    const gainNode = audioContext.createGain()
                    oscillator.connect(gainNode)
                    gainNode.connect(audioContext.destination)
                    oscillator.frequency.value = 880
                    oscillator.type = 'sine'
                    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
                    oscillator.start(audioContext.currentTime)
                    oscillator.stop(audioContext.currentTime + 0.5)
                } catch (e) {
                    console.log('Audio not supported')
                }
                stopRestTimer()
                onClose()
            }
        }, 100)

        return () => clearInterval(interval)
    }, [restTimerActive, restTimerStarted, restTimerSeconds, stopRestTimer, onClose])

    const formatTime = useCallback((seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }, [])

    const handleMinimize = () => {
        setTimerMinimized(true)
        onClose()
    }

    const handleSkip = () => {
        stopRestTimer()
        onClose()
    }

    const progress = ((restTimerSeconds - timeLeft) / restTimerSeconds) * 100

    return (
        <div style={{
            position: 'fixed',
            inset: 0,
            background: 'var(--color-bg-primary)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 'var(--spacing-lg)'
        }}>
            <button
                onClick={handleMinimize}
                style={{
                    position: 'absolute',
                    top: 'calc(var(--safe-area-top) + 16px)',
                    right: '16px',
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--color-text-secondary)'
                }}
            >
                <XIcon size={24} />
            </button>

            <h2 style={{
                fontSize: 'var(--font-size-xl)',
                color: 'var(--color-text-secondary)',
                marginBottom: 'var(--spacing-lg)'
            }}>
                Tempo de Descanso
            </h2>

            <div style={{
                position: 'relative',
                width: '250px',
                height: '250px',
                marginBottom: 'var(--spacing-xl)'
            }}>
                <svg width="250" height="250" style={{ transform: 'rotate(-90deg)' }}>
                    <circle
                        cx="125"
                        cy="125"
                        r="110"
                        fill="none"
                        stroke="var(--color-bg-tertiary)"
                        strokeWidth="12"
                    />
                    <circle
                        cx="125"
                        cy="125"
                        r="110"
                        fill="none"
                        stroke="var(--color-accent)"
                        strokeWidth="12"
                        strokeLinecap="round"
                        strokeDasharray={`${2 * Math.PI * 110}`}
                        strokeDashoffset={`${2 * Math.PI * 110 * (1 - progress / 100)}`}
                        style={{ transition: 'stroke-dashoffset 0.1s linear' }}
                    />
                </svg>
                <div style={{
                    position: 'absolute',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <span className="timer-value" style={{ fontSize: '64px' }}>
                        {formatTime(timeLeft)}
                    </span>
                </div>
            </div>

            <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                <Button variant="secondary" onClick={handleSkip}>
                    Pular
                </Button>
                <Button variant="primary" onClick={onClose}>
                    Continuar Treino
                </Button>
            </div>
        </div>
    )
}
