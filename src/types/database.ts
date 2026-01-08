// Database Types for Supabase
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    name: string | null
                    avatar_url: string | null
                    created_at: string
                }
                Insert: {
                    id: string
                    name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    name?: string | null
                    avatar_url?: string | null
                    created_at?: string
                }
            }
            programs: {
                Row: {
                    id: string
                    user_id: string
                    name: string
                    description: string | null
                    is_active: boolean
                    created_at: string
                }
                Insert: {
                    id?: string
                    user_id: string
                    name: string
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    user_id?: string
                    name?: string
                    description?: string | null
                    is_active?: boolean
                    created_at?: string
                }
            }
            workout_templates: {
                Row: {
                    id: string
                    program_id: string
                    name: string
                    day_of_week: number | null
                    order_index: number | null
                    created_at: string
                }
                Insert: {
                    id?: string
                    program_id: string
                    name: string
                    day_of_week?: number | null
                    order_index?: number | null
                    created_at?: string
                }
                Update: {
                    id?: string
                    program_id?: string
                    name?: string
                    day_of_week?: number | null
                    order_index?: number | null
                    created_at?: string
                }
            }
            exercises: {
                Row: {
                    id: string
                    user_id: string | null
                    name: string
                    muscle_groups: string[]
                    equipment: string | null
                    movement_pattern: string | null
                    image_url: string | null
                    instructions: string | null
                    is_custom: boolean
                }
                Insert: {
                    id?: string
                    user_id?: string | null
                    name: string
                    muscle_groups?: string[]
                    equipment?: string | null
                    movement_pattern?: string | null
                    image_url?: string | null
                    instructions?: string | null
                    is_custom?: boolean
                }
                Update: {
                    id?: string
                    user_id?: string | null
                    name?: string
                    muscle_groups?: string[]
                    equipment?: string | null
                    movement_pattern?: string | null
                    image_url?: string | null
                    instructions?: string | null
                    is_custom?: boolean
                }
            }
            template_exercises: {
                Row: {
                    id: string
                    template_id: string
                    exercise_id: string
                    order_index: number | null
                    rest_seconds: number
                    notes: string | null
                    target_sets: number
                    target_reps: string
                    set_type: string
                }
                Insert: {
                    id?: string
                    template_id: string
                    exercise_id: string
                    order_index?: number | null
                    rest_seconds?: number
                    notes?: string | null
                    target_sets?: number
                    target_reps?: string
                    set_type?: string
                }
                Update: {
                    id?: string
                    template_id?: string
                    exercise_id?: string
                    order_index?: number | null
                    rest_seconds?: number
                    notes?: string | null
                    target_sets?: number
                    target_reps?: string
                    set_type?: string
                }
            }
            workout_sessions: {
                Row: {
                    id: string
                    user_id: string
                    template_id: string | null
                    started_at: string
                    finished_at: string | null
                    notes: string | null
                    energy_level: number | null
                    total_volume: number | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    template_id?: string | null
                    started_at?: string
                    finished_at?: string | null
                    notes?: string | null
                    energy_level?: number | null
                    total_volume?: number | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    template_id?: string | null
                    started_at?: string
                    finished_at?: string | null
                    notes?: string | null
                    energy_level?: number | null
                    total_volume?: number | null
                }
            }
            set_logs: {
                Row: {
                    id: string
                    session_id: string
                    exercise_id: string
                    set_number: number
                    weight: number | null
                    reps: number | null
                    rpe: number | null
                    rir: number | null
                    set_type: string | null
                    completed_at: string
                }
                Insert: {
                    id?: string
                    session_id: string
                    exercise_id: string
                    set_number: number
                    weight?: number | null
                    reps?: number | null
                    rpe?: number | null
                    rir?: number | null
                    set_type?: string | null
                    completed_at?: string
                }
                Update: {
                    id?: string
                    session_id?: string
                    exercise_id?: string
                    set_number?: number
                    weight?: number | null
                    reps?: number | null
                    rpe?: number | null
                    rir?: number | null
                    set_type?: string | null
                    completed_at?: string
                }
            }
            body_measurements: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    weight: number | null
                    body_fat: number | null
                    chest: number | null
                    waist: number | null
                    hips: number | null
                    arm_left: number | null
                    arm_right: number | null
                    thigh_left: number | null
                    thigh_right: number | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    date?: string
                    weight?: number | null
                    body_fat?: number | null
                    chest?: number | null
                    waist?: number | null
                    hips?: number | null
                    arm_left?: number | null
                    arm_right?: number | null
                    thigh_left?: number | null
                    thigh_right?: number | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    weight?: number | null
                    body_fat?: number | null
                    chest?: number | null
                    waist?: number | null
                    hips?: number | null
                    arm_left?: number | null
                    arm_right?: number | null
                    thigh_left?: number | null
                    thigh_right?: number | null
                }
            }
            biofeedback_logs: {
                Row: {
                    id: string
                    user_id: string
                    date: string
                    sleep_quality: number | null
                    stress_level: number | null
                    energy_level: number | null
                    notes: string | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    date?: string
                    sleep_quality?: number | null
                    stress_level?: number | null
                    energy_level?: number | null
                    notes?: string | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    date?: string
                    sleep_quality?: number | null
                    stress_level?: number | null
                    energy_level?: number | null
                    notes?: string | null
                }
            }
            achievements: {
                Row: {
                    id: string
                    user_id: string
                    badge_type: string
                    unlocked_at: string
                    data: Record<string, unknown> | null
                }
                Insert: {
                    id?: string
                    user_id: string
                    badge_type: string
                    unlocked_at?: string
                    data?: Record<string, unknown> | null
                }
                Update: {
                    id?: string
                    user_id?: string
                    badge_type?: string
                    unlocked_at?: string
                    data?: Record<string, unknown> | null
                }
            }
        }
    }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Program = Database['public']['Tables']['programs']['Row']
