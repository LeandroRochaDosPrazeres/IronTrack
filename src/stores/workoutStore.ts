import { create } from 'zustand'
import { db, generateId } from '@/lib/db'
import type { Program, WorkoutTemplate, TemplateExercise } from '@/types'

interface WorkoutState {
    // Current program and template
    activeProgram: Program | null
    activeTemplate: WorkoutTemplate | null

    // Lists
    programs: Program[]
    templates: WorkoutTemplate[]
    templateExercises: TemplateExercise[]

    // Loading states
    isLoading: boolean

    // Actions
    setActiveProgram: (program: Program | null) => void
    setActiveTemplate: (template: WorkoutTemplate | null) => void

    // Program CRUD
    loadPrograms: (userId: string) => Promise<void>
    createProgram: (userId: string, name: string, description?: string) => Promise<Program>
    updateProgram: (id: string, data: Partial<Program>) => Promise<void>
    deleteProgram: (id: string) => Promise<void>
    setActiveProgramById: (id: string) => Promise<void>

    // Template CRUD
    loadTemplates: (programId: string) => Promise<void>
    createTemplate: (programId: string, name: string) => Promise<WorkoutTemplate>
    updateTemplate: (id: string, data: Partial<WorkoutTemplate>) => Promise<void>
    deleteTemplate: (id: string) => Promise<void>
    reorderTemplates: (templates: WorkoutTemplate[]) => Promise<void>

    // Template Exercises CRUD
    loadTemplateExercises: (templateId: string) => Promise<void>
    addExerciseToTemplate: (templateId: string, exerciseId: string, config?: Partial<TemplateExercise>) => Promise<TemplateExercise>
    updateTemplateExercise: (id: string, data: Partial<TemplateExercise>) => Promise<void>
    removeExerciseFromTemplate: (id: string) => Promise<void>
    reorderTemplateExercises: (exercises: TemplateExercise[]) => Promise<void>
}

