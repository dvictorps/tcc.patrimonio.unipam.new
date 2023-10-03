import { ModalStyled } from "@/components/Modal";
import { useApi } from "@/context/ApiContext";
import { HamburgerIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import { useDisclosure, Menu, MenuButton, IconButton, MenuList, MenuItem, ModalBody, ModalFooter, Button, Box, Text, FormControl, Input, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import { AllRequestTypes, Equipamento } from "@/utils/types";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { EquipmentInputModal } from "@/components/EquipmentInputModal";

export function ActionMenu(
    id: number,
    dataQuery: UseQueryResult<{ data: Equipamento[]; totalRecords: number; }, unknown>
) {

    const deleteUniqueModal = useDisclosure();
    const editUniqueModal = useDisclosure();
    const { delete: deleteRequest, setRowSelection, getOne, patch } = useApi()
    const [componentData, setComponentData] = useState<Equipamento>()



    const route = 'equipment';

    async function handleDelete() {
        try {
            const response = await deleteRequest<Equipamento>(`/${route}/delete/${id}`);
            console.log('Resposta DELETE:', response.data);
            await dataQuery.refetch()
            setRowSelection({})

        } catch (error) {
            console.log('Erro no DELETE:', error);
        }
        deleteUniqueModal.onClose()
    }

    async function handleGet() {
        try {
            const response = await getOne<Equipamento>(route, id.toString())
            setComponentData(response)

        } catch (error) {
            console.log('erro get ', error)
        }
    }

    function handleEditButton() {
        handleGet();
        editUniqueModal.onOpen();

    }

    function handleDeleteButton() {
        handleGet();
        deleteUniqueModal.onOpen()

    }

    async function editButtonRefetch() {
        await dataQuery.refetch();
    }

    async function handlePatch(data: Equipamento) {
        try {
            const response = await patch<Equipamento>(`${route}/update/${id}`, data);
            console.log('Resposta da requisição:', response.data);
        } catch (error) {
            console.log('Erro na requisição:', error);
        }
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm()

    const onSubmit = async (data: Equipamento) => {
        await handlePatch(data);
        console.log('aqui', data);
        editButtonRefetch();

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
                    <MenuItem icon={<EditIcon />} onClick={handleEditButton}>
                        Editar
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={handleDeleteButton}>
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
                        Você está prestes o reistro de patrimônio {componentData?.Patrimonio}. Deseja prosseguir com a operação?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme="red" rightIcon={<DeleteIcon />} onClick={handleDelete} >Confirmar remoção</Button>
                        <Button onClick={deleteUniqueModal.onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </ModalStyled>

            <ModalStyled title="Editar"
                onClose={editUniqueModal.onClose}
                open={editUniqueModal.isOpen}
                isCentered={true}
            >
                <EquipmentInputModal
                    errors={errors}
                    handleSubmit={handleSubmit}
                    onClose={editUniqueModal.onClose}
                    onSubmit={onSubmit}
                    register={register}
                    componentData={componentData}
                />
            </ModalStyled>
        </>

    )
}