export type WorkoutTemplate = Database['public']['Tables']['workout_templates']['Row']
export type Exercise = Database['public']['Tables']['exercises']['Row']
export type TemplateExercise = Database['public']['Tables']['template_exercises']['Row']
export type WorkoutSession = Database['public']['Tables']['workout_sessions']['Row']
export type SetLog = Database['public']['Tables']['set_logs']['Row']
export type BodyMeasurement = Database['public']['Tables']['body_measurements']['Row']
export type BiofeedbackLog = Database['public']['Tables']['biofeedback_logs']['Row']
export type Achievement = Database['public']['Tables']['achievements']['Row']

// Extended types with relations
export interface TemplateExerciseWithDetails extends TemplateExercise {
    exercise: Exercise
}

export interface WorkoutTemplateWithExercises extends WorkoutTemplate {
    exercises: TemplateExerciseWithDetails[]
}

export interface ProgramWithTemplates extends Program {
    templates: WorkoutTemplateWithExercises[]
}

export interface WorkoutSessionWithLogs extends WorkoutSession {
    set_logs: SetLog[]
    template?: WorkoutTemplate
}

// Set types
export type SetType = 'normal' | 'warmup' | 'dropset' | 'restpause' | 'cluster'

// Muscle groups
export type MuscleGroup =
    | 'chest'
    | 'back'
    | 'shoulders'
    | 'biceps'
    | 'triceps'
    | 'forearms'
    | 'abs'
    | 'obliques'
    | 'quads'
    | 'hamstrings'
    | 'glutes'
    | 'calves'
    | 'traps'
    | 'lats'
    | 'lower_back'

// Movement patterns
export type MovementPattern =
    | 'horizontal_push'
    | 'horizontal_pull'
    | 'vertical_push'
    | 'vertical_pull'
    | 'squat'
    | 'hinge'
    | 'lunge'
    | 'carry'
    | 'rotation'
    | 'isolation'
