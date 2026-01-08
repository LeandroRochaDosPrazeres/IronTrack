import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuthStore, useWorkoutStore, useExerciseStore, useTrainingStore } from '@/stores'
import { Button, Card, ListItem, Modal, Sheet, Input, ChevronLeftIcon, PlusIcon, PlayIcon, TrashIcon, SearchIcon, CheckIcon } from '@/components/ui'
import type { WorkoutTemplate, Exercise, TemplateExercise } from '@/types'

export const ProgramDetail: React.FC = () => {
    const { programId } = useParams<{ programId: string }>()
    const navigate = useNavigate()
    const { user } = useAuthStore()
    const {
        programs,
        templates,
        templateExercises,
        loadTemplates,
        createTemplate,
        loadTemplateExercises,
        addExerciseToTemplate,
        removeExerciseFromTemplate
    } = useWorkoutStore()
    const { exercises, loadExercises, filteredExercises, setSearchQuery, searchQuery, getSimilarExercises } = useExerciseStore()
    const { startWorkout } = useTrainingStore()

    const [selectedTemplate, setSelectedTemplate] = useState<WorkoutTemplate | null>(null)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [showExerciseSheet, setShowExerciseSheet] = useState(false)
    const [newTemplateName, setNewTemplateName] = useState('')

    // Editing State
    const [editingExercise, setEditingExercise] = useState<TemplateExercise | null>(null)
    const [showEditModal, setShowEditModal] = useState(false)
    const [showSubstituteSheet, setShowSubstituteSheet] = useState(false)
    const [similarExercises, setSimilarExercises] = useState<Exercise[]>([])

    const program = programs.find(p => p.id === programId)

    useEffect(() => {
        if (programId) {
            loadTemplates(programId)
        }
        if (exercises.length === 0) {
            loadExercises()
        }
    }, [programId, loadTemplates, loadExercises, exercises.length])

    useEffect(() => {
        if (selectedTemplate) {
            loadTemplateExercises(selectedTemplate.id)
        }
    }, [selectedTemplate, loadTemplateExercises])

    const handleCreateTemplate = async () => {
        if (!programId || !newTemplateName.trim()) return
        const template = await createTemplate(programId, newTemplateName.trim())
        setShowCreateModal(false)
        setNewTemplateName('')
        setSelectedTemplate(template)
    }

    const handleAddExercise = async (exercise: Exercise) => {
        if (!selectedTemplate) return
        await addExerciseToTemplate(selectedTemplate.id, exercise.id)
        setShowExerciseSheet(false)
        setSearchQuery('')
    }

    const handleStartWorkout = async () => {
        if (!selectedTemplate) return

        const userId = user?.id || 'local-guest-user'
        const exercisesToStart = templateExercises.filter(
            te => te.template_id === selectedTemplate.id
        )

        await startWorkout(userId, selectedTemplate.id, exercisesToStart)
        navigate('/training')
    }

    const handleEditExercise = (te: TemplateExercise) => {
        setEditingExercise(te)
        setShowEditModal(true)
    }

    const handleSaveExercise = async () => {
        if (!editingExercise) return
        await useWorkoutStore.getState().updateTemplateExercise(editingExercise.id, {
            target_sets: editingExercise.target_sets,
            target_reps: editingExercise.target_reps,
            rest_seconds: editingExercise.rest_seconds,
            notes: editingExercise.notes
        })
        setShowEditModal(false)
        setEditingExercise(null)
    }

    const handleOpenSubstitution = () => {
        if (!editingExercise) return
        const similar = getSimilarExercises(editingExercise.exercise_id)
        setSimilarExercises(similar)
        setShowSubstituteSheet(true)
    }

    const handleSubstituteExercise = async (newExercise: Exercise) => {
        if (!editingExercise) return
        await useWorkoutStore.getState().updateTemplateExercise(editingExercise.id, {
            exercise_id: newExercise.id
        })
        setShowSubstituteSheet(false)
        setShowEditModal(false)
        setEditingExercise(null)
    }

    const currentExercises = templateExercises.filter(
        te => te.template_id === selectedTemplate?.id
    )

    const getExerciseName = (exerciseId: string) => {
        return exercises.find(e => e.id === exerciseId)?.name || 'Exercício'
    }

    const getExerciseMuscles = (exerciseId: string) => {
        const exercise = exercises.find(e => e.id === exerciseId)
        return exercise?.muscle_groups.join(', ') || ''
    }

    if (!program) {
        return (
            <div className="page" style={{ textAlign: 'center', paddingTop: '100px' }}>
                <p className="text-secondary">Programa não encontrado</p>
                <Button variant="ghost" onClick={() => navigate('/workouts')}>
                    Voltar
                </Button>
            </div>
        )
    }

    return (
        <div className="page">
            <header style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
                <button
                    onClick={() => selectedTemplate ? setSelectedTemplate(null) : navigate('/workouts')}
                    style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)', padding: '8px', marginLeft: '-8px' }}
                >
                    <ChevronLeftIcon size={24} />
                </button>
                <div>
                    <h1 style={{ fontSize: 'var(--font-size-2xl)' }}>
                        {selectedTemplate ? selectedTemplate.name : program.name}
                    </h1>
                    {!selectedTemplate && program.description && (
                        <p className="text-secondary">{program.description}</p>
                    )}
                </div>
            </header>

            {!selectedTemplate ? (
                <>
                    <Button block onClick={() => setShowCreateModal(true)} style={{ marginBottom: 'var(--spacing-lg)' }}>
                        <PlusIcon size={20} />
                        Nova Ficha
                    </Button>

                    {templates.length === 0 ? (
                        <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                            <p className="text-secondary">Nenhuma ficha criada</p>
                            <p className="text-secondary" style={{ fontSize: 'var(--font-size-sm)', marginTop: 'var(--spacing-xs)' }}>
                                Crie fichas como A, B, C para organizar seus treinos
                            </p>
                        </Card>
                    ) : (
                        <ul className="list">
                            {templates.map((template, index) => (
                                <li key={template.id}>
                                    <ListItem
                                        icon={<span style={{ fontSize: 'var(--font-size-xl)', fontWeight: 'bold' }}>{String.fromCharCode(65 + index)}</span>}
                                        title={template.name}
                                        subtitle={`Ficha ${String.fromCharCode(65 + index)}`}
                                        onClick={() => setSelectedTemplate(template)}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            ) : (
                <>
                    <div style={{ display: 'flex', gap: 'var(--spacing-sm)', marginBottom: 'var(--spacing-lg)' }}>
                        <Button
                            variant="primary"
                            onClick={handleStartWorkout}
                            disabled={currentExercises.length === 0}
                            style={{ flex: 1 }}
                        >
                            <PlayIcon size={20} />
                            Iniciar Treino
                        </Button>
                        <Button variant="secondary" onClick={() => setShowExerciseSheet(true)}>
                            <PlusIcon size={20} />
                        </Button>
                    </div>

                    {currentExercises.length === 0 ? (
                        <Card style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
                            <p className="text-secondary">Nenhum exercício adicionado</p>
                            <Button variant="ghost" onClick={() => setShowExerciseSheet(true)} style={{ marginTop: 'var(--spacing-md)' }}>
                                Adicionar Exercício
                            </Button>
                        </Card>
                    ) : (
                        <ul className="list">
                            {currentExercises.map((te, index) => (
                                <li key={te.id}>
                                    <ListItem
                                        icon={<span style={{ color: 'var(--color-accent)', fontWeight: 'bold' }}>{index + 1}</span>}
                                        title={getExerciseName(te.exercise_id)}
                                        subtitle={`${te.target_sets} séries × ${te.target_reps} reps • ${getExerciseMuscles(te.exercise_id)}`}
                                        onClick={() => handleEditExercise(te)}
                                        action={
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    removeExerciseFromTemplate(te.id)
                                                }}
                                                style={{ background: 'none', border: 'none', color: 'var(--color-error)', padding: '8px' }}
                                            >
                                                <TrashIcon size={18} />
                                            </button>
                                        }
                                        showArrow={false}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </>
            )}

            {/* Create Template Modal */}
            <Modal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                title="Nova Ficha"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => setShowCreateModal(false)} style={{ flex: 1 }}>
                            Cancelar
                        </Button>
                        <Button onClick={handleCreateTemplate} disabled={!newTemplateName.trim()} style={{ flex: 1 }}>
                            Criar
                        </Button>
                    </>
                }
            >
                <Input
                    label="Nome da Ficha"
                    placeholder="Ex: Treino A - Peito e Tríceps"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    autoFocus
                />
            </Modal>

            {/* Edit Exercise Modal */}
            <Modal
                isOpen={showEditModal && !!editingExercise}
                onClose={() => { setShowEditModal(false); setEditingExercise(null); }}
                title="Editar Exercício"
                footer={
                    <>
                        <Button variant="secondary" onClick={() => { setShowEditModal(false); setEditingExercise(null); }} style={{ flex: 1 }}>
                            Cancelar
                        </Button>
                        <Button onClick={handleSaveExercise} style={{ flex: 1 }}>
                            Salvar
                        </Button>
                    </>
                }
            >
                {editingExercise && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-md)' }}>
                        <h3 className="text-secondary" style={{ fontSize: 'var(--font-size-md)' }}>
                            {getExerciseName(editingExercise.exercise_id)}
                        </h3>

                        <div className="grid-2">
                            <Input
                                type="number"
                                label="Séries Alvo"
                                value={editingExercise.target_sets}
                                onChange={(e) => setEditingExercise({ ...editingExercise, target_sets: parseInt(e.target.value) || 0 })}
                            />
                            <Input
                                label="Reps Alvo"
                                value={editingExercise.target_reps}
                                onChange={(e) => setEditingExercise({ ...editingExercise, target_reps: e.target.value })}
                            />
                        </div>

                        <div className="grid-2">
                            <Input
                                type="number"
                                label="Descanso (s)"
                                value={editingExercise.rest_seconds}
                                onChange={(e) => setEditingExercise({ ...editingExercise, rest_seconds: parseInt(e.target.value) || 0 })}
                            />
                        </div>

                        <Input
                            label="Notas"
                            placeholder="Ex: Drop-set na última"
                            value={editingExercise.notes || ''}
                            onChange={(e) => setEditingExercise({ ...editingExercise, notes: e.target.value })}
                        />

                        <Button
                            variant="secondary"
                            onClick={handleOpenSubstitution}
                            style={{ marginTop: 'var(--spacing-xs)' }}
                        >
                            <span style={{ marginRight: '8px' }}>🔄</span> Substituir Exercício
                        </Button>
                    </div>
                )}
            </Modal>

            {/* Substitute Exercise Sheet */}
            <Sheet isOpen={showSubstituteSheet} onClose={() => setShowSubstituteSheet(false)}>
                <div style={{ padding: 'var(--spacing-md)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Substituir por...</h3>

                    {similarExercises.length === 0 ? (
                        <p className="text-secondary" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                            Nenhum exercício similar encontrado.
                        </p>
                    ) : (
                        <ul className="list">
                            {similarExercises.map((exercise) => (
                                <li key={exercise.id}>
                                    <ListItem
                                        title={exercise.name}
                                        subtitle={exercise.muscle_groups.join(', ')}
                                        onClick={() => handleSubstituteExercise(exercise)}
                                        showArrow={false}
                                        action={<CheckIcon size={20} className="text-accent" />}
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </Sheet>

            {/* Add Exercise Sheet */}
            <Sheet isOpen={showExerciseSheet} onClose={() => { setShowExerciseSheet(false); setSearchQuery(''); }}>
                <div style={{ padding: 'var(--spacing-md)' }}>
                    <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Adicionar Exercício</h3>

                    <div style={{ position: 'relative', marginBottom: 'var(--spacing-md)' }}>
                        <SearchIcon size={20} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <input
                            className="input"
                            placeholder="Buscar exercício..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ paddingLeft: '40px' }}
                        />
                    </div>

                    <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                        <ul className="list">
                            {filteredExercises.slice(0, 20).map((exercise) => (
                                <li key={exercise.id}>
                                    <ListItem
                                        title={exercise.name}
                                        subtitle={exercise.muscle_groups.join(', ')}
                                        onClick={() => handleAddExercise(exercise)}
                                        showArrow={false}
                                        action={<PlusIcon size={20} className="text-accent" />}
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </Sheet>
        </div>
    )
}
