import React, { useState } from 'react'
import { useAuthStore } from '@/stores'
import { signInWithEmail, signUpWithEmail, signOut } from '@/lib/supabase'
import { Button, Card, ListItem, UserIcon, SettingsIcon, ShareIcon, TrophyIcon, ChevronRightIcon, Input } from '@/components/ui'

export const Profile: React.FC = () => {
    const { user, isAuthenticated, logout } = useAuthStore()
    const [showInstallGuide, setShowInstallGuide] = useState(false)

    // Login Form State
    const [isLoginMode, setIsLoginMode] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [name, setName] = useState('')
    const [age, setAge] = useState('')

    const handleSignOut = async () => {
        await signOut()
        logout()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setIsLoading(true)

        try {
            if (isLoginMode) {
                const { error } = await signInWithEmail(email, password)
                if (error) throw error
            } else {
                if (!name || !age) {
                    throw new Error('Por favor, preencha todos os campos.')
                }
                const { error } = await signUpWithEmail(email, password, name, age)
                if (error) throw error
            }
        } catch (err: any) {
            setError(err.message || 'Ocorreu um erro. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    if (!isAuthenticated) {
        return (
            <div className="page">
                <header className="page-header">
                    <h1 className="page-title">Perfil</h1>
                </header>

                <Card style={{ padding: 'var(--spacing-xl)' }}>
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

                    <h3 style={{ marginBottom: 'var(--spacing-sm)', textAlign: 'center' }}>
                        {isLoginMode ? 'Bem-vindo de volta' : 'Crie sua conta'}
                    </h3>
                    <p className="text-secondary" style={{ marginBottom: 'var(--spacing-xl)', textAlign: 'center' }}>
                        {isLoginMode
                            ? 'Entre para sincronizar seus treinos'
                            : 'Registre-se para salvar seu progresso na nuvem'}
                    </p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        {!isLoginMode && (
                            <>
                                <Input
                                    label="Nome Completo"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Seu nome"
                                    required
                                />
                                <Input
                                    label="Idade"
                                    type="number"
                                    value={age}
                                    onChange={(e) => setAge(e.target.value)}
                                    placeholder="Sua idade"
                                    required
                                />
                            </>
                        )}

                        <Input
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="seu@email.com"
                            required
                        />

                        <Input
                            label="Senha"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="******"
                            required
                        />

                        {error && (
                            <div style={{
                                color: 'var(--color-error)',
                                fontSize: 'var(--font-size-sm)',
                                textAlign: 'center',
                                padding: 'var(--spacing-sm)',
                                background: 'rgba(255, 59, 48, 0.1)',
                                borderRadius: 'var(--radius-sm)'
                            }}>
                                {error}
                            </div>
                        )}

                        <Button type="submit" block disabled={isLoading}>
                            {isLoading ? 'Carregando...' : (isLoginMode ? 'Entrar' : 'Cadastrar')}
                        </Button>

                        <div style={{ textAlign: 'center', marginTop: 'var(--spacing-sm)' }}>
                            <button
                                type="button"
                                onClick={() => {
                                    setIsLoginMode(!isLoginMode)
                                    setError(null)
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--color-accent)',
                                    fontSize: 'var(--font-size-sm)',
                                    cursor: 'pointer'
                                }}
                            >
                                {isLoginMode ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Entre'}
                            </button>
                        </div>
                    </form>
                </Card>
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
                        overflow: 'hidden',
                        color: '#fff',
                        fontSize: '24px',
                        fontWeight: 'bold'
                    }}>
                        {user?.user_metadata?.avatar_url ? (
                            <img
                                src={user.user_metadata.avatar_url}
                                alt="Avatar"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            (user?.user_metadata?.name || user?.email || 'U')[0].toUpperCase()
                        )}
                    </div>
                    <div>
                        <h3>{user?.user_metadata?.name || 'Usuário'}</h3>
                        <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)' }}>
                            {user?.email}
                        </p>
                        {user?.user_metadata?.age && (
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px' }}>
                                Idade: {user.user_metadata.age} anos
                            </p>
                        )}
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
