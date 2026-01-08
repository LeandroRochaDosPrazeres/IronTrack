import { create } from 'zustand'
import { db } from '@/lib/db'
import type { Exercise, MuscleGroup } from '@/types'

interface ExerciseState {
    exercises: Exercise[]
    filteredExercises: Exercise[]
    searchQuery: string
    selectedMuscleGroups: MuscleGroup[]
    selectedEquipment: string | null
    isLoading: boolean

    // Actions
    loadExercises: () => Promise<void>
    setSearchQuery: (query: string) => void
    setSelectedMuscleGroups: (groups: MuscleGroup[]) => void
    setSelectedEquipment: (equipment: string | null) => void
    filterExercises: () => void

    // CRUD
    createCustomExercise: (userId: string, data: Partial<Exercise>) => Promise<Exercise>
    updateExercise: (id: string, data: Partial<Exercise>) => Promise<void>
    deleteExercise: (id: string) => Promise<void>

    // Helpers
    getExerciseById: (id: string) => Exercise | undefined
    getSimilarExercises: (exerciseId: string) => Exercise[]
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
    exercises: [],
    filteredExercises: [],
    searchQuery: '',
    selectedMuscleGroups: [],
    selectedEquipment: null,
    isLoading: false,

    loadExercises: async () => {
        set({ isLoading: true })
        try {
            const exercises = await db.exercises.toArray()
            set({ exercises, filteredExercises: exercises, isLoading: false })
        } catch (error) {
            console.error('Error loading exercises:', error)
            set({ isLoading: false })
        }
    },

    setSearchQuery: (query: string) => {
        set({ searchQuery: query })
        get().filterExercises()
    },

    setSelectedMuscleGroups: (groups: MuscleGroup[]) => {
        set({ selectedMuscleGroups: groups })
        get().filterExercises()
    },

    setSelectedEquipment: (equipment: string | null) => {
        set({ selectedEquipment: equipment })
        get().filterExercises()
    },

    filterExercises: () => {
        const { exercises, searchQuery, selectedMuscleGroups, selectedEquipment } = get()

        let filtered = exercises

        // Search query filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter((e) =>
                e.name.toLowerCase().includes(query) ||
                e.muscle_groups.some((mg) => mg.toLowerCase().includes(query))
            )
        }

        // Muscle group filter
        if (selectedMuscleGroups.length > 0) {
            filtered = filtered.filter((e) =>
                selectedMuscleGroups.some((mg) => e.muscle_groups.includes(mg))
            )
        }

        // Equipment filter
        if (selectedEquipment) {
            filtered = filtered.filter((e) => e.equipment === selectedEquipment)
        }

        set({ filteredExercises: filtered })
    },

    createCustomExercise: async (userId: string, data: Partial<Exercise>) => {
        const exercise: Exercise = {
            id: crypto.randomUUID(),
            user_id: userId,
            name: data.name || 'Custom Exercise',
            muscle_groups: data.muscle_groups || [],
            equipment: data.equipment || null,
            movement_pattern: data.movement_pattern || null,
            image_url: data.image_url || null,
            instructions: data.instructions || null,
            is_custom: true
        }

        await db.exercises.add({ ...exercise, synced: false })
        await db.addPendingSync('exercises', 'create', exercise)

        set((state) => ({
            exercises: [...state.exercises, exercise],
            filteredExercises: [...state.filteredExercises, exercise]
        }))

        return exercise
    },

    updateExercise: async (id: string, data: Partial<Exercise>) => {
        await db.exercises.update(id, { ...data, synced: false })
        await db.addPendingSync('exercises', 'update', { id, ...data })

        set((state) => ({
            exercises: state.exercises.map((e) =>
                e.id === id ? { ...e, ...data } : e
            ),
            filteredExercises: state.filteredExercises.map((e) =>
                e.id === id ? { ...e, ...data } : e
            )
        }))
    },

    deleteExercise: async (id: string) => {
        await db.exercises.delete(id)
        await db.addPendingSync('exercises', 'delete', { id })

        set((state) => ({
            exercises: state.exercises.filter((e) => e.id !== id),
            filteredExercises: state.filteredExercises.filter((e) => e.id !== id)
        }))
    },

    getExerciseById: (id: string) => {
        return get().exercises.find((e) => e.id === id)
    },

    getSimilarExercises: (exerciseId: string) => {
        const { exercises } = get()
        const exercise = exercises.find((e) => e.id === exerciseId)

        if (!exercise) return []

        // Find exercises with same movement pattern or muscle groups
        return exercises.filter((e) => {
            if (e.id === exerciseId) return false

            // Same movement pattern
            if (e.movement_pattern && e.movement_pattern === exercise.movement_pattern) {
                return true
            }

            // Same primary muscle group
            if (e.muscle_groups.some((mg) => exercise.muscle_groups.includes(mg))) {
                return true
            }

            return false
        }).slice(0, 5)
    }
}))
