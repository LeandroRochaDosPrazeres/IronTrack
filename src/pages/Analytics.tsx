import React, { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '@/stores'
import { db, generateId } from '@/lib/db'
import { Button, Card, StatCard, FireIcon, TrophyIcon, Modal, Input, PlusIcon } from '@/components/ui'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { MuscleHeatmap } from '@/components/analytics/MuscleHeatmap'
import type { WorkoutSession, BodyMeasurement } from '@/types'

export const Analytics: React.FC = () => {
    const { user } = useAuthStore()
    const [sessions, setSessions] = useState<WorkoutSession[]>([])
    const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([])

    // Muscle Stats State
    const [muscleCounts, setMuscleCounts] = useState<Record<string, number>>({})
    const [muscleIntensities, setMuscleIntensities] = useState<Record<string, number>>({})

    const [newWeight, setNewWeight] = useState('')
    const [activeTab, setActiveTab] = useState<'volume' | 'frequency' | 'body'>('volume')
    const [showWeightModal, setShowWeightModal] = useState(false)

    useEffect(() => {
        const loadData = async () => {
            const userId = user?.id || 'local-guest-user'

            // 1. Sessions
            const sessionsData = await db.workoutSessions
                .where('user_id')
                .equals(userId)
                .reverse()
                .limit(50)
                .toArray()
            setSessions(sessionsData)

            // 2. Body Measurements
            const bodyData = await db.bodyMeasurements
                .where('user_id')
                .equals(userId)
                .reverse()
                .limit(30)
                .toArray()
            setBodyMeasurements(bodyData)

            // 3. Muscle Data (Heatmap & Frequency)
            // Need to join: Sessions -> SetLogs -> Exercises -> MuscleGroups

            // Fetch all exercises to map IDs to muscles
            const exercises = await db.exercises.toArray()
            const exerciseMap = new Map(exercises.map(e => [e.id, e.muscle_groups]))

            // Fetch recent logs (last 30 days essentially, or just last 500 sets)
            const logsData = await db.setLogs.limit(1000).toArray()

            // Create map of SessionID -> Date
            const sessionDateMap = new Map(sessionsData.map(s => [s.id, new Date(s.started_at)]))

            // Aggregators
            const counts: Record<string, number> = {}
            const lastTrained: Record<string, Date> = {}

            logsData.forEach(log => {
                const sessionDate = sessionDateMap.get(log.session_id)
                if (!sessionDate) return // Skip if session not in loaded range

                const muscles = exerciseMap.get(log.exercise_id) || []

                muscles.forEach(muscle => {
                    // Normalize muscle name (lowercase)
                    const m = muscle.toLowerCase()

                    // Frequency Count
                    counts[m] = (counts[m] || 0) + 1

                    // Last Trained for Heatmap
                    if (!lastTrained[m] || sessionDate > lastTrained[m]) {
                        lastTrained[m] = sessionDate
                    }
                })
            })

            setMuscleCounts(counts)

            // Calculate Intensities based on Recovery Time
            // < 24h: 4, < 48h: 3, < 72h: 2, < 96h: 1, else 0
            const now = new Date()
            const intensities: Record<string, number> = {}

            Object.entries(lastTrained).forEach(([muscle, date]) => {
                const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

                if (diffHours < 24) intensities[muscle] = 4
                else if (diffHours < 48) intensities[muscle] = 3
                else if (diffHours < 72) intensities[muscle] = 2
                else if (diffHours < 96) intensities[muscle] = 1
                else intensities[muscle] = 0
            })
            setMuscleIntensities(intensities)
        }

        loadData()
    }, [user])

    const handleSaveWeight = async () => {
        const weight = parseFloat(newWeight)
        if (!weight) return

        const userId = user?.id || 'local-guest-user'
        const measurement: BodyMeasurement = {
            id: generateId(),
            user_id: userId,
            date: new Date().toISOString(),
            weight,
            body_fat: null,
            chest: null,
            waist: null,
            hips: null,
            arm_left: null,
            arm_right: null,
            thigh_left: null,
            thigh_right: null
        }

        await db.bodyMeasurements.add({ ...measurement, synced: false })
        setBodyMeasurements(prev => [measurement, ...prev])
        setShowWeightModal(false)
        setNewWeight('')
    }

    const volumeData = useMemo(() => {
        return sessions
            .filter(s => s.total_volume)
            .slice(0, 10)
            .reverse()
            .map((s, i) => ({
                name: `T${i + 1}`,
                volume: Math.round(s.total_volume || 0),
                date: new Date(s.started_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
            }))
    }, [sessions])

    const weeklyStats = useMemo(() => {
        const now = new Date()
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        const weekSessions = sessions.filter(s => new Date(s.started_at) >= weekAgo)
        const totalVolume = weekSessions.reduce((sum, s) => sum + (s.total_volume || 0), 0)

        return {
            workouts: weekSessions.length,
            totalVolume: Math.round(totalVolume),
            avgVolume: weekSessions.length > 0 ? Math.round(totalVolume / weekSessions.length) : 0
        }
    }, [sessions])

    const muscleFrequency = useMemo(() => {
        // Convert counts object to array for chart
        return Object.entries(muscleCounts)
            .map(([muscle, count]) => ({
                muscle: muscle.charAt(0).toUpperCase() + muscle.slice(1), // Capitalize
                count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10) // Top 10
    }, [muscleCounts])

    return (
        <div className="page">
            <header className="page-header">
                <h1 className="page-title">Análise</h1>
                <p className="page-subtitle">Acompanhe sua evolução</p>
            </header>

            <div className="grid-2 mb-lg">
                <StatCard
                    value={weeklyStats.workouts}
                    label="Treinos esta semana"
                    icon={<FireIcon size={24} className="text-accent" />}
                />
                <StatCard
                    value={`${(weeklyStats.totalVolume / 1000).toFixed(1)}t`}
                    label="Volume total"
                    icon={<TrophyIcon size={24} className="text-accent" />}
                />
            </div>

            {/* Tabs */}
            <div style={{
                display: 'flex',
                gap: 'var(--spacing-xs)',
                marginBottom: 'var(--spacing-lg)',
                background: 'var(--color-bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                padding: '4px'
            }}>
                {[
                    { key: 'volume', label: 'Volume' },
                    { key: 'frequency', label: 'Frequência' },
                    { key: 'body', label: 'Corpo' }
                ].map(tab => (
                    <button
                        key={tab.key}
                        onClick={() => setActiveTab(tab.key as typeof activeTab)}
                        style={{
                            flex: 1,
                            padding: 'var(--spacing-sm)',
                            background: activeTab === tab.key ? 'var(--color-bg-elevated)' : 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-sm)',
                            color: activeTab === tab.key ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                            fontWeight: activeTab === tab.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                            cursor: 'pointer',
                            transition: 'all var(--transition-fast)'
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {activeTab === 'volume' && (
                <Card className="chart-container">
                    <h3 className="chart-title">Volume de Treino (kg)</h3>
                    {volumeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <LineChart data={volumeData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis
                                    dataKey="date"
                                    stroke="var(--color-text-secondary)"
                                    fontSize={12}
                                />
                                <YAxis
                                    stroke="var(--color-text-secondary)"
                                    fontSize={12}
                                    tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--color-bg-elevated)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                    labelStyle={{ color: 'var(--color-text-primary)' }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="volume"
                                    stroke="var(--color-accent)"
                                    strokeWidth={3}
                                    dot={{ fill: 'var(--color-accent)', strokeWidth: 0, r: 4 }}
                                    activeDot={{ r: 6, fill: 'var(--color-accent)' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-secondary)'
                        }}>
                            Sem dados de treino ainda
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'frequency' && (
                <Card className="chart-container">
                    <h3 className="chart-title">Frequência por Grupo Muscular</h3>
                    {muscleFrequency.length > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={muscleFrequency} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                <XAxis type="number" stroke="var(--color-text-secondary)" fontSize={12} />
                                <YAxis
                                    type="category"
                                    dataKey="muscle"
                                    stroke="var(--color-text-secondary)"
                                    fontSize={12}
                                    width={60}
                                />
                                <Tooltip
                                    contentStyle={{
                                        background: 'var(--color-bg-elevated)',
                                        border: '1px solid var(--color-border)',
                                        borderRadius: 'var(--radius-md)'
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="var(--color-accent)"
                                    radius={[0, 4, 4, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{
                            height: 200,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'var(--color-text-secondary)'
                        }}>
                            Nenhum dado registrado
                        </div>
                    )}
                </Card>
            )}

            {activeTab === 'body' && (
                <>
                    <Card className="chart-container">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--spacing-md)' }}>
                            <h3 className="chart-title">Peso Corporal (kg)</h3>
                            <Button size="sm" onClick={() => setShowWeightModal(true)}>
                                <PlusIcon size={16} />
                                Registrar
                            </Button>
                        </div>

                        {bodyMeasurements.length > 0 ? (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={bodyMeasurements.slice().reverse()}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="var(--color-text-secondary)"
                                        fontSize={12}
                                        tickFormatter={(date) => new Date(date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                                    />
                                    <YAxis
                                        stroke="var(--color-text-secondary)"
                                        fontSize={12}
                                        domain={['dataMin - 1', 'dataMax + 1']}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: 'var(--color-bg-elevated)',
                                            border: '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)'
                                        }}
                                        labelFormatter={(date) => new Date(date).toLocaleDateString('pt-BR')}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="weight"
                                        stroke="var(--color-accent)"
                                        strokeWidth={3}
                                        dot={{ fill: 'var(--color-accent)', strokeWidth: 0, r: 4 }}
                                        activeDot={{ r: 6, fill: 'var(--color-accent)' }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{
                                height: 200,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'var(--color-text-secondary)',
                                gap: 'var(--spacing-sm)'
                            }}>
                                <p>Nenhum registro de peso</p>
                            </div>
                        )}
                    </Card>

                    <Modal
                        isOpen={showWeightModal}
                        onClose={() => setShowWeightModal(false)}
                        title="Registrar Peso"
                        footer={
                            <>
                                <Button variant="secondary" onClick={() => setShowWeightModal(false)} style={{ flex: 1 }}>
                                    Cancelar
                                </Button>
                                <Button onClick={handleSaveWeight} disabled={!newWeight} style={{ flex: 1 }}>
                                    Salvar
                                </Button>
                            </>
                        }
                    >
                        <Input
                            label="Peso atual (kg)"
                            type="number"
                            placeholder="Ex: 75.5"
                            value={newWeight}
                            onChange={(e) => setNewWeight(e.target.value)}
                            autoFocus
                        />
                    </Modal>
                </>
            )}

            {/* Muscle Heatmap Section */}
            <section style={{ marginTop: 'var(--spacing-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Mapa de Calor Muscular</h3>
                <Card>
                    <MuscleHeatmap intensities={muscleIntensities} />
                </Card>
            </section>
        </div>
    )
}
