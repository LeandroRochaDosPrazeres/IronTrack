import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Layout } from '@/components/layout'
import { Home, Workouts, ProgramDetail, Training, Analytics, Profile } from '@/pages'
import { useAuthStore, useExerciseStore } from '@/stores'
import { supabase } from '@/lib/supabase'
import { db } from '@/lib/db'
import { exerciseDatabase } from '@/data/exercises'

const App: React.FC = () => {
    // App Version 1.0.1 - Build Fixes Applied
    const { setUser, setLoading } = useAuthStore()
    const { loadExercises } = useExerciseStore()

    // Initialize auth listener
    useEffect(() => {
        // Check current session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null)
        })

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null)
        })

        return () => subscription.unsubscribe()
    }, [setUser, setLoading])

    // Initialize exercise database
    useEffect(() => {
        const initExercises = async () => {
            const count = await db.exercises.count()

            if (count === 0) {
                // Populate with default exercises
                const defaultExercises = exerciseDatabase.map((ex) => ({
                    ...ex,
                    id: crypto.randomUUID(),
                    user_id: null,
                    is_custom: false,
                    synced: true
                }))

                await db.exercises.bulkAdd(defaultExercises)
            }

            await loadExercises()
        }

        initExercises()
    }, [loadExercises])

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/training" element={<Training />} />
                <Route
                    path="*"
                    element={
                        <Layout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/workouts" element={<Workouts />} />
                                <Route path="/workouts/:programId" element={<ProgramDetail />} />
                                <Route path="/analytics" element={<Analytics />} />
                                <Route path="/profile" element={<Profile />} />
                            </Routes>
                        </Layout>
                    }
                />
            </Routes>
        </BrowserRouter>
    )
}

export default App
