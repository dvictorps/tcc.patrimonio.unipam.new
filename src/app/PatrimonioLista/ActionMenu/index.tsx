import { ModalStyled } from "@/components/Modal";
import { HamburgerIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDisclosure, Menu, MenuButton, IconButton, MenuList, MenuItem, ModalBody, ModalFooter, Button, Box, Text } from "@chakra-ui/react";

export function ActionMenu(id: number) {
    const deleteUniqueModal = useDisclosure();
    return (
        <>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<HamburgerIcon />}
                    variant='outline'
                />
                <MenuList>
                    <MenuItem icon={<EditIcon />}>
                        Editar
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={deleteUniqueModal.onOpen}>
                        Remover
                    </MenuItem>
                </MenuList>
            </Menu>
            <ModalStyled title="Remover"
                onClose={deleteUniqueModal.onClose}
                open={deleteUniqueModal.isOpen}
                isCentered={true}
            >
                <ModalBody>
                    <Text>
                        Você está prestes a remover este registro. Deseja prosseguir com a operação?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme="red" rightIcon={<DeleteIcon />}>Confirmar remoção</Button>
                        <Button onClick={deleteUniqueModal.onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </ModalStyled>
        </>

    )
}