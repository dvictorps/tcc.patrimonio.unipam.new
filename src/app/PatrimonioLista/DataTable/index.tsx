'use client'
import { useReactTable, getCoreRowModel, flexRender, ColumnDef } from "@tanstack/react-table";
import { ChangeEvent, Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    Box,
    IconButton,
    Input,
    Button,
    Select,
    Text,
    Accordion,
    ModalFooter,
    ModalBody,
    useDisclosure,
    Divider,
    Spinner
} from '@chakra-ui/react'
import { DeleteIcon, ArrowForwardIcon, ArrowBackIcon, AddIcon, CheckIcon, Search2Icon } from "@chakra-ui/icons";
import { SelectOptions, ArrayType, Situation, Equipamento, EquipamentoFormated, Company, Category, Manufacturer, Department } from "@/utils/types";
import { AccordionItemStyled } from "../../../components/Accordion/AccordionItemStyled";
import { UseQueryResult } from "react-query";
import React from "react";
import { ModalStyled } from "../../../components/Modal";
import { useApi } from "@/context/ApiContext";
import { EquipmentInputModal } from "./EquipmentInputModal";
import { useForm } from "react-hook-form";
import ExcelJS from 'exceljs'

const selectResultsOptions = [
    10,
    20,
    30,
    50
]

export type DataTableType<QueryResult> = {
    column: ColumnDef<QueryResult>[]
    searchSelectOptions: SelectOptions[]
    arrayLength: ArrayType
    idPosit: string[]
    dataQuery: UseQueryResult<{
        data: QueryResult[];
        totalRecords: number;
    }, unknown>
    selectOption: SelectOptions
    setSelectOption: Dispatch<SetStateAction<{
        label: string;
        value: string;
    }>>
    setSearchValue: Dispatch<SetStateAction<string>>
    situationValue: Situation
    setSituationValue: Dispatch<SetStateAction<Situation>>
    setCompanyValue: Dispatch<SetStateAction<Company>>
    setCategoryValue: Dispatch<SetStateAction<Category>>
    setManufacturerValue: Dispatch<SetStateAction<Manufacturer>>
    setDepartmentValue: Dispatch<SetStateAction<Department>>
    companyValue: Company
    categoryValue: Category
    manufacturerValue: Manufacturer
    departmentValue: Department
    situationData: Situation[]
    dataQueryFull: UseQueryResult<{
        data: QueryResult[];
        totalRecords: number;
    }, unknown>
}

