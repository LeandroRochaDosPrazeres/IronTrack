import React, { useState, useMemo } from 'react'
import { Modal, Button } from '../ui'

interface PlateCalculatorProps {
    isOpen: boolean
    onClose: () => void
    targetWeight: number
}

const AVAILABLE_PLATES = [25, 20, 15, 10, 5, 2.5, 1.25]
const BAR_WEIGHTS = {
    olympic: 20,
    standard: 15,
    ez: 10
}

export const PlateCalculator: React.FC<PlateCalculatorProps> = ({
    isOpen,
    onClose,
    targetWeight
}) => {
    const [barType, setBarType] = useState<'olympic' | 'standard' | 'ez'>('olympic')

    const calculation = useMemo(() => {
        const barWeight = BAR_WEIGHTS[barType]
        const weightPerSide = (targetWeight - barWeight) / 2

        if (weightPerSide < 0) {
            return { plates: [], perSide: 0, possible: false, barWeight }
        }

        const plates: number[] = []
        let remaining = weightPerSide

        for (const plate of AVAILABLE_PLATES) {
            while (remaining >= plate) {
                plates.push(plate)
                remaining -= plate
            }
        }

        return {
            plates,
            perSide: weightPerSide,
            possible: remaining < 0.01,
            barWeight
        }
    }, [targetWeight, barType])

    const plateColors: Record<number, string> = {
        25: '#ff3b30',
        20: '#007aff',
        15: '#ffcc00',
        10: '#34c759',
        5: 'var(--color-text-primary)',
        2.5: '#ff6b35',
        1.25: '#8e8e93'
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Calculadora de Anilhas">
            <div style={{ padding: 'var(--spacing-md)' }}>
                <div style={{
                    textAlign: 'center',
                    marginBottom: 'var(--spacing-lg)'
                }}>
                    <span style={{
                        fontSize: 'var(--font-size-4xl)',
                        fontWeight: 'var(--font-weight-heavy)',
                        background: 'var(--color-accent-gradient)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        {targetWeight} kg
                    </span>
                    <p style={{
                        color: 'var(--color-text-secondary)',
                        marginTop: 'var(--spacing-xs)'
                    }}>
                        Peso Total Desejado
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    gap: 'var(--spacing-sm)',
                    marginBottom: 'var(--spacing-lg)',
                    justifyContent: 'center'
                }}>
                    {Object.entries(BAR_WEIGHTS).map(([type, weight]) => (
                        <button
                            key={type}
                            onClick={() => setBarType(type as 'olympic' | 'standard' | 'ez')}
                            style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                background: barType === type ? 'var(--color-accent)' : 'var(--color-bg-tertiary)',
                                border: 'none',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text-primary)',
                                fontSize: 'var(--font-size-sm)',
                                cursor: 'pointer'
                            }}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)} ({weight}kg)
                        </button>
                    ))}
                </div>

                {calculation.possible ? (
                    <>
                        <div style={{
                            background: 'var(--color-bg-tertiary)',
                            borderRadius: 'var(--radius-lg)',
                            padding: 'var(--spacing-lg)',
                            marginBottom: 'var(--spacing-md)'
                        }}>
                            <p style={{
                                color: 'var(--color-text-secondary)',
                                marginBottom: 'var(--spacing-md)',
                                textAlign: 'center'
                            }}>
                                Cada lado da barra ({calculation.perSide}kg):
                            </p>
                            <div style={{
                                display: 'flex',
                                flexWrap: 'wrap',
                                gap: 'var(--spacing-sm)',
                                justifyContent: 'center'
                            }}>
                                {calculation.plates.map((plate, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: 'var(--radius-full)',
                                            background: plateColors[plate],
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontWeight: 'var(--font-weight-bold)',
                                            fontSize: 'var(--font-size-sm)',
                                            color: plate === 5 ? 'var(--color-bg-primary)' : 'var(--color-text-primary)'
                                        }}
                                    >
                                        {plate}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            textAlign: 'center',
                            fontSize: 'var(--font-size-sm)'
                        }}>
                            Barra: {calculation.barWeight}kg + 2×{calculation.perSide}kg = {targetWeight}kg
                        </p>
                    </>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        color: 'var(--color-error)',
                        padding: 'var(--spacing-lg)'
                    }}>
                        Não é possível atingir esse peso com as anilhas disponíveis.
                    </div>
                )}
            </div>
        </Modal>
    )
}
