import React, { useState } from 'react'
import { useAuthStore } from '@/stores'
import { signInWithGoogle, signInWithApple, signOut } from '@/lib/supabase'
import { Button, Card, ListItem, UserIcon, SettingsIcon, ShareIcon, TrophyIcon, ChevronRightIcon } from '@/components/ui'

export const Profile: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuthStore()
    const [showInstallGuide, setShowInstallGuide] = useState(false)

    const handleSignOut = async () => {
        await signOut()
        logout()
    }

    const handleGoogleLogin = async () => {
        await signInWithGoogle()
    }

    const handleAppleLogin = async () => {
        await signInWithApple()
    }

    if (!isAuthenticated) {
        return (
            <div className="page">
                <header className="page-header">
                    <h1 className="page-title">Perfil</h1>
                </header>

                <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-bg-tertiary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto var(--spacing-lg)'
                    }}>
                        <UserIcon size={40} className="text-secondary" />
                    </div>

                    <h3 style={{ marginBottom: 'var(--spacing-sm)' }}>Entre para sincronizar</h3>
                    <p className="text-secondary" style={{ marginBottom: 'var(--spacing-xl)' }}>
                        Faça login para salvar seus treinos na nuvem e acessar de qualquer dispositivo
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm)' }}>
                        <Button onClick={handleGoogleLogin} variant="secondary" block>
                            <svg width="20" height="20" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continuar com Google
                        </Button>

                        <Button onClick={handleAppleLogin} variant="secondary" block>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                            </svg>
                            Continuar com Apple
                        </Button>
                    </div>
                </Card>

                <p className="text-secondary text-center" style={{ marginTop: 'var(--spacing-lg)', fontSize: 'var(--font-size-sm)' }}>
                    Você pode usar o app sem login, mas seus dados ficarão apenas neste dispositivo.
                </p>
            </div>
        )
    }

    return (
        <div className="page">
            <header className="page-header">
                <h1 className="page-title">Perfil</h1>
            </header>

            {/* User Info */}
            <Card style={{ marginBottom: 'var(--spacing-lg)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--color-accent-gradient)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                    }}>
                        {user?.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <UserIcon size={32} />
                        )}
                    </div>
                    <div>
                        <h3>{user?.user_metadata?.name || 'Usuário'}</h3>
                        <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                            {user?.email}
                        </p>
                    </div>
                </div>
            </Card>

            {/* Menu Items */}
            <section className="mb-lg">
                <ul className="list">
                    <li>
                        <ListItem
                            icon={<TrophyIcon size={24} />}
                            title="Conquistas"
                            subtitle="Veja suas medalhas e recordes"
                        />
                    </li>
                    <li>
                        <ListItem
                            icon={<ShareIcon size={24} />}
                            title="Compartilhar Treino"
                            subtitle="Crie cards para stories"
                        />
                    </li>
                    <li>
                        <ListItem
                            icon={<SettingsIcon size={24} />}
                            title="Configurações"
                            subtitle="Notificações, tema, unidades"
                        />
                    </li>
                </ul>
            </section>

            {/* PWA Install Guide */}
            <section className="mb-lg">
                <Card
                    onClick={() => setShowInstallGuide(!showInstallGuide)}
                    style={{ cursor: 'pointer' }}
                >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)' }}>
                        <div style={{
                            width: '44px',
                            height: '44px',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--color-accent-gradient)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            📲
                        </div>
                        <div style={{ flex: 1 }}>
                            <h4>Instalar na Tela Inicial</h4>
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                                Use como um app nativo
                            </p>
                        </div>
                        <ChevronRightIcon size={20} className="text-secondary" />
                    </div>

                    {showInstallGuide && (
                        <div style={{
                            marginTop: 'var(--spacing-md)',
                            paddingTop: 'var(--spacing-md)',
                            borderTop: '1px solid var(--color-border)'
                        }}>
                            <ol style={{
                                listStyle: 'decimal',
                                paddingLeft: 'var(--spacing-lg)',
                                color: 'var(--color-text-secondary)',
                                fontSize: 'var(--font-size-sm)',
                                lineHeight: 1.8
                            }}>
                                <li>Toque no botão <strong>Compartilhar</strong> (ícone de quadrado com seta)</li>
                                <li>Role para baixo e toque em <strong>"Adicionar à Tela de Início"</strong></li>
                                <li>Toque em <strong>"Adicionar"</strong> no canto superior direito</li>
                                <li>O IronTrack aparecerá na sua tela inicial como um app!</li>
                            </ol>
                        </div>
                    )}
                </Card>
            </section>

            {/* Sign Out */}
            <Button variant="ghost" block onClick={handleSignOut} style={{ color: 'var(--color-error)' }}>
                Sair da Conta
            </Button>

            <p className="text-secondary text-center" style={{ marginTop: 'var(--spacing-xl)', fontSize: 'var(--font-size-xs)' }}>
                IronTrack Ultra Professional v1.0.0
            </p>
        </div>
    )
}
