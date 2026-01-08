import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true
    }
})

// Email/Password helpers
export const signUpWithEmail = async (email: string, password: string, name: string, age: string) => {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                age
            }
        }
    })
    return { data, error }
}

export const signInWithEmail = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    })
    return { data, error }
}

export const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
}

export const getCurrentUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

// Session listener
export const onAuthStateChange = (callback: (event: string, session: unknown) => void) => {
    return supabase.auth.onAuthStateChange(callback)
}
