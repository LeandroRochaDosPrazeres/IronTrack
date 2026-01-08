import React, { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '@/stores'
import { db, generateId } from '@/lib/db'
import { Button, Card, StatCard, FireIcon, TrophyIcon, Modal, Input, PlusIcon } from '@/components/ui'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import type { WorkoutSession, BodyMeasurement } from '@/types'

export const Analytics: React.FC = () => {
    const { user } = useAuthStore()
    const [sessions, setSessions] = useState<WorkoutSession[]>([])
    const [bodyMeasurements, setBodyMeasurements] = useState<BodyMeasurement[]>([])
    const [newWeight, setNewWeight] = useState('')
    const [activeTab, setActiveTab] = useState<'volume' | 'frequency' | 'body'>('volume')

    useEffect(() => {
        const loadData = async () => {
            const userId = user?.id || 'local-guest-user'

            const sessionsData = await db.workoutSessions
                .where('user_id')
                .equals(userId)
                .reverse()
                .limit(30)
                .toArray()
            setSessions(sessionsData)

            // const logsData = await db.setLogs.limit(500).toArray()
            // setSetLogs(logsData)

            const bodyData = await db.bodyMeasurements
                .where('user_id')
                .equals(userId)
                .reverse()
                .limit(30)
                .toArray()
            setBodyMeasurements(bodyData)
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
        // Mock data - in real app, calculate from set_logs
        return [
            { muscle: 'Peito', count: 3 },
            { muscle: 'Costas', count: 3 },
            { muscle: 'Pernas', count: 2 },
            { muscle: 'Ombros', count: 2 },
            { muscle: 'Braços', count: 4 },
        ]
    }, [])

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

            {/* Muscle Heatmap Preview */}
            <section style={{ marginTop: 'var(--spacing-lg)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Mapa de Calor Muscular</h3>
                <Card>
                    <div className="heatmap-container">
                        <svg width="180" height="300" viewBox="0 0 180 300">
                            {/* Simplified body silhouette */}
                            {/* Head */}
                            <circle cx="90" cy="25" r="20" className="muscle-group intensity-0" />

                            {/* Neck/Traps */}
                            <path d="M80,45 L100,45 L105,60 L75,60 Z" className="muscle-group intensity-2" />

                            {/* Shoulders */}
                            <ellipse cx="55" cy="70" rx="18" ry="12" className="muscle-group intensity-3" />
                            <ellipse cx="125" cy="70" rx="18" ry="12" className="muscle-group intensity-3" />

                            {/* Chest */}
                            <path d="M60,65 L120,65 L125,100 L55,100 Z" className="muscle-group intensity-4" />

                            {/* Abs */}
                            <rect x="65" y="100" width="50" height="50" rx="5" className="muscle-group intensity-2" />

                            {/* Arms */}
                            <rect x="35" y="75" width="15" height="55" rx="7" className="muscle-group intensity-3" />
                            <rect x="130" y="75" width="15" height="55" rx="7" className="muscle-group intensity-3" />

                            {/* Forearms */}
                            <rect x="32" y="130" width="12" height="40" rx="5" className="muscle-group intensity-1" />
                            <rect x="136" y="130" width="12" height="40" rx="5" className="muscle-group intensity-1" />

                            {/* Quads */}
                            <rect x="60" y="155" width="25" height="60" rx="8" className="muscle-group intensity-2" />
                            <rect x="95" y="155" width="25" height="60" rx="8" className="muscle-group intensity-2" />

                            {/* Calves */}
                            <rect x="62" y="220" width="20" height="50" rx="8" className="muscle-group intensity-1" />
                            <rect x="98" y="220" width="20" height="50" rx="8" className="muscle-group intensity-1" />
                        </svg>

                        <div className="heatmap-legend">
                            <div className="legend-item">
                                <div className="legend-color" style={{ background: 'var(--color-bg-tertiary)' }} />
                                <span>Recuperado</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ background: 'rgba(255, 107, 53, 0.5)' }} />
                                <span>Moderado</span>
                            </div>
                            <div className="legend-item">
                                <div className="legend-color" style={{ background: 'var(--color-accent)' }} />
                                <span>Fadigado</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>
        </div>
    )
}
