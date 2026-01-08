import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useWorkoutStore, useTrainingStore } from '@/stores'
import { Button, Card, StatCard, PlayIcon, FireIcon, TrophyIcon, CalendarIcon } from '@/components/ui'

export const Home: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const { activeProgram, loadPrograms } = useWorkoutStore()
    const { isWorkoutActive } = useTrainingStore()

    useEffect(() => {
        const userId = user?.id || 'local-guest-user'
        loadPrograms(userId)
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
                <StatCard value="12" label="Treinos este mês" icon={<FireIcon size={24} className="text-accent" />} />
                <StatCard value="3" label="Dias seguidos" icon={<CalendarIcon size={24} className="text-accent" />} />
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
