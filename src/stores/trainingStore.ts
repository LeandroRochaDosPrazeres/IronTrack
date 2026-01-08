import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db, generateId } from '@/lib/db'
import type { WorkoutSession, SetLog, TemplateExercise } from '@/types'

interface ActiveSet {
    exerciseId: string
    setNumber: number
    weight: number | null
    reps: number | null
    rpe: number | null
    rir: number | null
    setType: string
    completed: boolean
}

interface TrainingState {
    // Current workout session
    activeSession: WorkoutSession | null
    isWorkoutActive: boolean

    // Exercise tracking
    currentExerciseIndex: number
    exercises: TemplateExercise[]
    sets: Record<string, ActiveSet[]>

    // Timer
    restTimerActive: boolean
    restTimerSeconds: number
    restTimerStarted: number | null
    isTimerMinimized: boolean

    // Previous workout data (for auto-fill)
    previousWorkoutData: Record<string, SetLog[]>

    // Actions
    startWorkout: (userId: string, templateId: string, exercises: TemplateExercise[]) => Promise<void>
    endWorkout: () => Promise<void>
    cancelWorkout: () => void

    // Exercise navigation
    setCurrentExerciseIndex: (index: number) => void
    nextExercise: () => void
    previousExercise: () => void

    // Set management
    updateSet: (exerciseId: string, setIndex: number, data: Partial<ActiveSet>) => void
    completeSet: (exerciseId: string, setIndex: number) => Promise<void>
    addSet: (exerciseId: string) => void
    removeSet: (exerciseId: string, setIndex: number) => void

    // Timer
    startRestTimer: (seconds: number) => void
    stopRestTimer: () => void
    setTimerMinimized: (minimized: boolean) => void

    // Auto-fill
    loadPreviousWorkoutData: (userId: string, exerciseIds: string[]) => Promise<void>
    autoFillSet: (exerciseId: string, setIndex: number) => void
}

