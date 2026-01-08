import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTrainingStore, useExerciseStore } from '@/stores'
import { Button, Card, CheckIcon, ChevronLeftIcon, ChevronRightIcon, PlusIcon, MinusIcon, WeightIcon } from '@/components/ui'
import { RestTimer, PlateCalculator } from '@/components/training'

export const Training: React.FC = () => {
    const navigate = useNavigate()
    const {
        isWorkoutActive,
        exercises,
        sets,
        currentExerciseIndex,
        restTimerActive,
        isTimerMinimized,
        setCurrentExerciseIndex,
        updateSet,
        completeSet,
        addSet,
        removeSet,
        endWorkout,
        cancelWorkout,
        setTimerMinimized
    } = useTrainingStore()
    const { exercises: exerciseLib } = useExerciseStore()

    const [showPlateCalc, setShowPlateCalc] = useState(false)
    const [plateCalcWeight, setPlateCalcWeight] = useState(0)

    useEffect(() => {
        if (!isWorkoutActive) {
            navigate('/')
        }
    }, [isWorkoutActive, navigate])

    if (!isWorkoutActive || exercises.length === 0) {
        return null
    }

    const currentTemplateExercise = exercises[currentExerciseIndex]
    const currentExercise = exerciseLib.find(e => e.id === currentTemplateExercise?.exercise_id)
    const currentSets = sets[currentTemplateExercise?.exercise_id] || []

    const handleEndWorkout = async () => {
        if (confirm('Deseja finalizar o treino?')) {
            await endWorkout()
            navigate('/')
        }
    }

    const handleCancelWorkout = () => {
        if (confirm('Deseja abandonar o treino? Os dados não serão salvos.')) {
            cancelWorkout()
            navigate('/')
        }
    }

    const handleOpenPlateCalc = (weight: number) => {
        setPlateCalcWeight(weight)
        setShowPlateCalc(true)
    }

    const triggerHaptic = () => {
        if ('vibrate' in navigator) {
            navigator.vibrate(30)
        }
    }

    // Show rest timer if active and not minimized
    if (restTimerActive && !isTimerMinimized) {
        return <RestTimer onClose={() => setTimerMinimized(true)} />
    }

    return (
        <div className="page" style={{ paddingBottom: '100px' }}>
            {/* Header */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <button
                    onClick={handleCancelWorkout}
                    style={{ background: 'none', border: 'none', color: 'var(--color-error)' }}
                >
                    Abandonar
                </button>
                <span style={{ color: 'var(--color-text-secondary)' }}>
                    {currentExerciseIndex + 1}/{exercises.length}
                </span>
                <button
                    onClick={handleEndWorkout}
                    style={{ background: 'none', border: 'none', color: 'var(--color-success)', fontWeight: 'bold' }}
                >
                    Finalizar
                </button>
            </header>

            {/* Exercise Navigation */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 'var(--spacing-lg)'
            }}>
                <button
                    onClick={() => {
                        if (currentExerciseIndex > 0) {
                            setCurrentExerciseIndex(currentExerciseIndex - 1)
                            triggerHaptic()
                        }
                    }}
                    disabled={currentExerciseIndex === 0}
                    style={{
                        background: 'var(--color-bg-tertiary)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: currentExerciseIndex === 0 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
                    }}
                >
                    <ChevronLeftIcon size={24} />
                </button>

                <div style={{ textAlign: 'center', flex: 1, padding: '0 var(--spacing-md)' }}>
                    <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: '4px' }}>
                        {currentExercise?.name || 'Exercício'}
                    </h2>
                    <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                        {currentExercise?.muscle_groups.join(', ')}
                    </p>
                </div>

                <button
                    onClick={() => {
                        if (currentExerciseIndex < exercises.length - 1) {
                            setCurrentExerciseIndex(currentExerciseIndex + 1)
                            triggerHaptic()
                        }
                    }}
                    disabled={currentExerciseIndex === exercises.length - 1}
                    style={{
                        background: 'var(--color-bg-tertiary)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        width: '44px',
                        height: '44px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: currentExerciseIndex === exercises.length - 1 ? 'var(--color-text-tertiary)' : 'var(--color-text-primary)'
                    }}
                >
                    <ChevronRightIcon size={24} />
                </button>
            </div>

            {/* Notes */}
            {currentTemplateExercise?.notes && (
                <Card style={{ marginBottom: 'var(--spacing-md)', background: 'rgba(255, 107, 53, 0.1)', borderColor: 'var(--color-accent)' }}>
                    <p style={{ fontSize: 'var(--font-size-sm)' }}>
                        📝 {currentTemplateExercise.notes}
                    </p>
                </Card>
            )}

            {/* Sets Header */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '32px 1fr 1fr 50px 50px 48px',
                gap: 'var(--spacing-xs)',
                padding: 'var(--spacing-sm) var(--spacing-xs)',
                color: 'var(--color-text-secondary)',
                fontSize: '11px',
                fontWeight: 'var(--font-weight-medium)',
                textAlign: 'center'
            }}>
                <span>#</span>
                <span>KG</span>
                <span>REPS</span>
                <span>RPE</span>
                <span>RIR</span>
                <span>✓</span>
            </div>

            {/* Sets */}
            <Card style={{ marginBottom: 'var(--spacing-md)' }}>
                {currentSets.map((set, index) => (
                    <div
                        key={index}
                        className="set-row"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: '32px 1fr 1fr 50px 50px 48px',
                            gap: 'var(--spacing-xs)',
                            opacity: set.completed ? 0.6 : 1,
                            background: set.completed ? 'rgba(52, 199, 89, 0.1)' : 'transparent',
                            alignItems: 'center',
                            padding: '8px 4px'
                        }}
                    >
                        <span className="set-number" style={{ fontSize: '12px' }}>{set.setNumber}</span>

                        <div style={{ position: 'relative' }}>
                            <input
                                type="number"
                                inputMode="decimal"
                                className="set-input"
                                value={set.weight ?? ''}
                                onChange={(e) => updateSet(currentTemplateExercise.exercise_id, index, {
                                    weight: e.target.value ? parseFloat(e.target.value) : null
                                })}
                                placeholder="0"
                                disabled={set.completed}
                                style={{ width: '100%', textAlign: 'center' }}
                            />
                            {set.weight && set.weight >= 20 && (
                                <button
                                    onClick={() => handleOpenPlateCalc(set.weight!)}
                                    style={{
                                        position: 'absolute',
                                        right: '0',
                                        top: '0',
                                        background: 'none',
                                        border: 'none',
                                        color: 'var(--color-accent)',
                                        padding: '2px',
                                        opacity: 0.8
                                    }}
                                >
                                    <WeightIcon size={12} />
                                </button>
                            )}
                        </div>

                        <input
                            type="number"
                            inputMode="numeric"
                            className="set-input"
                            value={set.reps ?? ''}
                            onChange={(e) => updateSet(currentTemplateExercise.exercise_id, index, {
                                reps: e.target.value ? parseInt(e.target.value) : null
                            })}
                            placeholder="0"
                            disabled={set.completed}
                            style={{ width: '100%', textAlign: 'center' }}
                        />

                        <input
                            type="number"
                            inputMode="numeric"
                            className="set-input"
                            value={set.rpe ?? ''}
                            onChange={(e) => updateSet(currentTemplateExercise.exercise_id, index, {
                                rpe: e.target.value ? parseFloat(e.target.value) : null
                            })}
                            placeholder="-"
                            disabled={set.completed}
                            style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}
                            max={10}
                        />

                        <input
                            type="number"
                            inputMode="numeric"
                            className="set-input"
                            value={set.rir ?? ''}
                            onChange={(e) => updateSet(currentTemplateExercise.exercise_id, index, {
                                rir: e.target.value ? parseInt(e.target.value) : null
                            })}
                            placeholder="-"
                            disabled={set.completed}
                            style={{ width: '100%', textAlign: 'center', fontSize: '12px' }}
                        />

                        <button
                            className={`set-check ${set.completed ? 'completed' : ''}`}
                            onClick={() => {
                                if (!set.completed && set.weight && set.reps) {
                                    completeSet(currentTemplateExercise.exercise_id, index)
                                }
                            }}
                            disabled={set.completed || !set.weight || !set.reps}
                            style={{ width: '32px', height: '32px', margin: '0 auto' }}
                        >
                            <CheckIcon size={16} />
                        </button>
                    </div>
                ))}
            </Card>

            {/* Add/Remove Set */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                        if (currentSets.length > 1) {
                            removeSet(currentTemplateExercise.exercise_id, currentSets.length - 1)
                        }
                    }}
                    disabled={currentSets.length <= 1}
                >
                    <MinusIcon size={18} />
                    Remover Série
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => addSet(currentTemplateExercise.exercise_id)}
                >
                    <PlusIcon size={18} />
                    Adicionar Série
                </Button>
            </div>

            {/* Plate Calculator */}
            <PlateCalculator
                isOpen={showPlateCalc}
                onClose={() => setShowPlateCalc(false)}
                targetWeight={plateCalcWeight}
            />
        </div>
    )
}
