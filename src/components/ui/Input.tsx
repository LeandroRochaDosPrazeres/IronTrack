import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    variant?: 'default' | 'numeric'
}

export const Input: React.FC<InputProps> = ({
    label,
    error,
    variant = 'default',
    className = '',
    id,
    ...props
}) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`

    return (
        <div className="input-group">
            {label && (
                <label htmlFor={inputId} className="input-label">
                    {label}
                </label>
            )}
            <input
                id={inputId}
                className={`input ${variant === 'numeric' ? 'input-numeric' : ''} ${className}`}
                {...props}
            />
            {error && <span className="text-error" style={{ fontSize: '13px', marginTop: '4px' }}>{error}</span>}
        </div>
    )
}

interface NumericInputProps {
    value: number | null
    onChange: (value: number | null) => void
    label?: string
    unit?: string
    min?: number
    max?: number
    step?: number
}

export const NumericInput: React.FC<NumericInputProps> = ({
    value,
    onChange,
    label,
    unit,
    min = 0,
    max = 9999,
    step = 1
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        if (val === '') {
            onChange(null)
        } else {
            const num = parseFloat(val)
            if (!isNaN(num) && num >= min && num <= max) {
                onChange(num)
            }
        }
    }

    return (
        <div className="input-group">
            {label && <label className="input-label">{label}</label>}
            <div style={{ position: 'relative' }}>
                <input
                    type="number"
                    inputMode="decimal"
                    className="input input-numeric"
                    value={value ?? ''}
                    onChange={handleChange}
                    min={min}
                    max={max}
                    step={step}
                />
                {unit && (
                    <span style={{
                        position: 'absolute',
                        right: '16px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: 'var(--color-text-secondary)',
                        fontSize: 'var(--font-size-md)'
                    }}>
                        {unit}
                    </span>
                )}
            </div>
        </div>
    )
}
