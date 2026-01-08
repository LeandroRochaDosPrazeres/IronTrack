import React from 'react'
import { XIcon } from './Icons'

interface ModalProps {
    isOpen: boolean
    onClose: () => void
    title?: string
    children: React.ReactNode
    footer?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({
    isOpen,
    onClose,
    title,
    children,
    footer
}) => {
    if (!isOpen) return null

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="modal">
                {title && (
                    <div className="modal-header">
                        <h3 className="modal-title">{title}</h3>
                        <button className="btn btn-icon btn-ghost" onClick={onClose}>
                            <XIcon size={20} />
                        </button>
                    </div>
                )}
                <div className="modal-body">{children}</div>
                {footer && <div className="modal-footer">{footer}</div>}
            </div>
        </>
    )
}

interface SheetProps {
    isOpen: boolean
    onClose: () => void
    children: React.ReactNode
}

export const Sheet: React.FC<SheetProps> = ({
    isOpen,
    onClose,
    children
}) => {
    if (!isOpen) return null

    return (
        <>
            <div className="modal-backdrop" onClick={onClose} />
            <div className="sheet">
                <div className="sheet-handle" onClick={onClose} />
                {children}
            </div>
        </>
    )
}
