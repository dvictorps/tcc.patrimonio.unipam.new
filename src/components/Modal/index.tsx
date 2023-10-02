import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalCloseButton,
} from '@chakra-ui/react'

type ModalProp = {
    children: React.ReactNode
    open: boolean
    onClose(): void
    title: string
    isCentered?: boolean
}

export function ModalStyled({ children, onClose, open, title, isCentered }: ModalProp) {
    return (
        <Modal
            isOpen={open}
            onClose={onClose}
            isCentered={isCentered}
        >
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                {children}
            </ModalContent>
        </Modal>
    )
}