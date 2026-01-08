import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore, useWorkoutStore } from '@/stores'
import { Button, Card, ListItem, Modal, Input, PlusIcon, DumbbellIcon, MoreVerticalIcon, TrashIcon, CheckIcon } from '@/components/ui'
import type { Program } from '@/types'

export const Workouts: React.FC = () => {
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const {
        programs,
        loadPrograms,
        createProgram,
        deleteProgram,
        updateProgram,
        setActiveProgramById
    } = useWorkoutStore()

    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingProgram, setEditingProgram] = useState<Program | null>(null)
    const [newProgramName, setNewProgramName] = useState('')
    const [newProgramDesc, setNewProgramDesc] = useState('')

    useEffect(() => {
        const userId = user?.id || 'local-guest-user'
        loadPrograms(userId)
    }, [user, loadPrograms])

    const handleCreateProgram = async () => {
        if (!newProgramName.trim()) return

        const userId = user?.id || 'local-guest-user'
        const program = await createProgram(userId, newProgramName.trim(), newProgramDesc.trim())
        setShowCreateModal(false)
        setNewProgramName('')
        setNewProgramDesc('')
        navigate(`/workouts/${program.id}`)
    }

    const handleEditProgram = async () => {
        if (!editingProgram || !newProgramName.trim()) return

        await updateProgram(editingProgram.id, {
            name: newProgramName.trim(),
            description: newProgramDesc.trim() || null
        })
        setShowEditModal(false)
        setEditingProgram(null)
        setNewProgramName('')
        setNewProgramDesc('')
    }

    const handleDeleteProgram = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir este programa?')) {
            await deleteProgram(id)
        }
    }

    const openEditModal = (program: Program, e: React.MouseEvent) => {
        e.stopPropagation()
        setEditingProgram(program)
        setNewProgramName(program.name)
        setNewProgramDesc(program.description || '')
        setShowEditModal(true)
    }

    return (
        <div className="page">
            <header className="page-header">
                <h1 className="page-title">Meus Treinos</h1>
                <p className="page-subtitle">Gerencie seus programas e fichas</p>
            </header>

            <Button
                block
                onClick={() => setShowCreateModal(true)}
                style={{ marginBottom: 'var(--spacing-lg)' }}
            >
                <PlusIcon size={20} />
                Novo Programa
            </Button>

            {programs.length === 0 ? (
                <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                    <DumbbellIcon size={48} className="text-secondary" />
                    <h3 style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>
                        Nenhum programa criado
                    </h3>
                    <p className="text-secondary" style={{ marginTop: 'var(--spacing-sm)' }}>
                        Crie seu primeiro programa para organizar seus treinos
                    </p>
                </Card>
            ) : (
                <ul className="list">
                    {programs.map((program) => (
                        <li key={program.id} style={{ position: 'relative' }}>
                            <ListItem
                                icon={<DumbbellIcon size={24} />}
                                title={program.name}
                                subtitle={program.description || 'Sem descrição'}
                                onClick={() => navigate(`/workouts/${program.id}`)}
                                action={
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                                        {program.is_active && (
                                            <span className="badge badge-success">Ativo</span>
                                        )}
                                        <button
                                            onClick={(e) => openEditModal(program, e)}
                                            style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', padding: '8px' }}
                                        >
                                            <MoreVerticalIcon size={20} />
                                        </button>
                                    </div>
                                }
                            />
                        </li>
                    ))}
                </ul>
            )}

            {/* Create Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Novo Programa"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateProgram} disabled={!newProgramName.trim()} style={{ flex: 1 }}>
                            Criar
                        </Button>
                    </>
                }
            >
                <Input
                    label="Nome do Programa"
                    placeholder="Ex: Push Pull Legs"
                    value={newProgramName}
                    onChange={(e) => setNewProgramName(e.target.value)}
                    autoFocus
                />
                <Input
                    label="Descrição (opcional)"
                    placeholder="Ex: Divisão de treino 6x por semana"
                    value={newProgramDesc}
                    onChange={(e) => setNewProgramDesc(e.target.value)}
                />
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                title="Editar Programa"
                footer={
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', width: '100%' }}>
                        <Button
                            variant="danger"
                            onClick={() => {
                                if (editingProgram) handleDeleteProgram(editingProgram.id)
                                setShowEditModal(false)
                            }}
                        >
                            <TrashIcon size={18} />
                        </Button>
                        {editingProgram && !editingProgram.is_active && (
                            <Button
                                variant="secondary"
                                onClick={() => {
                                    setActiveProgramById(editingProgram.id)
                                    setShowEditModal(false)
                                }}
                                style={{ flex: 1 }}
                            >
                                <CheckIcon size={18} />
                                Ativar
                            </Button>
                        )}
                        <Button onClick={handleEditProgram} disabled={!newProgramName.trim()} style={{ flex: 1 }}>
                            Salvar
                        </Button>
                    </div>
                }
            >
                <Input
                    label="Nome do Programa"
                    value={newProgramName}
                    onChange={(e) => setNewProgramName(e.target.value)}
                />
                <Input
                    label="Descrição"
                    value={newProgramDesc}
                    onChange={(e) => setNewProgramDesc(e.target.value)}
                />
            </Modal>
        </div>
    )
}
