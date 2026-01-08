import Dexie, { Table } from 'dexie'
import type {
    Program,
    WorkoutTemplate,
    Exercise,
    TemplateExercise,
    WorkoutSession,
    SetLog,
    BodyMeasurement,
    BiofeedbackLog
} from '@/types'

// Local database for offline-first functionality
class IronTrackDB extends Dexie {
    programs!: Table<Program & { synced?: boolean }>
    workoutTemplates!: Table<WorkoutTemplate & { synced?: boolean }>
    exercises!: Table<Exercise & { synced?: boolean }>
    templateExercises!: Table<TemplateExercise & { synced?: boolean }>
    workoutSessions!: Table<WorkoutSession & { synced?: boolean }>
    setLogs!: Table<SetLog & { synced?: boolean }>
    bodyMeasurements!: Table<BodyMeasurement & { synced?: boolean }>
    biofeedbackLogs!: Table<BiofeedbackLog & { synced?: boolean }>
    pendingSync!: Table<{ id: string; table: string; action: 'create' | 'update' | 'delete'; data: unknown; createdAt: number }>

    constructor() {
        super('irontrack')

        this.version(1).stores({
            programs: 'id, user_id, name, is_active, created_at, synced',
            workoutTemplates: 'id, program_id, name, order_index, synced',
            exercises: 'id, user_id, name, *muscle_groups, equipment, is_custom, synced',
            templateExercises: 'id, template_id, exercise_id, order_index, synced',
            workoutSessions: 'id, user_id, template_id, started_at, finished_at, synced',
            setLogs: 'id, session_id, exercise_id, set_number, completed_at, synced',
            bodyMeasurements: 'id, user_id, date, synced',
            biofeedbackLogs: 'id, user_id, date, synced',
            pendingSync: 'id, table, action, createdAt'
        })
    }

    // Add pending sync operation
    async addPendingSync(table: string, action: 'create' | 'update' | 'delete', data: unknown) {
        await this.pendingSync.add({
            id: crypto.randomUUID(),
            table,
            action,
            data,
            createdAt: Date.now()
        })
    }

    // Get all pending sync operations
    async getPendingSync() {
        return this.pendingSync.orderBy('createdAt').toArray()
    }

    // Clear pending sync after successful sync
    async clearPendingSync(ids: string[]) {
        await this.pendingSync.bulkDelete(ids)
    }
}

export const db = new IronTrackDB()

// Helper function to generate UUID
export const generateId = () => crypto.randomUUID()
