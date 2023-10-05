import { ModalStyled } from "@/components/Modal";
import { useApi } from "@/context/ApiContext";
import { HamburgerIcon, EditIcon, DeleteIcon, CheckIcon, ExternalLinkIcon } from "@chakra-ui/icons";
import { useDisclosure, Menu, MenuButton, IconButton, MenuList, MenuItem, ModalBody, ModalFooter, Button, Box, Text, FormControl, Input, FormLabel, FormErrorMessage } from "@chakra-ui/react";
import { UseQueryResult } from "react-query";
import { AllRequestTypes, Equipamento } from "@/utils/types";
import { useEffect, useState } from "react";
import { useForm } from 'react-hook-form'
import { EquipmentInputModal } from "@/app/PatrimonioLista/ActionMenu/EquipmentInputModal";

export function ActionMenu(
    id: number,
    dataQuery: UseQueryResult<{ data: Equipamento[]; totalRecords: number; }, unknown>,

) {

    const deleteUniqueModal = useDisclosure();
    const enableUniqueModal = useDisclosure();
    const editUniqueModal = useDisclosure();
    const viewModal = useDisclosure();
    const { setRowSelection, getOne, patch, companyData, categoryData, manufacturerData, departmentData, situationData, roomData } = useApi()

    const [componentData, setComponentData] = useState<Equipamento>()

    const route = 'equipment';

    async function handleDelete() {
        try {
            const response = await patch<Equipamento>(`/${route}/disable/${id}`, '2');
            console.log('Resposta Patch:', response.data);
            await dataQuery.refetch()
            setRowSelection({})

        } catch (error) {
            console.log('Erro no Patch:', error);
        }
        deleteUniqueModal.onClose()
    }

    async function handleEnable() {
        try {
            const response = await patch<Equipamento>(`/${route}/enable/${id}`, '1');
            console.log('Resposta Patch:', response.data);
            await dataQuery.refetch()
            setRowSelection({})

        } catch (error) {
            console.log('Erro no Patch:', error);
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
        editUniqueModal.onOpen();

    }

    function handleDeleteButton() {
        deleteUniqueModal.onOpen()

    }

    function handleEnableButton() {
        enableUniqueModal.onOpen()

    }

    function handleViewButton() {
        viewModal.onOpen()

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

    function getCategory(id: number) {
        const category = categoryData.find((category) => category.IdCategoriaEquipamento === id);
        return category?.DescricaoCategoriaEquipamento
    }

    function getCompany(id: number) {
        const company = companyData.find((company) => company.IdEmpresa === id);
        return company?.NomeEmpresa
    }

    function getManufacturer(id: number) {
        const manufacturer = manufacturerData.find((manufacturer) => manufacturer.IdFabricante === id);
        return manufacturer?.NomeFabricante
    }

    function getDepartment(id: number) {
        const department = departmentData.find((department) => department.IdDepartamento === id);
        return department?.NomeDepartamento
    }

    function getSituation(id: number) {
        const situation = situationData.find((situation) => situation.IdSituacaoEquipamento === id);
        return situation?.DescricaoSituacaoEquipamento
    }

    function getRoom(id: number) {
        const room = roomData.find((room) => room.IdSala === id);
        return room?.DescricaoSala
    }

    const inputArray = [
        {
            label: 'Nº Patrimônio',
            defaultValue: componentData?.Patrimonio,
        },
        {
            label: 'Serial',
            defaultValue: componentData?.NumeroSerial,
        },
        {
            label: 'Departamento',
            defaultValue: getDepartment(componentData?.IdDepartamento || 0),
        },
        {
            label: 'Sala',
            defaultValue: getRoom(componentData?.IdSala || 0),
        },
        {
            label: 'Situação Equipamento',
            defaultValue: getSituation(componentData?.IdSituacaoEquipamento || 0),
        },
        {
            label: 'Descrição Equipamento',
            defaultValue: componentData?.DescricaoEquipamento,
        },
        {
            label: 'Categoria',
            defaultValue: getCategory(componentData?.IdCategoriaEquipamento || 0),
        },
        {
            label: 'Data de Aquisição',
            defaultValue: new Date(componentData?.DataAquisicao || '').toLocaleDateString(),
        },
        {
            label: 'Data de Cadastro',
            defaultValue: new Date(componentData?.DataCadastro || '').toLocaleDateString(),

        },
        {
            label: 'Data de Vencimento',
            defaultValue: new Date(componentData?.VencimentoGarantia || '').toLocaleDateString(),

        },
        {
            label: 'Data de Modificação',
            defaultValue: new Date(componentData?.DataModificacao || '').toLocaleDateString(),
        },
        {
            label: 'Empresa Associada',
            defaultValue: getCompany(componentData?.IdEmpresa || 0),
        },
        {
            label: 'Fabricante',
            defaultValue: getManufacturer(componentData?.IdFabricante || 0),
        },
    ]


    return (
        <>
            <Menu onOpen={handleGet}>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<HamburgerIcon />}
                    variant='outline'
                />
                <MenuList>
                    <MenuItem icon={<ExternalLinkIcon />} onClick={handleViewButton}>
                        Visualizar
                    </MenuItem>
                    <MenuItem icon={<DeleteIcon />} onClick={handleDeleteButton}>
                        Desativar
                    </MenuItem>
                    <MenuItem icon={<CheckIcon />} onClick={handleEnableButton}>
                        Reativar
                    </MenuItem>
                    <MenuItem icon={<EditIcon />} onClick={handleEditButton}>
                        Editar
                    </MenuItem>
                </MenuList>
            </Menu>
            <ModalStyled title="Desativar"
                onClose={deleteUniqueModal.onClose}
                open={deleteUniqueModal.isOpen}
                isCentered={true}
            >
                <ModalBody>
                    <Text>
                        Você está prestes a desativar o patrimônio de registro {componentData?.Patrimonio}. Deseja prosseguir com a operação?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme="red" rightIcon={<DeleteIcon />} onClick={handleDelete} >Confirmar desativação</Button>
                        <Button onClick={deleteUniqueModal.onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </ModalStyled>

            <ModalStyled title="Reativar"
                onClose={enableUniqueModal.onClose}
                open={enableUniqueModal.isOpen}
                isCentered={true}
            >
                <ModalBody>
                    <Text>
                        Você está prestes a reativar o patrimônio de registro {componentData?.Patrimonio}. Deseja prosseguir com a operação?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme="teal" onClick={handleEnable} >Confirmar reativação</Button>
                        <Button onClick={enableUniqueModal.onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </ModalStyled>

            <ModalStyled title={`Editar patrimônio nº ${componentData?.Patrimonio}.`}
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
                    companyData={companyData}
                    categoryData={categoryData}
                    departmentData={departmentData}
                    manufacturerData={manufacturerData}
                    roomData={roomData}
                    situationData={situationData}
                />
            </ModalStyled>


            <ModalStyled title="Visualizar"
                onClose={viewModal.onClose}
                open={viewModal.isOpen}
                isCentered={true}
            >
                <ModalBody>
                    <Box my={'10px'} display={'flex'} flexDirection={'column'}>
                        {inputArray.map(input =>
                            <>
                                <FormLabel>{input.label}</FormLabel>
                                <Input
                                    value={input.defaultValue?.toString()}
                                />
                            </>
                        )}


                    </Box>

                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button onClick={viewModal.onClose}>Fechar</Button>
                    </Box>
                </ModalFooter>
            </ModalStyled>
        </>

    )
}