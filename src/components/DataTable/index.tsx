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
} from '@chakra-ui/react'
import { DeleteIcon, EditIcon, HamburgerIcon, ArrowForwardIcon, ArrowBackIcon } from "@chakra-ui/icons";
import { api } from "@/api/api";
import { Category, Company, Department, Manufacturer, Equipamento, Situation, ReqData } from "@/utils/types";
import { AccordionItemStyled } from "../Accordion/AccordionItemStyled";
import { useQuery } from "react-query";

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



export default function DataTable() {

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


    console.log('Page Index:', pagination.pageIndex)
    console.log('Page Size:', pagination.pageSize)


    console.log('teste de input:', selectOption)
    console.log('pesquisa teste:', searchValue)

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


    function ActionMenu() {
        return (
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
                    <MenuItem icon={<DeleteIcon />}>
                        Remover
                    </MenuItem>
                </MenuList>
            </Menu>
        )
    }

    function IndeterminateCheckbox({
        indeterminate,
        className = '',
        ...rest
    }: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
        const ref = useRef<HTMLInputElement>(null!)

        useEffect(() => {
            if (typeof indeterminate === 'boolean') {
                ref.current.indeterminate = !rest.checked && indeterminate
            }
        }, [ref, indeterminate])

        return (
            <input
                type="checkbox"
                ref={ref}
                className={className + ' cursor-pointer'}
                {...rest}
            />
        )
    }

    const columns: ColumnDef<Equipamento>[] = [
        {
            id: 'select',
            header: ({ table }) => (
                <IndeterminateCheckbox
                    {...{
                        checked: table.getIsAllRowsSelected(),
                        indeterminate: table.getIsSomeRowsSelected(),
                        onChange: table.getToggleAllRowsSelectedHandler(),
                    }}
                />
            ),
            cell: ({ row }) => (
                <div className="px-1">
                    <IndeterminateCheckbox
                        {...{
                            checked: row.getIsSelected(),
                            disabled: !row.getCanSelect(),
                            indeterminate: row.getIsSomeSelected(),
                            onChange: row.getToggleSelectedHandler(),
                        }}
                    />
                </div>
            ),
        },
        {
            header: 'Nº Patrimônio',
            accessorKey: 'Patrimonio'
        },
        {
            header: 'Tipo Equipamento',
            accessorKey: 'IdCategoriaEquipamento',
            cell: info => getCategory(info.getValue<number>()),
        },
        {
            header: 'Situação Equipamento',
            accessorKey: 'IdSituacaoEquipamento',
            cell: info => getSituation(info.getValue<number>()),
        },
        {
            header: 'Número Serial',
            accessorKey: 'NumeroSerial'
        },
        {
            header: 'Data Aquisição',
            accessorKey: 'DataAquisicao',
            cell: info => new Date(info.getValue<string>()).toLocaleDateString(),
        },
        {
            header: 'Data Cadastro',
            accessorKey: 'DataCadastro',
            cell: info => new Date(info.getValue<string>()).toLocaleDateString(),
        },
        {
            header: 'Data Modificação',
            accessorKey: 'DataModificacao',
            cell: info => formatDateTime(info.getValue<string>()),
        },
        {
            header: 'Empresa',
            accessorKey: 'IdEmpresa',
            cell: info => getCompany(info.getValue<number>()),
        },
        {
            header: 'Fabricante',
            accessorKey: 'IdFabricante',
            cell: info => getManufacturer(info.getValue<number>()),
        },
        {
            header: 'Departamento',
            accessorKey: 'IdDepartamento',
            cell: info => getDepartment(info.getValue<number>()),
        },
        {
            header: 'Ações',
            cell: () => ActionMenu()
        }
    ]

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


    function formatDateTime(date: Date | string | null) {

        if (date === null) return 'Não modificado'

        return new Date(date).toLocaleDateString()

    }
    const [rowSelection, setRowSelection] = useState({})

    const table = useReactTable({
        data: dataQuery.data?.rows ?? defaultData, columns,
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

    console.log('rows selecionadas:', rowSelection, 'pagina:', pagination.pageIndex, 'dados:', dataQuery.data?.rows)

    const deleteIds: number[] = []

    console.log('AQUIIIII', arrayLength.arrayLength, arrayLength.pageCount, dataQuery.data?.pageCount, pagination.pageIndex)

    for (const key in rowSelection) {
        deleteIds.push(Number(key))
    }

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
                                <Button display={renderDeleteButton(deleteIds)} colorScheme="red" rightIcon={<DeleteIcon />}>Remover</Button>
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

        </Box>
    )
}