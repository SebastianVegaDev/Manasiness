import "./FormModal.css"

import ModalOverlay from "@shared/ui/modal/ModalOverlay"

import type { ReactNode } from "react"

type FormModalProps = {
    title: string
    subtitle?: string
    children: ReactNode
    onClose: () => void
}

function FormModal({ children, onClose }: FormModalProps) {
    return (
        <ModalOverlay onClose={onClose}>
            {children}
        </ModalOverlay>
    )
}

export default FormModal
