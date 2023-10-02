import { ModalStyled } from "@/components/Modal";
import { useApi } from "@/context/ApiContext";
import { HamburgerIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDisclosure, Menu, MenuButton, IconButton, MenuList, MenuItem, ModalBody, ModalFooter, Button, Box, Text } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";

export function ActionMenu<QueryResult>(id: number, dataQuery: UseQueryResult<{
    data: QueryResult[];
    totalRecords: number;
}, unknown>) {

    const deleteUniqueModal = useDisclosure();
    const { delete: deleteRequest, setRowSelection } = useApi()

    const handleDelete = async () => {
        try {
            const response = await deleteRequest(`/equipment/delete/${id}`);
            console.log('Resposta DELETE:', response.data);
            await dataQuery.refetch()
            setRowSelection({})

        } catch (error) {
            console.log('Erro no DELETE:', error);
        }
        deleteUniqueModal.onClose()

    }

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
                        <Button colorScheme="red" rightIcon={<DeleteIcon />} onClick={handleDelete} >Confirmar remoção</Button>
                        <Button onClick={deleteUniqueModal.onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </ModalStyled>
        </>

    )
}