export const useTrainingStore = create<TrainingState>()(
    persist(
        (set, get) => ({
            activeSession: null,
            isWorkoutActive: false,
            currentExerciseIndex: 0,
            exercises: [],
            sets: {},
            restTimerActive: false,
            restTimerSeconds: 0,
            restTimerStarted: null,
            isTimerMinimized: false,
            previousWorkoutData: {},

            startWorkout: async (userId: string, templateId: string, exercises: TemplateExercise[]) => {
                const session: WorkoutSession = {
                    id: generateId(),
                    user_id: userId,
                    template_id: templateId,
                    started_at: new Date().toISOString(),
                    finished_at: null,
                    notes: null,
                    energy_level: null,
                    total_volume: null
                }

                await db.workoutSessions.add({ ...session, synced: false })

                // Initialize sets for each exercise
                const initialSets: Record<string, ActiveSet[]> = {}
                exercises.forEach((ex) => {
                    initialSets[ex.exercise_id] = Array.from({ length: ex.target_sets }, (_, i) => ({
                        exerciseId: ex.exercise_id,
                        setNumber: i + 1,
                        weight: null,
                        reps: null,
                        rpe: null,
                        rir: null,
                        setType: ex.set_type,
                        completed: false
                    }))
                })

                set({
                    activeSession: session,
                    isWorkoutActive: true,
                    currentExerciseIndex: 0,
                    exercises,
                    sets: initialSets
                })

                // Load previous workout data for auto-fill
                await get().loadPreviousWorkoutData(
                    userId,
                    exercises.map((e) => e.exercise_id)
                )
            },

            endWorkout: async () => {
                const { activeSession, sets } = get()
                if (!activeSession) return

                // Calculate total volume
                let totalVolume = 0
                const setLogs: SetLog[] = []

                Object.entries(sets).forEach(([exerciseId, exerciseSets]) => {
                    exerciseSets.filter(s => s.completed).forEach((s) => {
                        const volume = (s.weight || 0) * (s.reps || 0)
                        totalVolume += volume

                        setLogs.push({
                            id: generateId(),
                            session_id: activeSession.id,
                            exercise_id: exerciseId,
                            set_number: s.setNumber,
                            weight: s.weight,
                            reps: s.reps,
                            rpe: s.rpe,
                            rir: s.rir,
                            set_type: s.setType,
                            completed_at: new Date().toISOString()
                        })
                    })
                })

                // Save set logs
                await db.setLogs.bulkAdd(setLogs.map(log => ({ ...log, synced: false })))

                // Update session
                const finishedSession = {
                    ...activeSession,
                    finished_at: new Date().toISOString(),
                    total_volume: totalVolume
                }
                await db.workoutSessions.update(activeSession.id, finishedSession)

                set({
                    activeSession: null,
                    isWorkoutActive: false,
                    currentExerciseIndex: 0,
                    exercises: [],
                    sets: {},
                    restTimerActive: false,
                    restTimerSeconds: 0,
                    restTimerStarted: null
                })
            },

            cancelWorkout: () => {
                const { activeSession } = get()
                if (activeSession) {
                    db.workoutSessions.delete(activeSession.id)
                }

                set({
                    activeSession: null,
                    isWorkoutActive: false,
                    currentExerciseIndex: 0,
                    exercises: [],
                    sets: {},
                    restTimerActive: false,
                    restTimerSeconds: 0,
                    restTimerStarted: null
                })
            },

            setCurrentExerciseIndex: (index: number) => {
                set({ currentExerciseIndex: index })
            },

            nextExercise: () => {
                const { currentExerciseIndex, exercises } = get()
                if (currentExerciseIndex < exercises.length - 1) {
                    set({ currentExerciseIndex: currentExerciseIndex + 1 })
                }
            },

            previousExercise: () => {
                const { currentExerciseIndex } = get()
                if (currentExerciseIndex > 0) {
                    set({ currentExerciseIndex: currentExerciseIndex - 1 })
                }
            },

            updateSet: (exerciseId: string, setIndex: number, data: Partial<ActiveSet>) => {
                set((state) => ({
                    sets: {
                        ...state.sets,
                        [exerciseId]: state.sets[exerciseId].map((s, i) =>
                            i === setIndex ? { ...s, ...data } : s
                        )
                    }
                }))
            },

            completeSet: async (exerciseId: string, setIndex: number) => {
                const { exercises } = get()
                const exercise = exercises.find((e) => e.exercise_id === exerciseId)

                set((state) => ({
                    sets: {
                        ...state.sets,
                        [exerciseId]: state.sets[exerciseId].map((s, i) =>
                            i === setIndex ? { ...s, completed: true } : s
                        )
                    }
                }))

                // Trigger haptic feedback
                if ('vibrate' in navigator) {
                    navigator.vibrate(50)
                }

                // Start rest timer
                if (exercise) {
                    get().startRestTimer(exercise.rest_seconds)
                }
            },

            addSet: (exerciseId: string) => {
                set((state) => {
                    const currentSets = state.sets[exerciseId] || []
                    const newSet: ActiveSet = {
                        exerciseId,
                        setNumber: currentSets.length + 1,
                        weight: null,
                        reps: null,
                        rpe: null,
                        rir: null,
                        setType: 'normal',
                        completed: false
                    }
                    return {
                        sets: {
                            ...state.sets,
                            [exerciseId]: [...currentSets, newSet]
                        }
                    }
                })
            },

            removeSet: (exerciseId: string, setIndex: number) => {
                set((state) => ({
                    sets: {
                        ...state.sets,
                        [exerciseId]: state.sets[exerciseId]
                            .filter((_, i) => i !== setIndex)
                            .map((s, i) => ({ ...s, setNumber: i + 1 }))
                    }
                }))
            },

            startRestTimer: (seconds: number) => {
                set({
                    restTimerActive: true,
                    restTimerSeconds: seconds,
                    restTimerStarted: Date.now()
                })
            },

            stopRestTimer: () => {
                set({
                    restTimerActive: false,
                    restTimerSeconds: 0,
                    restTimerStarted: null
                })
            },

            setTimerMinimized: (minimized: boolean) => {
                set({ isTimerMinimized: minimized })
            },

            loadPreviousWorkoutData: async (_userId: string, exerciseIds: string[]) => {
                const previousData: Record<string, SetLog[]> = {}

                for (const exerciseId of exerciseIds) {
                    const logs = await db.setLogs
                        .where('exercise_id')
                        .equals(exerciseId)
                        .reverse()
                        .limit(10)
                        .toArray()

                    if (logs.length > 0) {
                        previousData[exerciseId] = logs
                    }
                }

                set({ previousWorkoutData: previousData })
            },

            autoFillSet: (exerciseId: string, setIndex: number) => {
                const { previousWorkoutData } = get()
                const previousSets = previousWorkoutData[exerciseId]

                if (previousSets && previousSets[setIndex]) {
                    const prev = previousSets[setIndex]
                    get().updateSet(exerciseId, setIndex, {
                        weight: prev.weight,
                        reps: prev.reps
                    })
                }
            }
        }),
        {
            name: 'irontrack-training',
            partialize: (state) => ({
                activeSession: state.activeSession,
                isWorkoutActive: state.isWorkoutActive,
                currentExerciseIndex: state.currentExerciseIndex,
                exercises: state.exercises,
                sets: state.sets
            })
        }
    )
)
