'use client'
import { useReactTable, getCoreRowModel, flexRender, PaginationState, ColumnDef, getPaginationRowModel } from "@tanstack/react-table";
import { ChangeEvent, HTMLProps, useEffect, useMemo, useReducer, useRef, useState } from "react";
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
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Select,
    Text,
    Accordion,
    ModalFooter,
    ModalBody,
    useDisclosure,
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon, HamburgerIcon, ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { api } from "@/api/api";
import { Category, Company, Department, Manufacturer, Equipamento, Situation, ReqData } from "@/utils/types";
import { AccordionItemStyled } from "../Accordion/AccordionItemStyled";
import { useQuery } from "react-query";
import React from "react";
import { ModalStyled } from "../Modal";
import { useApi } from "@/context/ApiContext";

const searchSelectOptions = [
    {
        label: 'Nº de Patrimonio',
        value: 'searchPatrim'
    },
    {
        label: 'Serial',
        value: 'searchSerial'
    },
    {
        label: 'Descrição',
        value: 'searchDesc'
    },
]

const selectResultsOptions = [
    10,
    20,
    30,
    50
]

type ArrayType = {
    arrayLength: number,
    pageCount: number
}

type DataTableType = {
    column: ColumnDef<Equipamento>[]
}

export default function DataTable({ column }: DataTableType) {

    const [searchValue, setSearchValue] = useState('')

    const [selectOption, setSelectOption] = useState(searchSelectOptions[0]);
    const [categoryData, setCategoryData] = useState<Category[]>([]);
    const [companyData, setCompanyData] = useState<Company[]>([]);
    const [manufacturerData, setManufacturerData] = useState<Manufacturer[]>([]);
    const [departmentData, setDepartmentData] = useState<Department[]>([]);
    const [situationData, setSituationData] = useState<Situation[]>([]);

    function setSelectedOption(event: ChangeEvent<HTMLSelectElement>) {

        const option = searchSelectOptions.find(option => option.value === event.target.value)

        if (option) return setSelectOption(option)
    }

    const [{ pageIndex, pageSize }, setPagination] =
        useState<PaginationState>({
            pageIndex: 0,
            pageSize: 10,
        })

    const fetchDataOptions = {
        pageIndex,
        pageSize,
    }

    const dataQuery = useQuery(
        ['data', fetchDataOptions],
        () => fetchTableData(fetchDataOptions),
        { keepPreviousData: true }
    )

    const defaultData = useMemo(() => [], [])

    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize,
        }),
        [pageIndex, pageSize]
    )


    const [arrayLength, setArrayLength] = useState({
        arrayLength: 0,
        pageCount: 0
    } as ArrayType)

    async function fetchTableData(options: {
        pageIndex: number
        pageSize: number
    }) {
        try {
            const response = await api.get(`/equipment?${selectOption.value}=${searchValue}&take=${options.pageSize}&skip=${options.pageIndex * options.pageSize}`)
            const responseTyped: ReqData = response.data
            setArrayLength({ arrayLength: responseTyped.data.length, pageCount: responseTyped.totalRecords } as ArrayType)
            return { rows: responseTyped.data, pageCount: responseTyped.totalRecords }
        } catch (error) {
            console.log(error)
        }
    }

    async function fetchTableDescriptionData() {

        const urls = [
            '/category',
            '/company',
            '/manufacturer',
            '/department',
            '/situation'
        ]


        const requests = urls.map((url) => api.get(url));

        Promise.all(requests)
            .then((responses) => {

                const category = responses[0].data;
                const company = responses[1].data;
                const manufacturer = responses[2].data;
                const department = responses[3].data;
                const situation = responses[4].data;

                setCategoryData(category);
                setCompanyData(company);
                setManufacturerData(manufacturer);
                setDepartmentData(department);
                setSituationData(situation);



            })
            .catch((error) => {
                console.error('Erro nas requisições:', error);
            });
    }


    useEffect(() => {

        fetchTableDescriptionData();

    }, [])


    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data: dataQuery.data?.rows ?? defaultData, columns: column,
        pageCount: dataQuery.data?.pageCount ?? -1,
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

    function DisableButton(object: ArrayType) {
        if (object.arrayLength < pagination.pageSize) return true
        if (object.arrayLength < object.pageCount) return false
        if (object.arrayLength = object.pageCount) return true


        return false

    }


    async function Rerender() {
        await dataQuery.refetch()
        setRowSelection({})
    }


    const deleteIds: number[] = []


    for (const key in rowSelection) {
        deleteIds.push(Number(key))
    }

    const idsComBaseNaPosicao = deleteIds.map((posicao) => {
        if (posicao >= 0 && posicao < arrayLength.arrayLength) {
            return (`&equipments=${dataQuery.data?.rows[posicao].IdEquipamento}`)
        }
        return undefined;
    });

    const idsComBaseNaPosicaoStyled = idsComBaseNaPosicao.join('');

    function renderDeleteButton(array: number[]) {

        if (array.length > 1) return 'auto'

        return 'none'

    }

    function dividirEArredondar(numero1: number, numero2: number) {
        const resultado = numero1 / numero2;
        const resultadoArredondado = Math.floor(resultado);
        return resultadoArredondado;
    }


    function setSelectedPageSizeOption(event: ChangeEvent<HTMLSelectElement>) {

        const option = selectResultsOptions.find(option => option.toString() === event.target.value)

        if (option) return table.setPageSize(option)
    }

    const deleteMultipleDataModal = useDisclosure()

    const { post, delete: deleteRequest } = useApi();

    console.log(`/equipment/delete?${idsComBaseNaPosicaoStyled}`)

    const handleDeleteMultiple = async () => {
        try {
            const response = await deleteRequest(`/equipment/delete?${idsComBaseNaPosicaoStyled}`);
            console.log('Resposta DELETE:', response.data);
            await dataQuery.refetch()
            setRowSelection({})
        } catch (error) {
            console.log('Erro no DELETE:', error);
        }

        deleteMultipleDataModal.onClose()
    };

    return (
        <Box borderRadius={'6px'} shadow={'outline'} m='1rem' >
            <Accordion defaultIndex={[0]} allowToggle colorScheme='blackAlpha' >
                <AccordionItemStyled title='Filtros Avançados'>
                    <Box p='1rem'>
                        <Box display={'flex'} flexDirection={'column'}>
                            <Text>Selecione uma opção para busca</Text>
                            <Box display={'flex'} flexDirection={'row'} gap={'1rem'}>
                                <Select placeholder='Selecionar opção' width={'250px'} onChange={setSelectedOption} defaultValue={selectOption.value}>
                                    {searchSelectOptions.map(
                                        selectOption =>
                                            <option value={selectOption.value} key={selectOption.value}>
                                                {selectOption.label}
                                            </option>
                                    )}
                                </Select>
                                <Input placeholder="Pesquisar" w={'250px'} onChange={event => setSearchValue(event.target.value)} />
                                <Button onClick={Rerender}>Pesquisar</Button>
                                <Button display={renderDeleteButton(deleteIds)} colorScheme="red" onClick={deleteMultipleDataModal.onOpen} rightIcon={<DeleteIcon />}>Remover</Button>
                            </Box>
                        </Box>
                    </Box>
                </AccordionItemStyled>
            </Accordion>
            <Box overflowX={'auto'} overflowY={'auto'}>
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
                <IconButton colorScheme="teal" aria-label='foward' onClick={() => table.nextPage()} isDisabled={DisableButton(arrayLength)} icon={<ArrowForwardIcon />} />
                <Button colorScheme="teal" onClick={() => table.setPageIndex(dividirEArredondar(table.getPageCount(), pagination.pageSize))}
                    isDisabled={DisableButton(arrayLength)}>{'>>'}</Button>
                {dataQuery.isFetching ? 'Loading...' : null}
                <Box justifyContent={'space-between'} display={'flex'} width={'100%'} alignItems={'center'}>
                    Página {table.getState().pagination.pageIndex + 1} de {dividirEArredondar(table.getPageCount(), pagination.pageSize) + 1}

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
                isCentered={true}
            >
                <ModalBody>
                    <Text>
                        Você está prestes a remover {deleteIds.length} registros. Deseja prosseguir com a operação?
                    </Text>
                </ModalBody>
                <ModalFooter>
                    <Box display={'inline-flex'} gap={'1rem'}>
                        <Button colorScheme="red" rightIcon={<DeleteIcon />} onClick={handleDeleteMultiple}>Confirmar remoção</Button>
                        <Button onClick={deleteMultipleDataModal.onClose}>Cancel</Button>
                    </Box>
                </ModalFooter>
            </ModalStyled>
        </Box>
    )
}