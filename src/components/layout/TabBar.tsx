import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { HomeIcon, DumbbellIcon, ChartIcon, UserIcon } from '../ui/Icons'

const tabs = [
    { path: '/', icon: HomeIcon, label: 'Início' },
    { path: '/workouts', icon: DumbbellIcon, label: 'Treinos' },
    { path: '/analytics', icon: ChartIcon, label: 'Análise' },
    { path: '/profile', icon: UserIcon, label: 'Perfil' }
]

export const TabBar: React.FC = () => {
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <nav className="tab-bar">
            {tabs.map(({ path, icon: Icon, label }) => (
                <button
                    key={path}
                    className={`tab-item ${location.pathname === path ? 'active' : ''}`}
                    onClick={() => navigate(path)}
                >
                    <Icon size={24} />
                    <span>{label}</span>
                </button>
            ))}
        </nav>
    )
}
