import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useWorkoutStore, useTrainingStore } from '@/stores'
import { db } from '@/lib/db'
import { Button, Card, StatCard, PlayIcon, FireIcon, TrophyIcon, CalendarIcon } from '@/components/ui'

export const Home: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { activeProgram, loadPrograms } = useWorkoutStore()
    const { isWorkoutActive } = useTrainingStore()
    const [monthlyWorkouts, setMonthlyWorkouts] = useState(0)
    const [streak, setStreak] = useState(0)

    useEffect(() => {
        const userId = user?.id || 'local-guest-user'
        loadPrograms(userId)

        // Carregar estatísticas reais
        const loadStats = async () => {
            const sessions = await db.workoutSessions.toArray()

            // Treinos do Mês
            const now = new Date()
            const workoutsThisMonth = sessions.filter((s) => {
                if (!s.started_at) return false
                const date = new Date(s.started_at)
                return date.getMonth() === now.getMonth() &&
                    date.getFullYear() === now.getFullYear()
            }).length
            setMonthlyWorkouts(workoutsThisMonth)

            // Streak (Dias Seguidos)
            const uniqueDates = [...new Set(sessions
                .filter(s => s.started_at) // garantir que tem data
                .map(s => new Date(s.started_at).toISOString().split('T')[0])
            )].sort().reverse()

            let currentStreak = 0
            if (uniqueDates.length > 0) {
                const today = new Date().toISOString().split('T')[0]
                const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

                // Se o ultimo treino foi hoje ou ontem, o streak ta vivo
                if (uniqueDates[0] === today || uniqueDates[0] === yesterday) {
                    currentStreak = 1
                    // Checar dias anteriores
                    for (let i = 0; i < uniqueDates.length - 1; i++) {
                        const curr = new Date(uniqueDates[i])
                        const prev = new Date(uniqueDates[i + 1])
                        const diffTime = Math.abs(curr.getTime() - prev.getTime())
                        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

                        if (diffDays === 1) {
                            currentStreak++
                        } else {
                            break
                        }
                    }
                }
            }
            setStreak(currentStreak)
        }

        loadStats()
    }, [user, loadPrograms])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Bom dia'
        if (hour < 18) return 'Boa tarde'
        return 'Boa noite'
    }

    const userName = user?.user_metadata?.name || 'Atleta'

    return (
        <div className="page">
            <header className="page-header">
                <h1 className="page-title">{getGreeting()}, {userName.split(' ')[0]}!</h1>
                <p className="page-subtitle">Pronto para mais um treino?</p>
            </header>

            {isWorkoutActive && (
                <Card
                    className="mb-lg"
                    onClick={() => navigate('/training')}
                    style={{
                        background: 'var(--color-accent-gradient)',
                        border: 'none'
                    }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(255,255,255,0.2)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <PlayIcon size={28} />
                        </div>
                        <div>
                            <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '4px' }}>
                                Treino em Andamento
                            </h3>
                            <p style={{ opacity: 0.8 }}>Toque para continuar</p>
                        </div>
                    </div>
                </Card>
            )}

            <div className="grid-2 mb-lg">
                <StatCard value={monthlyWorkouts.toString()} label="Treinos este mês" icon={<FireIcon size={24} className="text-accent" />} />
                <StatCard value={streak.toString()} label="Dias seguidos" icon={<CalendarIcon size={24} className="text-accent" />} />
            </div>

            {activeProgram ? (
                <section className="mb-lg">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                        <h2 style={{ fontSize: 'var(--font-size-xl)' }}>Programa Ativo</h2>
                        <button
                            onClick={() => navigate('/workouts')}
                            style={{ background: 'none', border: 'none', color: 'var(--color-accent)', cursor: 'pointer' }}
                        >
                            Ver todos
                        </button>
                    </div>
                    <Card onClick={() => navigate(`/workouts/${activeProgram.id}`)}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                            <div style={{
                                width: '48px',
                                height: '48px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--color-accent-gradient)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <TrophyIcon size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: 'var(--font-size-lg)', marginBottom: '4px' }}>
                                    {activeProgram.name}
                                </h3>
                                <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                    {activeProgram.description || 'Toque para ver fichas'}
                                </p>
                            </div>
                        </div>
                    </Card>
                </section>
            ) : (
                <section className="mb-lg">
                    <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                        <TrophyIcon size={48} className="text-accent" />
                        <h3 style={{ marginTop: 'var(--spacing-md)', marginBottom: 'var(--spacing-sm)' }}>
                            Nenhum programa ativo
                        </h3>
                        <p className="text-secondary" style={{ marginBottom: 'var(--spacing-lg)' }}>
                            Crie seu primeiro programa de treino para começar
                        </p>
                        <Button onClick={() => navigate('/workouts')}>
                            Criar Programa
                        </Button>
                    </Card>
                </section>
            )}

            <section>
                <h2 style={{ fontSize: 'var(--font-size-xl)', marginBottom: 'var(--spacing-md)' }}>
                    Dica do Dia
                </h2>
                <Card glass>
                    <p style={{ fontSize: 'var(--font-size-md)', lineHeight: 1.6 }}>
                        💡 <strong>Progressão de carga:</strong> Aumente o peso quando conseguir completar
                        todas as séries com boa forma e as repetições máximas programadas.
                    </p>
                </Card>
            </section>
        </div>
    )
}
