import React from 'react'

interface MuscleHeatmapProps {
    intensities: Record<string, number>
}

export const MuscleHeatmap: React.FC<MuscleHeatmapProps> = ({ intensities }) => {

    // Helper to get color based on intensity (0-4)
    // 0 = Recovered (Gray)
    // 4 = Max Fatigue (Bright Orange/Red)
    const getColor = (muscle: string) => {
        // Normalize muscle name if needed (e.g. from DB)
        // For now assume key matches MuscleGroup type or simple string mapping
        const intensity = intensities[muscle] || 0

        switch (true) {
            case intensity >= 4: return 'var(--color-accent)' // #FF5000 approx
            case intensity >= 3: return 'rgba(255, 80, 0, 0.8)'
            case intensity >= 2: return 'rgba(255, 80, 0, 0.5)'
            case intensity >= 1: return 'rgba(255, 80, 0, 0.2)'
            default: return 'var(--color-bg-tertiary)'
        }
    }

    return (
        <div className="heatmap-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <svg width="200" height="320" viewBox="0 0 200 320">
                {/* Traps */}
                <path
                    d="M75,55 L90,55 L100,60 L110,55 L125,55 L130,70 L70,70 Z"
                    fill={getColor('traps')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />

                {/* Shoulders (Delts) */}
                <path
                    d="M50,70 Q45,85 50,100 L70,100 L70,70 Z"
                    fill={getColor('shoulders')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />
                <path
                    d="M150,70 Q155,85 150,100 L130,100 L130,70 Z"
                    fill={getColor('shoulders')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />

                {/* Chest (Pectorals) */}
                <path
                    d="M70,70 L130,70 L130,110 Q100,120 70,110 Z"
                    fill={getColor('chest')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />

                {/* Biceps */}
                <path
                    d="M50,100 L70,100 L65,130 L55,130 Z"
                    fill={getColor('biceps')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />
                <path
                    d="M150,100 L130,100 L135,130 L145,130 Z"
                    fill={getColor('biceps')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />

                {/* Forearms */}
                <path
                    d="M55,130 L65,130 L62,160 L58,160 Z"
                    fill={getColor('forearms')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />
                <path
                    d="M145,130 L135,130 L138,160 L142,160 Z"
                    fill={getColor('forearms')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />

                {/* Abs */}
                <rect
                    x="80" y="110" width="40" height="50" rx="5"
                    fill={getColor('abs')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />

                {/* Obliques */}
                <path
                    d="M70,110 L80,110 L80,160 L70,150 Z"
                    fill={getColor('obliques')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />
                <path
                    d="M130,110 L120,110 L120,160 L130,150 Z"
                    fill={getColor('obliques')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />

                {/* Quads */}
                <path
                    d="M70,160 L100,160 L95,230 L75,230 Z"
                    fill={getColor('quads')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />
                <path
                    d="M130,160 L100,160 L105,230 L125,230 Z"
                    fill={getColor('quads')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />

                {/* Calves */}
                <path
                    d="M75,235 L95,235 L90,280 L80,280 Z"
                    fill={getColor('calves')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />
                <path
                    d="M125,235 L105,235 L110,280 L120,280 Z"
                    fill={getColor('calves')}
                    stroke="var(--color-bg-primary)"
                    strokeWidth="1"
                />
            </svg>

            <div className="heatmap-legend" style={{ display: 'flex', gap: 'var(--spacing-md)', marginTop: 'var(--spacing-md)' }}>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="legend-color" style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-bg-tertiary)' }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Recuperado</span>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="legend-color" style={{ width: 12, height: 12, borderRadius: 2, background: 'rgba(255, 80, 0, 0.5)' }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Moderado</span>
                </div>
                <div className="legend-item" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className="legend-color" style={{ width: 12, height: 12, borderRadius: 2, background: 'var(--color-accent)' }} />
                    <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-secondary)' }}>Fadigado</span>
                </div>
            </div>
        </div>
    )
}