export const useWorkoutStore = create<WorkoutState>((set, get) => ({
    activeProgram: null,
    activeTemplate: null,
    programs: [],
    templates: [],
    templateExercises: [],
    isLoading: false,

    setActiveProgram: (program) => set({ activeProgram: program }),
    setActiveTemplate: (template) => set({ activeTemplate: template }),

    // Program CRUD
    loadPrograms: async (userId: string) => {
        set({ isLoading: true })
        try {
            const programs = await db.programs
                .where('user_id')
                .equals(userId)
                .toArray()
            set({ programs, isLoading: false })
        } catch (error) {
            console.error('Error loading programs:', error)
            set({ isLoading: false })
        }
    },

    createProgram: async (userId: string, name: string, description?: string) => {
        const program: Program = {
            id: generateId(),
            user_id: userId,
            name,
            description: description || null,
            is_active: false,
            created_at: new Date().toISOString()
        }

        await db.programs.add({ ...program, synced: false })
        await db.addPendingSync('programs', 'create', program)

        set((state) => ({ programs: [...state.programs, program] }))
        return program
    },

    updateProgram: async (id: string, data: Partial<Program>) => {
        await db.programs.update(id, { ...data, synced: false })
        await db.addPendingSync('programs', 'update', { id, ...data })

        set((state) => ({
            programs: state.programs.map((p) =>
                p.id === id ? { ...p, ...data } : p
            ),
            activeProgram: state.activeProgram?.id === id
                ? { ...state.activeProgram, ...data }
                : state.activeProgram
        }))
    },

    deleteProgram: async (id: string) => {
        await db.programs.delete(id)
        await db.addPendingSync('programs', 'delete', { id })

        // Also delete related templates
        const templates = await db.workoutTemplates
            .where('program_id')
            .equals(id)
            .toArray()

        for (const template of templates) {
            await db.workoutTemplates.delete(template.id)
        }

        set((state) => ({
            programs: state.programs.filter((p) => p.id !== id),
            activeProgram: state.activeProgram?.id === id ? null : state.activeProgram
        }))
    },

    setActiveProgramById: async (id: string) => {
        const { programs, activeProgram } = get()

        // Deactivate current active program
        if (activeProgram) {
            await db.programs.update(activeProgram.id, { is_active: false })
        }

        // Activate new program
        await db.programs.update(id, { is_active: true })

        const newActiveProgram = programs.find((p) => p.id === id)
        if (newActiveProgram) {
            set({
                programs: programs.map((p) => ({
                    ...p,
                    is_active: p.id === id
                })),
                activeProgram: { ...newActiveProgram, is_active: true }
            })
        }
    },

    // Template CRUD
    loadTemplates: async (programId: string) => {
        set({ isLoading: true })
        try {
            const templates = await db.workoutTemplates
                .where('program_id')
                .equals(programId)
                .sortBy('order_index')
            set({ templates, isLoading: false })
        } catch (error) {
            console.error('Error loading templates:', error)
            set({ isLoading: false })
        }
    },

    createTemplate: async (programId: string, name: string) => {
        const { templates } = get()
        const template: WorkoutTemplate = {
            id: generateId(),
            program_id: programId,
            name,
            day_of_week: null,
            order_index: templates.length,
            created_at: new Date().toISOString()
        }

        await db.workoutTemplates.add({ ...template, synced: false })
        await db.addPendingSync('workout_templates', 'create', template)

        set((state) => ({ templates: [...state.templates, template] }))
        return template
    },

    updateTemplate: async (id: string, data: Partial<WorkoutTemplate>) => {
        await db.workoutTemplates.update(id, { ...data, synced: false })
        await db.addPendingSync('workout_templates', 'update', { id, ...data })

        set((state) => ({
            templates: state.templates.map((t) =>
                t.id === id ? { ...t, ...data } : t
            ),
            activeTemplate: state.activeTemplate?.id === id
                ? { ...state.activeTemplate, ...data }
                : state.activeTemplate
        }))
    },

    deleteTemplate: async (id: string) => {
        await db.workoutTemplates.delete(id)
        await db.addPendingSync('workout_templates', 'delete', { id })

        // Also delete related exercises
        await db.templateExercises
            .where('template_id')
            .equals(id)
            .delete()

        set((state) => ({
            templates: state.templates.filter((t) => t.id !== id),
            activeTemplate: state.activeTemplate?.id === id ? null : state.activeTemplate
        }))
    },

    reorderTemplates: async (templates: WorkoutTemplate[]) => {
        const updates = templates.map((t, index) => ({
            ...t,
            order_index: index
        }))

        for (const template of updates) {
            await db.workoutTemplates.update(template.id, { order_index: template.order_index })
        }

        set({ templates: updates })
    },

    // Template Exercises CRUD
    loadTemplateExercises: async (templateId: string) => {
        try {
            const templateExercises = await db.templateExercises
                .where('template_id')
                .equals(templateId)
                .sortBy('order_index')
            set({ templateExercises })
        } catch (error) {
            console.error('Error loading template exercises:', error)
        }
    },

    addExerciseToTemplate: async (templateId: string, exerciseId: string, config?: Partial<TemplateExercise>) => {
        const { templateExercises } = get()
        const templateExercise: TemplateExercise = {
            id: generateId(),
            template_id: templateId,
            exercise_id: exerciseId,
            order_index: templateExercises.length,
            rest_seconds: config?.rest_seconds || 90,
            notes: config?.notes || null,
            target_sets: config?.target_sets || 3,
            target_reps: config?.target_reps || '8-12',
            set_type: config?.set_type || 'normal'
        }

        await db.templateExercises.add({ ...templateExercise, synced: false })
        await db.addPendingSync('template_exercises', 'create', templateExercise)

        set((state) => ({
            templateExercises: [...state.templateExercises, templateExercise]
        }))
        return templateExercise
    },

    updateTemplateExercise: async (id: string, data: Partial<TemplateExercise>) => {
        await db.templateExercises.update(id, { ...data, synced: false })
        await db.addPendingSync('template_exercises', 'update', { id, ...data })

        set((state) => ({
            templateExercises: state.templateExercises.map((te) =>
                te.id === id ? { ...te, ...data } : te
            )
        }))
    },

    removeExerciseFromTemplate: async (id: string) => {
        await db.templateExercises.delete(id)
        await db.addPendingSync('template_exercises', 'delete', { id })

        set((state) => ({
            templateExercises: state.templateExercises.filter((te) => te.id !== id)
        }))
    },

    reorderTemplateExercises: async (exercises: TemplateExercise[]) => {
        const updates = exercises.map((e, index) => ({
            ...e,
            order_index: index
        }))

        for (const exercise of updates) {
            await db.templateExercises.update(exercise.id, { order_index: exercise.order_index })
        }

        set({ templateExercises: updates })
    }
}))