export default function DataTable<QueryResult>({ column, searchSelectOptions, arrayLength, idPosit, dataQuery, selectOption, setSearchValue,
    setSelectOption, situationValue, setSituationValue, situationData, dataQueryFull, categoryValue, companyValue, departmentValue, manufacturerValue,
    setCategoryValue, setCompanyValue, setDepartmentValue, setManufacturerValue
}: DataTableType<QueryResult>) {

    const { patch, rowSelection, setRowSelection, deleteIds, pageIndex, pageSize, setPagination, companyData, categoryData, manufacturerData, departmentData, roomData, post } = useApi()

    function setSelectedOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = searchSelectOptions.find(option => option.value === event.target.value)
        if (option) return setSelectOption(option)
    }

    function setSelectedSituation(event: ChangeEvent<HTMLSelectElement>) {
        const option = situationData.find(situation => situation.IdSituacaoEquipamento?.toString() === event.target.value)
        if (option) return (setSituationValue(option), setRowSelection({}))
        const all: Situation = {
            DescricaoSituacaoEquipamento: 'Todos',
            IdSituacaoEquipamento: '' as unknown as number
        }

        return (setSituationValue(all), setRowSelection({}))
    }

    function setSelectedDepartment(event: ChangeEvent<HTMLSelectElement>) {
        const option = departmentData.find(department => department.IdDepartamento?.toString() === event.target.value)
        if (option) return (setDepartmentValue(option), setRowSelection({}))
        const all: Department = {
            NomeDepartamento: 'Todos',
            IdDepartamento: '' as unknown as number
        }
        return (setDepartmentValue(all), setRowSelection({}))
    }

    function setSelectedManufacturer(event: ChangeEvent<HTMLSelectElement>) {
        const option = manufacturerData.find(manufacturer => manufacturer.IdFabricante?.toString() === event.target.value)
        if (option) return (setManufacturerValue(option), setRowSelection({}))
        const all: Manufacturer = {
            NomeFabricante: 'Todos',
            IdFabricante: '' as unknown as number
        }
        return (setManufacturerValue(all), setRowSelection({}))
    }

    function setSelectedCategory(event: ChangeEvent<HTMLSelectElement>) {
        const option = categoryData.find(category => category.IdCategoriaEquipamento?.toString() === event.target.value)
        if (option) return (setCategoryValue(option), setRowSelection({}))
        const all: Category = {
            DescricaoCategoriaEquipamento: 'Todas',
            IdCategoriaEquipamento: '' as unknown as number
        }
        return (setCategoryValue(all), setRowSelection({}))
    }

    function setSelectedCompany(event: ChangeEvent<HTMLSelectElement>) {
        const option = companyData.find(company => company.IdEmpresa?.toString() === event.target.value)
        if (option) return (setCompanyValue(option), setRowSelection({}))
        const all: Company = {
            NomeEmpresa: 'Todas',
            IdEmpresa: '' as unknown as number
        }
        return (setCompanyValue(all), setRowSelection({}))
    }

    const defaultData = useMemo(() => [], [])

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )

    const table = useReactTable<QueryResult>({
        data: dataQuery.data?.data ?? defaultData, columns: column,
        pageCount: dataQuery.data?.totalRecords ?? -1,
        getCoreRowModel: getCoreRowModel(),
        manualPagination: true,
        state: {
            pagination,
            rowSelection
        },
        onPaginationChange: setPaginationSetRowSelection,
        onRowSelectionChange: setRowSelection,
        enableRowSelection: true,
    })

    function setPaginationSetRowSelection(id: any) {
        setPagination(id),
            setRowSelection({})
    }

    function DisableButton() {
        const pageCounters = dividirEArredondar(arrayLength.pageCount, pagination.pageSize)
        if (table.getState().pagination.pageIndex + 1 === pageCounters) return true
        return false
    }

    async function Rerender() {
        await dataQuery.refetch()
        await dataQueryFull.refetch()
        table.setPageIndex(0)
        setRowSelection({})
    }


    const idsComBaseNaPosicaoStyled = idPosit.join('');

    function disableDeleteButton(array: number[], situation: number) {
        if (array.length > 1 && situation === 1) return 'auto'
        return 'none'
    }

    function disableEnableButton(array: number[], situation: number) {
        if (array.length > 1 && situation === 2) return 'auto'
        return 'none'
    }

    function dividirEArredondar(numero1: number, numero2: number) {
        const resultado = numero1 / numero2;
        const sobra = resultado % 1;
        if (sobra > 0) {
            return Math.floor(resultado) + 1;
        } else {
            return Math.floor(resultado);
        }
    }

    function setSelectedPageSizeOption(event: ChangeEvent<HTMLSelectElement>) {
        const option = selectResultsOptions.find(option => option.toString() === event.target.value)
        if (option) return table.setPageSize(option)
    }

    const deleteMultipleDataModal = useDisclosure()
    const enableMultipleDataModal = useDisclosure()
    const createDataModal = useDisclosure()

    async function handleDeleteMultiple() {
        try {
            const response = await patch<QueryResult>(`/equipment/disable?${idsComBaseNaPosicaoStyled}`, '2');
            console.log('Resposta Disable:', response.data);
            setRowSelection({})
            table.setPageIndex(0)
            await dataQuery.refetch()

        } catch (error) {
            console.log('Erro no Disable:', error);
        }

        deleteMultipleDataModal.onClose()
    };

    async function handleEnableMultiple() {
        try {
            const response = await patch<QueryResult>(`/equipment/enable?${idsComBaseNaPosicaoStyled}`, '1');
            setRowSelection({})
            table.setPageIndex(0)
            await dataQuery.refetch()

        } catch (error) {
            console.log('Erro no Enable:', error);
        }

        enableMultipleDataModal.onClose()
    };

    async function handlePost(data: Equipamento) {
        try {
            const response = await post<Equipamento>(`equipment/register`, data)
            console.log('Resposta add:', response)
            setRowSelection({})
            await dataQuery.refetch()


        } catch (error) {
            console.log('Erro no add', error);
        }
        createDataModal.onClose()
    }

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm()

    const onSubmit = async (data: any) => {

        await handlePost(data);
        reset();

    }

    const generateExcel = async () => {
        await Rerender();
        const workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet('Planilha de Dados');
        const dataFull = dataQueryFull.data?.data as EquipamentoFormated[]

        const headerRow = worksheet.addRow(['Patrimonio', 'NumeroSerial', 'Sala', 'Departamento'
            , 'SituacaoEquipamento', 'DescricaoEquipamento', 'DataAquisicao', 'Vencimento Garantia', 'DataCadastro', 'DataModificacao', 'Empresa', 'CategoriaEquipamento', 'Fabricante']);

        headerRow.eachCell((cell) => {
            cell.font = { bold: true };
            cell.alignment = { horizontal: 'center' };
        });

        dataFull.forEach((item) => {
            const rowData = Object.values(item);
            rowData.pop()
            rowData.shift()
            worksheet.addRow(rowData)

        });

        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'planilha.xlsx';
            a.click();
            URL.revokeObjectURL(url);
        });
    };

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem' >
            <Accordion defaultIndex={[0]} allowToggle colorScheme='blackAlpha' >
                <AccordionItemStyled title='Filtros Avançados'>
                    <Box display={'flex'} flexDirection={'column'}>
                        <Box p='1rem' display={'flex'} flexDirection={'row'} gap={'1rem'}>
                            <Box display={'flex'} flexDirection={'column'}>
                                <Text>Selecione uma opção para filtrar</Text>
                                <Box display={'flex'} flexDirection={'column'} gap={'1rem'}>
                                    <Select placeholder='Selecionar opção' width={'250px'} onChange={setSelectedOption} defaultValue={selectOption.value}>
                                        {searchSelectOptions.map(
                                            selectOption =>
                                                <option value={selectOption.value} key={selectOption.value}>
                                                    {selectOption.label}
                                                </option>
                                        )}
                                    </Select>
                                    <Input placeholder="Pesquisar selecionado" w={'250px'} onChange={event => setSearchValue(event.target.value)} />
                                </Box>
                            </Box>
                            <Box display={'flex'} flexDirection={'row'} flexWrap={'wrap'} gap={'1rem'}>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Text>Selecionar situação equipamento</Text>
                                    <Select placeholder='Selecionar Situação' width={'250px'} onChange={setSelectedSituation} defaultValue={situationValue.IdSituacaoEquipamento}>
                                        {situationData.map(
                                            situation =>
                                                <option value={situation.IdSituacaoEquipamento} key={situation.IdSituacaoEquipamento}>
                                                    {situation.DescricaoSituacaoEquipamento}
                                                </option>
                                        )}

                                    </Select>

                                </Box>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Text>Selecionar Empresa</Text>
                                    <Select placeholder='Selecionar empresa' width={'250px'} onChange={setSelectedCompany} defaultValue={companyValue.IdEmpresa}>
                                        {companyData.map(
                                            company =>
                                                <option value={company.IdEmpresa} key={company.IdEmpresa}>
                                                    {company.NomeEmpresa}
                                                </option>
                                        )}

                                    </Select>
                                </Box>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Text>Selecionar Fabricante</Text>
                                    <Select placeholder='Selecionar fabricante' width={'250px'} onChange={setSelectedManufacturer} defaultValue={manufacturerValue.IdFabricante}>
                                        {manufacturerData.map(
                                            manufacturer =>
                                                <option value={manufacturer.IdFabricante} key={manufacturer.IdFabricante}>
                                                    {manufacturer.NomeFabricante}
                                                </option>
                                        )}

                                    </Select>
                                </Box>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Text>Selecionar Departamento</Text>
                                    <Select placeholder='Selecionar departamento' width={'250px'} onChange={setSelectedDepartment} defaultValue={departmentValue.IdDepartamento}>
                                        {departmentData.map(
                                            department =>
                                                <option value={department.IdDepartamento} key={department.IdDepartamento}>
                                                    {department.NomeDepartamento}
                                                </option>
                                        )}

                                    </Select>
                                </Box>
                                <Box display={'flex'} flexDirection={'column'}>
                                    <Text>Selecionar Categoria</Text>
                                    <Select placeholder='Selecionar categoria' width={'250px'} onChange={setSelectedCategory} defaultValue={categoryValue.IdCategoriaEquipamento}>
                                        {categoryData.map(
                                            category =>
                                                <option value={category.IdCategoriaEquipamento} key={category.IdCategoriaEquipamento}>
                                                    {category.DescricaoCategoriaEquipamento}
                                                </option>
                                        )}

                                    </Select>
                                </Box>
                            </Box>
                        </Box>
                        <Box justifyContent={'space-between'} display={'flex'} mt={'0.5rem'}>
                            <Box gap={'1rem'} display={'flex'}>
                                <Button colorScheme={'green'} onClick={Rerender} rightIcon={<Search2Icon />}>Aplicar filtro</Button>
                                <Button colorScheme="facebook" onClick={generateExcel}>Gerar relatório com base nos filtros</Button>
                                <Button display={disableDeleteButton(deleteIds, parseInt(situationValue.IdSituacaoEquipamento?.toString() || ''))} colorScheme="red" onClick={deleteMultipleDataModal.onOpen} rightIcon={<DeleteIcon />}>Desativar</Button>
                                <Button display={disableEnableButton(deleteIds, parseInt(situationValue.IdSituacaoEquipamento?.toString() || ''))} colorScheme="teal" onClick={enableMultipleDataModal.onOpen}>Reativar</Button>
                            </Box>
                            <Button colorScheme={'blue'} onClick={createDataModal.onOpen} rightIcon={<AddIcon />}>Adicionar Registro</Button>

                        </Box>
                    </Box>
                </AccordionItemStyled>
            </Accordion>
            <Box overflowX={'auto'} overflowY={'auto'} >
                <Table variant='simple' colorScheme='blue'>
                    <Thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <Tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => <Th key={header.id}>
                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                </Th>)}
                            </Tr>
                        ))}
                    </Thead>
                    <Tbody>
                        {table.getRowModel().rows.map(row => (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map(cell => (
                                    <Td key={cell.id}>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}

                                    </Td>
                                ))}
                            </Tr>
                        ))}
                    </Tbody>
                    <Tfoot>
                        {table.getFooterGroups().map(footerGroup => (
                            <Tr key={footerGroup.id}>
                                {footerGroup.headers.map(header =>
                                    <Th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </Th>)
                                }
                            </Tr>
                        ))}
                    </Tfoot>
                </Table>
            </Box>
            <Box display={'flex'} gap={'0.4rem'} p={'1rem'}>
                <Button colorScheme="teal" onClick={() => table.setPageIndex(0)}
                    isDisabled={!table.getCanPreviousPage()}>{'<<'}</Button>
                <IconButton colorScheme="teal" aria-label='back' onClick={() => table.previousPage()} isDisabled={!table.getCanPreviousPage()} icon={<ArrowBackIcon />} />
                <IconButton colorScheme="teal" aria-label='foward' onClick={() => table.nextPage()} isDisabled={DisableButton()} icon={<ArrowForwardIcon />} />
                <Button colorScheme="teal" onClick={() => table.setPageIndex(dividirEArredondar(arrayLength.pageCount, pagination.pageSize) - 1)}
                    isDisabled={DisableButton()}>{'>>'}</Button>
                <Box justifyContent={'space-between'} display={'flex'} width={'100%'} alignItems={'center'}>
                    Página {table.getState().pagination.pageIndex + 1} de {dividirEArredondar(arrayLength.pageCount, pagination.pageSize)}
                    {dataQuery.isFetching ? <Spinner /> : null}
                    <Box display={'flex'} justifyContent={'auto'}>
                        <Text>Resultados por página:</Text>
                        <Select onChange={setSelectedPageSizeOption}>
                            {selectResultsOptions.map(option =>
                            (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </Select>
                    </Box>
                </Box>
            </Box>
            <ModalStyled title="Remover"
                onClose={deleteMultipleDataModal.onClose}
                open={deleteMultipleDataModal.isOpen}
                isCentered={true}>
                <ModalBody>
                    <Text>
                        Você está prestes a desativar {deleteIds.length} registros. Deseja prosseguir com a operação?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme="red" rightIcon={<DeleteIcon />} onClick={handleDeleteMultiple}>Confirmar desativação</Button>
                        <Button onClick={deleteMultipleDataModal.onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </ModalStyled>
            <ModalStyled title="Remover"
                onClose={enableMultipleDataModal.onClose}
                open={enableMultipleDataModal.isOpen}
                isCentered={true}
            >
                <ModalBody>
                    <Text>
                        Você está prestes a reativar {deleteIds.length} registros. Deseja prosseguir com a operação?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme="teal" rightIcon={<DeleteIcon />} onClick={handleEnableMultiple}>Confirmar reativação</Button>
                        <Button onClick={enableMultipleDataModal.onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </ModalStyled>
            <ModalStyled title={`Adicionar patrimônio`}
                onClose={createDataModal.onClose}
                open={createDataModal.isOpen}
                isCentered={true}
            >
                <EquipmentInputModal
                    errors={errors}
                    handleSubmit={handleSubmit}
                    onClose={createDataModal.onClose}
                    onSubmit={onSubmit}
                    register={register}
                    companyData={companyData}
                    categoryData={categoryData}
                    departmentData={departmentData}
                    manufacturerData={manufacturerData}
                    roomData={roomData}
                    situationData={situationData}
                />
            </ModalStyled>
        </Box>
    )
}