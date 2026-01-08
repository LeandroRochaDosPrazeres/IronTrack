import React from 'react'
import { ChevronRightIcon } from './Icons'

interface CardProps {
    children: React.ReactNode
    className?: string
    onClick?: () => void
    glass?: boolean
    style?: React.CSSProperties
}

export const Card: React.FC<CardProps> = ({
    children,
    className = '',
    onClick,
    glass = false,
    style
}) => {
    return (
        <div
            className={`card ${glass ? 'card-glass' : ''} ${className}`}
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default', ...style }}
        >
            {children}
        </div>
    )
}

interface ListItemProps {
    icon?: React.ReactNode
    title: string
    subtitle?: string
    onClick?: () => void
    showArrow?: boolean
    action?: React.ReactNode
}

export const ListItem: React.FC<ListItemProps> = ({
    icon,
    title,
    subtitle,
    onClick,
    showArrow = true,
    action
}) => {
    return (
        <div
            className="list-item"
            onClick={onClick}
            style={{ cursor: onClick ? 'pointer' : 'default' }}
        >
            {icon && <div className="list-item-icon">{icon}</div>}
            <div className="list-item-content">
                <div className="list-item-title">{title}</div>
                {subtitle && <div className="list-item-subtitle">{subtitle}</div>}
            </div>
            {action || (showArrow && onClick && (
                <div className="list-item-action">
                    <ChevronRightIcon size={20} />
                </div>
            ))}
        </div>
    )
}

interface StatCardProps {
    value: string | number
    label: string
    icon?: React.ReactNode
}

export const StatCard: React.FC<StatCardProps> = ({ value, label, icon }) => {
    return (
        <div className="stat-card">
            {icon}
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
        </div>
    )
}
